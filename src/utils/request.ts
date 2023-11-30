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
  if (obj && typeof obj === 'object') {
    if (Array.isArray(obj)) {
      return obj.map(createCamelCaseFromObject);
    } else {
      return Object.keys(obj).reduce((camelObj, key) => {
        const camelKey = key.replace(/(_\w)/g, (match) =>
          match[1].toUpperCase(),
        );
        camelObj[camelKey] = createCamelCaseFromObject(obj[key]);
        return camelObj;
      }, {}) as R;
    }
  }
  return obj;
};

export const createSnakeCaseFromObject = <T extends object, R extends object>(
  obj: T,
) => {
  if (obj && typeof obj === 'object') {
    if (Array.isArray(obj)) {
      return obj.map(createSnakeCaseFromObject);
    } else {
      return Object.keys(obj).reduce((snakeObj, key) => {
        const snakeKey = key.replace(
          /[A-Z]/g,
          (match) => `_${match.toLowerCase()}`,
        );
        snakeObj[snakeKey] = createSnakeCaseFromObject(obj[key]);
        return snakeObj;
      }, {}) as R;
    }
  }
  return obj;
};
