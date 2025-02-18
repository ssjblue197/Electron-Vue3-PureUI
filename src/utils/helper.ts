export const $ = (query: string) =>
  document.querySelector(query);
export const $$ = (query: string) =>
  document.querySelectorAll(query);

export function isObject(value: any) {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  );
}

export function objectToQueryString(obj: any) {
  const params = new URLSearchParams();

  // Iterate over each key-value pair in the object
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      // Add each key-value pair to the URLSearchParams object
      if (Array.isArray(obj[key])) {
        if (obj[key].length === 1) {
          params.append(`${key}[0]`, obj[key][0]);
        } else {
          for (let i = 0; i < obj[key].length; i++) {
            params.append(`${key}[${i}]`, obj[key][i]);
          }
        }
      } else {
        params.append(key, obj[key]);
      }
    }
  }

  // Return the query string
  return params.toString();
}

export function displayNumber(value?: number) {
  if (!value) return '0';
  return new Intl.NumberFormat('en-US').format(value);
}

export function groupBy(array: Array<any>, key: string) {
  // Return the end result
  return array.reduce((result, currentValue) => {
    (result[currentValue?.[key]] =
      result?.[currentValue?.[key]] || []).push(
      currentValue,
    );
    return result;
  }, {});
}

export function focusElement(query: string) {
  try {
    if (!query) return false;
    const element: Element | null =
      document.querySelector(query);
    const focusElement = element as HTMLInputElement;
    focusElement?.focus();
  } catch (error) {
    console.warn(error);
  }
}

export function getErrorMessage(error: any) {
  if (error?.response?.data?.errors) {
    const errorValues = Object.values(
      error?.response?.data?.errors,
    );
    if (errorValues.length > 0) {
      return errorValues.join(' ');
    }
  }
  if (error?.response?.data?.message) {
    return error?.response?.data?.message;
  }
  if (error?.response?.data) {
    const errorValues = Object.values(
      error?.response?.data,
    );
    if (errorValues.length > 0) {
      return errorValues.join(' ');
    }
  }
  if (error?.message) {
    return error?.message;
  }
  return 'An error occur!';
}

export const scrollToTop = () => {
  $('#main-layout')?.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

export function checkMultiple(value: number) {
  if (value > 1) {
    return 's';
  }
  return '';
}

export const displayStatus = (status: string) => {
  return [
    String(status.slice(0, 1)).toLocaleUpperCase(),
    status.slice(1, status.length),
  ]
    .join('')
    .replaceAll('_', ' ');
};

export function moneyFormat(value: any) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  if (!value) return '$0.00';
  return formatter.format(value);
}

export const cleanObject = (obj: {
  [key: string]: any;
}) => {
  for (const key in obj) {
    if (
      obj[key] === null ||
      obj[key] === undefined ||
      obj[key] === ''
    ) {
      delete obj[key];
    }
  }
  return obj;
};

export function saveBase64AsFile(
  base64: any,
  fileName?: string,
) {
  // Convert the base64 string to a Blob
  const byteCharacters = atob(base64.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'image/png' });

  // Create a URL for the Blob
  const blobURL = URL.createObjectURL(blob);

  // Create a download link
  const link = document.createElement('a');
  link.href = blobURL;
  link.download = fileName || Date.now()?.toString();

  // Simulate a click on the download link
  document.body.appendChild(link); // Append the link to the body
  link.click(); // Trigger the click
  document.body.removeChild(link); // Remove the link from the body
}

export const convertPST = (createdAt: string): string => {
  const createdDate = new Date(createdAt);
  const createdDatePST = new Date(
    createdDate.toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles',
    }),
  );
  // Format the date to yyyy-mm-dd format
  const formattedDate = createdDatePST
    .toISOString()
    .split('T')[0];

  return formattedDate;
};

export const countAgeByPST = (createdAt: string) => {
  const createdDate = new Date(createdAt);

  // Convert to PST (Pacific Standard Time)
  const createdDatePST = new Date(
    createdDate.toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles',
    }),
  );
  const nowPST = new Date().toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
  });

  // Calculate the time difference in milliseconds
  const timeDifferenceMillis =
    new Date(nowPST).getTime() - createdDatePST.getTime();

  // Convert time difference to days and hours
  const millisecondsPerDay = 1000 * 60 * 60 * 24;

  let daysDifference = Math.floor(
    timeDifferenceMillis / millisecondsPerDay,
  );

  // Adjust days if exactly 2 days to display "3 days"
  if (daysDifference === 2) {
    daysDifference = 3;
  }

  // Construct the output string
  const result = `${daysDifference} days ago`;

  return result;
};

export function isFullyInside(
  container: HTMLElement,
  element: Element,
) {
  const containerRect = container.getBoundingClientRect();

  const originElement = element as HTMLElement;

  return (
    originElement.offsetTop >= 0 &&
    originElement.offsetTop + originElement.clientHeight <=
      containerRect.height &&
    originElement.offsetLeft >= 0 &&
    originElement.offsetLeft + originElement.clientWidth <=
      containerRect.width
  );
}
