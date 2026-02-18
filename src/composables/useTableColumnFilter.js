/**
 * Get cell value from a row by column dataIndex.
 * Supports string ('birth_date') and array (['identity', 'date_of_birth']) dataIndex.
 * @param {Object} row - Table row record
 * @param {string|string[]} dataIndex - Column dataIndex
 * @returns {*} Cell value
 */
export function getCellValue(row, dataIndex) {
  if (dataIndex == null) return undefined;
  if (Array.isArray(dataIndex)) {
    let value = row;
    for (const key of dataIndex) {
      value = value?.[key];
    }
    return value;
  }
  return row?.[dataIndex];
}

/**
 * Check if a value is empty (null, undefined, or blank string).
 * @param {*} value
 * @returns {boolean}
 */
export function isEmpty(value) {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim() === '';
  return false;
}

/**
 * Apply column filters to a data source.
 * @param {Array} dataSource - Raw table data
 * @param {Array} columns - Table columns (must have key and dataIndex for filterable columns)
 * @param {Object} filterState - { [columnKey]: { mode: 'all' | 'empty' | 'filled', text: string } }
 * @returns {Array} Filtered data
 */
export function applyColumnFilters(dataSource, columns, filterState) {
  if (!Array.isArray(dataSource) || !filterState || typeof filterState !== 'object') {
    return dataSource ?? [];
  }

  const filterableKeys = new Set(
    columns
      .filter((col) => col.key && col.dataIndex && col.key !== 'index' && col.key !== 'photo' && col.key !== 'actions')
      .map((col) => col.key)
  );

  return dataSource.filter((row) => {
    for (const key of filterableKeys) {
      const state = filterState[key];
      if (!state || (state.mode === 'all' && !(state.text && state.text.trim()))) continue;

      const dataIndex = columns.find((c) => c.key === key)?.dataIndex;
      const value = getCellValue(row, dataIndex);
      const valueStr = value != null && typeof value !== 'string' ? String(value) : (value ?? '');
      const empty = isEmpty(value);

      if (state.mode === 'empty' && !empty) return false;
      if (state.mode === 'filled' && empty) return false;
      if (state.text && state.text.trim()) {
        const search = state.text.trim().toLowerCase();
        if (!valueStr.toLowerCase().includes(search)) return false;
      }
    }
    return true;
  });
}
