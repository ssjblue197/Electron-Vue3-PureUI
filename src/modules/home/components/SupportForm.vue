<template>
  <Form
    class="relative w-full"
    id="support-form"
    :form="form"
    @submit="handleSubmit"
  >
    <div class="relative flex w-full flex-col gap-xl">
      <div
        class="relative flex w-full items-start gap-4xl"
        v-if="props.selectedReason === 2"
      >
        <div
          class="w-[160px] text-sm font-medium text-gray-700"
        >
          Select issue*
        </div>
        <div class="relative flex-1">
          <FormField
            :value="form.values.issue"
            :form="form"
            element="select"
            placeholder="Faded/Coloring issue"
            name="issue"
            class="w-full"
          >
            <p-option
              v-for="c in ISSUE_LIST"
              :key="c"
              :value="c?.value"
              >{{ c?.title }}</p-option
            >
          </FormField>
        </div>
      </div>
      <div class="relative flex w-full items-start gap-4xl">
        <div
          class="w-[160px] text-sm font-medium text-gray-700"
        >
          Email*
        </div>
        <div class="relative flex-1">
          <FormField
            :value="form.values.email"
            :form="form"
            element="input"
            placeholder="name@email.com"
            name="email"
            class="w-full"
          >
            <p-tooltip
              content="Please enter a valid email"
              slot="suffix"
              hoist
            >
              <p-icon
                name="help-circle"
                library="custom"
                class="mx-3 text-gray-500"
              >
              </p-icon>
            </p-tooltip>
          </FormField>
        </div>
      </div>
      <div class="relative flex w-full items-start gap-4xl">
        <div
          class="w-[160px] text-sm font-medium text-gray-700"
        >
          Your preferred resolution*
        </div>
        <div class="relative flex-1">
          <FormField
            :value="form.values.solution"
            :form="form"
            element="radio-group"
            name="solution"
            class="w-full"
          >
            <p-radio-button value="refund" class="w-[180px]"
              >Refund</p-radio-button
            >
            <p-radio-button
              value="replacement"
              class="w-[180px]"
              >Replacement</p-radio-button
            >
            <p-radio-button
              value="no_need"
              class="w-[180px]"
              >No need</p-radio-button
            >
          </FormField>
        </div>
      </div>
      <div
        class="relative flex w-full items-start gap-4xl"
        v-if="props.selectedReason === 2"
      >
        <div
          class="w-[160px] text-sm font-medium text-gray-700"
        >
          Proof image*
        </div>
        <div class="relative flex-1">
          <FormField
            :value="form.values.uploadedFiles"
            :form="form"
            element="file-upload"
            label="Support for uploading single files or in bulk, including JPG, JPEG, and PNG formats"
            name="uploadedFiles"
            class="w-full"
            multiple
            closable
            :max-file-size="10 * 1024 * 1024"
            accept="image/*"
          >
            <span slot="button">
              <p-button variant="text">
                <span style="font-weight: 600"
                  >Click to upload
                </span>
                <span
                  style="font-weight: 400; color: #475467"
                  >or drag and drop</span
                >
              </p-button>
            </span>
          </FormField>
        </div>
      </div>
      <div class="relative flex w-full items-start gap-4xl">
        <div
          class="w-[160px] text-sm font-medium text-gray-700"
        >
          Description (optional)
        </div>
        <div class="relative flex-1">
          <FormField
            :value="form.values.desc"
            :form="form"
            element="textarea"
            placeholder="Write a few sentences about your issue..."
            name="desc"
            class="w-full"
          />
        </div>
      </div>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { z } from 'zod';
import { $ } from '@/utils/helper';
import { useForm } from '@/components/form-control';
import type { SupportForm } from '@/modules/home/types';
import EventBus from '@/utils/eventbus';
import { onMounted, onBeforeUnmount, computed } from 'vue';
import { ISSUE_LIST } from '@/modules/home/constant';

interface Props {
  selectedReason?: 1 | 2;
}

const props = withDefaults(defineProps<Props>(), {
  selectedReason: 1,
});

const emits = defineEmits(['submit']);

// Define your form schema using Zod
const supportSchema = computed(() => {
  return z.object({
    issue:
      props.selectedReason === 1
        ? z.string().nullable().optional()
        : z
            .string()
            .min(1, {
              message: 'Issue is required',
            })
            .nullable(),
    solution: z
      .string()
      .min(1, {
        message: 'Solution is required',
      })
      .nullable(),
    email: z
      .string()
      .min(1, {
        message: 'Please input email',
      })
      .email({
        message: 'Email is invalid',
      })
      .nullable(),
    desc: z
      .string()
      .max(255, {
        message:
          'Description must not exceed 255 characters',
      })
      .nullable()
      .optional(),
    uploadedFiles:
      props.selectedReason === 1
        ? z.array(z.instanceof(File)).nullable().optional()
        : z
            .array(z.instanceof(File))
            .min(1, {
              message: 'Proof image is required',
            })
            .nullable()
            .optional(),
  });
});

let form = useForm({
  schema: supportSchema.value,
  initialValues: {
    issue: '1',
    solution: 'no_need',
    email: '',
    desc: '',
    uploadedFiles: [],
  },
  mode: 'onChange',
  criteriaMode: 'all',
  shouldFocusError: true,
});

const submitForm = () => {
  try {
    const form = $('#support-form') as HTMLFormElement;
    form?.requestSubmit();
  } catch (error) {
    console.log('error', error);
  }
};

const handleSubmit = async (data: SupportForm) => {
  try {
    emits('submit', data);
  } catch (error) {}
};

onMounted(() => {
  EventBus.$on('submit-support-form', submitForm);
});

onBeforeUnmount(() => {
  EventBus.$off('submit-support-form');
});
</script>

<style scoped>
p-button-group::part(button-group) {
  width: 100%;
}
</style>
