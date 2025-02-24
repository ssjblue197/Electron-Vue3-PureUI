import * as z from 'zod';

import {
  UnwrapRef,
  reactive,
  ref,
  toRaw,
  toRefs,
} from 'vue';
import {
  getNestedValue,
  setNestedValue,
} from '@/utils/object';

interface FormConfig<T> {
  // Event triggering validation
  mode?:
    | 'onBlur'
    | 'onChange'
    | 'onSubmit'
    | 'onTouched'
    | 'all';
  // Set default values
  initialValues: T;
  //Catch validation errors
  errors?: Array<z.ZodIssue>;
  /*
    When set to firstError (default), only the first error from each field will be gathered.
    When set to all, all errors from each field will be gathered.
    */
  criteriaMode?: 'all' | 'firstError';
  //When set to true (default), and the user submits a form that fails validation, focus is set on the first field with an error.
  shouldFocusError?: boolean;
  schema: z.ZodType<T>;
}
export function useForm<T>({
  mode = 'onSubmit',
  initialValues,
  errors = [],
  criteriaMode = 'all',
  shouldFocusError = true,
  schema,
}: FormConfig<T>) {
  const state = reactive({
    values: initialValues,
    errors: {},
    touched: {},
  });

  const errorList = ref<any[]>(errors);

  const validateField = (name: string, value: any) => {
    try {
      (schema as any).shape[name].parse(value);
      (state.errors as Record<string, string>)[name] = '';
      errorList.value = errorList.value.filter(
        (error) => error.path[0] !== name,
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        const err = error as z.ZodError;
        const issue = err.errors[0];
        (state.errors as Record<string, string>)[name] =
          issue.message;
        errorList.value.push(issue);
      }
    }
  };

  const handleChange = (e: Event) => {
    const { name, value } = e.target as HTMLInputElement;
    setNestedValue(state.values as any, name, value);
    if (mode === 'onChange' || mode === 'all') {
      validateField(name, value);
    }
  };

  const handleBlur = (e: Event) => {
    const { name, value } = e.target as HTMLInputElement;
    (state.touched as Record<string, boolean>)[name] = true;
    if (mode === 'onBlur' || mode === 'all') {
      validateField(name, value);
    }
  };

  const handleTouch = (e: Event) => {
    const { name, value } = e.target as HTMLInputElement;
    setNestedValue(state.values as any, name, value);
    (state.touched as Record<string, boolean>)[name] = true;
    (state.errors as Record<string, string>)[name] = '';
    if (mode === 'onTouched' || mode === 'all') {
      validateField(name, value);
    }
  };

  const handleSubmit = (onSubmit: (values: T) => void) => {
    errorList.value = [];
    const newErrors: Record<string, string> = {};
    try {
      schema.parse(state.values);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const err = error as z.ZodError;
        if (criteriaMode === 'firstError') {
          let flag = false;
          err.issues.forEach(({ path, message }) => {
            if (!newErrors[path.join('.')] && !flag) {
              flag = true;
              newErrors[path[0]] = message;
              errorList.value.push({
                path,
                message,
              });
            }
          });
        } else {
          err.issues.forEach(({ path, message }) => {
            newErrors[path.join('.')] = message;
            errorList.value.push({
              path,
              message,
            });
          });
        }
      }
    }

    state.errors = newErrors;

    console.log('errorList.value', newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit(toRaw(state.values));
    } else if (shouldFocusError) {
      const firstErrorField = Object.keys(newErrors)[0];

      const currentFormField =
        (
          document.querySelector(
            `[name="${firstErrorField}"]`,
          ) as HTMLElement
        )?.querySelector('p-input') ||
        (
          document.querySelector(
            `[name="${firstErrorField}"]`,
          ) as HTMLElement
        )?.querySelector('p-textarea') ||
        (
          document.querySelector(
            `[name="${firstErrorField}"]`,
          ) as HTMLElement
        )?.querySelector('p-select') ||
        (
          document.querySelector(
            `[name="${firstErrorField}"]`,
          ) as HTMLElement
        )?.querySelector('p-checkbox') ||
        (
          document.querySelector(
            `[name="${firstErrorField}"]`,
          ) as HTMLElement
        )?.querySelector('p-toggle') ||
        (
          document.querySelector(
            `[name="${firstErrorField}"]`,
          ) as HTMLElement
        )?.querySelector('p-switch') ||
        (
          document.querySelector(
            `[name="${firstErrorField}"]`,
          ) as HTMLElement
        )?.querySelector('p-color-picker') ||
        (
          document.querySelector(
            `[name="${firstErrorField}"]`,
          ) as HTMLElement
        )?.querySelector('p-file-upload');

      currentFormField?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      currentFormField?.focus();
    }
  };

  const getFieldValue = (key: keyof T) => {
    return getNestedValue(state.values as any, String(key));
  };

  const setFieldValue = (
    key: keyof T,
    value: string | number,
  ): void => {
    setNestedValue(state.values as any, String(key), value);
  };

  const getValues = () => {
    return state.values;
  };

  const setValues = (values: Record<keyof T, unknown>) => {
    state.values = {
      ...(state.values as Record<keyof T, unknown>),
      ...values,
    } as UnwrapRef<T>;
  };

  const resetForm = () => {
    state.values = initialValues as UnwrapRef<T>;
  };

  return {
    schema,
    ...toRefs(state),
    handleChange,
    handleBlur,
    handleTouch,
    handleSubmit,
    values: toRaw(state.values),
    getFieldValue,
    setFieldValue,
    getValues,
    setValues,
    resetForm,
  };
}
