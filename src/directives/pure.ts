const wm = new WeakMap<
  HTMLElement,
  (event: Event) => void
>();
export default {
  mounted(el: HTMLElement, binding: any) {
    const eventName = ['P-SELECT', 'P-CALENDAR'].includes(
      el.tagName,
    )
      ? 'p-change'
      : 'p-input';

    const inputHandler = function inputHandler(
      event: Event,
    ) {
      binding.instance[binding.value] = (
        event.target as HTMLInputElement
      ).value;
    };

    wm.set(el, inputHandler);

    (el as HTMLInputElement).value = binding.value ?? '';
    el.addEventListener(eventName, inputHandler);
  },

  updated(el: HTMLElement, binding: any) {
    (el as HTMLInputElement).value = binding.value ?? '';
  },

  unmounted(el: HTMLElement) {
    const inputHandler = wm.get(el);
    const eventName =
      el.tagName === 'P-SELECT' ? 'p-change' : 'input';

    if (inputHandler) {
      el.removeEventListener(eventName, inputHandler);
    }
    wm.delete(el);
  },
};
