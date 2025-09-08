export interface options {
  exactMatch: boolean;
  caseSensitive: boolean;
  operator: 'equals' | string;
}

const defaultOptions: options = {
  caseSensitive: false,
  exactMatch: false,
  operator: 'contains',
};

/**
 * this function is for take a data set and apply filter and returned data with fikltyer applyed
 * @param key
 * @param dataSet
 * @returns
 */
export const Filter = <T>(
  value: string,
  key: string,
  dataSet: T[],
  options: options = defaultOptions,
): T[] => {
  const { exactMatch = false, caseSensitive = false, operator = 'equals' } = options;
  if (!Array.isArray(dataSet)) {
    console.error('Data set is not array');
    return [];
  }
  const filteredDataSet = dataSet.filter((x) => {
    const keys = key.split('.');
    let current = x;
    // debugger;
    for (const k of keys) {
      if (current === null || !current) {
        return false;
      }
      current = current[k];
    }
    if (current === null || !current) {
      return value === null || value === undefined;
    }

    switch (operator) {
      case 'contains':
        if (typeof current === 'string' && typeof value === 'string') {
          return caseSensitive
            ? current.includes(value)
            : current.toLowerCase().includes(value.toLowerCase());
        }
        return false;

      case 'startsWith':
        if (typeof current === 'string' && typeof value === 'string') {
          return caseSensitive
            ? current.startsWith(value)
            : current.toLowerCase().startsWith(value.toLowerCase());
        }
        return false;

      case 'endsWith':
        if (typeof current === 'string' && typeof value === 'string') {
          return caseSensitive
            ? current.endsWith(value)
            : current.toLowerCase().endsWith(value.toLowerCase());
        }
        return false;
      case 'gt':
        return current > value;

      case 'lt':
        return current < value;

      case 'gte':
        return current >= value;

      case 'lte':
        return current <= value;
      case 'equals':
      default:
        if (exactMatch) {
          return current === value;
        }
        if (typeof current === 'string' && typeof value === 'string') {
          return caseSensitive ? current === value : current.toLowerCase() === value.toLowerCase();
        }
        return current === value;
    }
  });

  return filteredDataSet;
};
