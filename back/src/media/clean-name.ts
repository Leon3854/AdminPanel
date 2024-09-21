export function cleanFileName(fileName: string): string {
  const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
  const clearName = fileName
    .substring(0, fileName.lastIndexOf('.'))
    .replace(/[^a-zA-Z0-9_]/g, '');
  return clearName + fileExtension;
}
