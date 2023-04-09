export const removeFileExtension = (fileName: string): string => {
  return fileName.split('.').at(0) ?? fileName;
};
