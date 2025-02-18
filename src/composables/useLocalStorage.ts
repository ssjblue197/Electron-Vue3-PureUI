export function useLocalStorage<T>(
  name: string,
  initialValue?: T,
) {
  if (initialValue) {
    localStorage.setItem(
      name,
      JSON.stringify(initialValue),
    );
  }

  const getValue = () => {
    return JSON.parse(localStorage.getItem(name) ?? '');
  };
  const setValue = (value: T) => {
    localStorage.setItem(name, JSON.stringify(value));
  };

  const destroy = () => {
    localStorage.removeItem(name);
  };

  return {
    getValue,
    setValue,
    destroy,
  };
}
