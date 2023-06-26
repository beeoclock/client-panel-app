/**
 *
 * @param totalSize
 * @param pageSize
 */
export function getMaxPage(totalSize: number, pageSize: number): number {
  const newMaxPage = Math.ceil(totalSize / pageSize);
  return newMaxPage > 1 ? newMaxPage : 1;
}
