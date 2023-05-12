export function findByLastIndex<T> (
  list: T[],
  callback: (item: T, index: number, list: T[]) => boolean,
): number {
  for (let i = list.length - 1; i >= 0; i--) {
    if (callback(list[i], i, list)) {
      return i
    }
  }

  return -1
}
