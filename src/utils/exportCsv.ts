declare global {
  interface Navigator {
    msSaveBlob: (blob: Blob, fileName: string) => boolean;
  }
}
const convertToCSV = (dataExport: object[]): string => {
  const header = Object.keys(dataExport[0]).join(',');
  let body = '';
  dataExport.forEach((item) => {
    body = `${body}${Object.values(item).join(',')}\r\n`;
  });
  return `${header}\r\n${body}`;
};

export const exportToCsv = (filename: string, dataExport: object[]) => {
  const csvData = convertToCSV(dataExport);
  const blob = new Blob([csvData], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);

  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, filename);
  } else {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  window.URL.revokeObjectURL(url);
};
