

export function getFormattedDateCrews(): string {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const hours = String(today.getHours()).padStart(2, '0');
  const minutes = String(today.getMinutes()).padStart(2, '0');
  const seconds = String(today.getSeconds()).padStart(2, '0');
  const milliseconds = String(today.getMilliseconds()).padStart(3, '0');

  // Add microseconds (approximated as zeros)
  const microseconds = '000';

  const customFormat = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}${microseconds}`;
  return customFormat;
}
