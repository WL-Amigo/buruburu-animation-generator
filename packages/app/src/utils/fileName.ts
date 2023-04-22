export const removeFileExtension = (fileName: string): string => {
  const dotSplitted = fileName.split('.');
  if (dotSplitted.length <= 1) {
    return fileName;
  }
  return dotSplitted.slice(0, -1).join('.') ?? fileName;
};
