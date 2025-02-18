import { computed, watch } from 'vue';

export function useFilter<T>(filters: T) {
  let originalFilters = JSON.parse(JSON.stringify(filters));

  const URLparams = new URLSearchParams(
    document.location.search,
  );

  for (const [key, value] of URLparams) {
    (filters as Record<string, unknown>)[key] = String(
      value,
    )?.includes(',')
      ? String(value)?.split(',')
      : String(value);
  }

  const hasChanged = computed(() => {
    return (
      JSON.stringify(originalFilters) !==
      JSON.stringify(filters)
    );
  });

  const resetFilter = () => {
    const oldKeys = Object.keys(originalFilters);
    const newKeys = Object.keys(
      JSON.parse(JSON.stringify(filters)),
    );

    newKeys.map((k: string) => {
      if (!oldKeys.includes(k)) {
        //@ts-ignore
        delete filters[k];
      }
    });

    //@ts-ignore
    Object.assign(filters, originalFilters);
  };

  const setFieldValue = (
    key: keyof T,
    value: string | number,
  ): void => {
    (filters as Record<keyof T, unknown>)[key] = value;
  };

  watch(
    () => filters,
    () => {
      // Update URL search params based on filters object
      for (const [key, value] of Object.entries(
        filters as Record<string, unknown>,
      )) {
        if (value) {
          URLparams.set(key, String(value)); // Add or update filter
        } else {
          URLparams.delete(key); // Remove filter if value is falsy
        }
      }

      URLparams.forEach((_: string, key: string) => {
        if (
          !(
            filters as Record<string, unknown>
          ).hasOwnProperty(key)
        ) {
          URLparams.delete(key);
        }
      });

      // Update the URL without reloading the page
      const newURL = `${location.pathname}?${URLparams.toString()}`;
      history.replaceState(null, '', newURL);
    },
    {
      immediate: true,
      deep: true,
    },
  );

  return {
    hasChanged,
    filters,
    resetFilter,
    setFieldValue,
  };
}
