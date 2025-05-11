/**
 * Transform an array of items into the format required by Ant Design Select components
 * @param list - Array of items with id/_id and name properties
 * @returns Array of options with value and label properties
 */
export const transformListSelect = (list: any[] = []) => {
  return list.map((item) => ({
    value: item._id || item.id,
    label: item.name,
    name: item.name,
    ...item,
  }));
};

export default transformListSelect;
