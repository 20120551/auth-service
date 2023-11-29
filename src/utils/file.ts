export const isFile = (path: string) => {
  // check file contain \
  if (/\//.test(path)) {
    const file = path.split('/')[-1];
    if (file.includes('.')) {
      return true;
    }
  }

  return path.includes('.');
};
