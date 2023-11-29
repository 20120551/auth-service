export const createQueryUrl = <T extends object>(baseUrl: string, query: T) => {
  if (query === undefined || Object.entries(query).length === 0) {
    return baseUrl;
  }
  let result = baseUrl;
  if (!baseUrl.includes('?')) {
    result = `${result}?`;
  }
  for (const [key, value] of Object.entries(query)) {
    const _query = `${key}=${value}&`;
    result += _query;
  }
  return result.substring(0, result.length - 1);
};

export const createCamelCaseFromObject = <T extends object, R extends object>(
  obj: T,
) => {
  const convertedObject = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const camelCaseKey = key.replace(/_./g, (match) =>
        match.charAt(1).toUpperCase(),
      );
      convertedObject[camelCaseKey] = obj[key];
    }
  }

  return convertedObject as R;
};
