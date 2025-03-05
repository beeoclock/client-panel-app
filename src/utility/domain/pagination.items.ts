/**
 * getPaginationItems(1, 10, 7); // expected: [1, 2, 3, ..., 8, 9, 10]
 * getPaginationItems(9, 10, 7); // expected: [1, 2, 3, ..., 8, 9, 10]
 * getPaginationItems(5, 10, 7); // expected: [1, ..., 4, 5, 6, ..., 10]
 * getPaginationItems(6, 10, 7); // expected: [1, ..., 5, 6, 7, ..., 10]
 * getPaginationItems(3, 10, 7); // expected: [1, 2, 3, 4, ..., 9, 10]
 * getPaginationItems(4, 10, 7); // expected: [1, 2, 3, 4, 5, ..., 10]
 * getPaginationItems(7, 10, 7); // expected: [1, ..., 6, 7, 8, 9, 10]
 * getPaginationItems(8, 10, 7); // expected: [1, 2, ..., 7, 8, 9, 10]
 *
 * @param currentPage
 * @param lastPage
 * @param maxLength
 */
export function getPaginationItems(
  currentPage: number,
  lastPage: number,
  maxLength: number
) {
  const res: Array<number> = [];

  // handle lastPage less than maxLength
  if (lastPage <= maxLength) {
    for (let i = 1; i <= lastPage; i++) {
      res.push(i);
    }
  } else { // handle ellipsis logics
    const firstPage = 1;
    const confirmedPagesCount = 3;
    const deductedMaxLength = maxLength - confirmedPagesCount;
    const sideLength = Math.ceil(deductedMaxLength / 2);

    // handle ellipsis in the middle
    if (
      currentPage - firstPage < sideLength ||
      lastPage - currentPage < sideLength
    ) {
      for (let j = 1; j <= sideLength + firstPage; j++) {
        res.push(j);
      }

      res.push(NaN);

      for (let k = lastPage - sideLength; k <= lastPage; k++) {
        res.push(k);
      }
    } else if (
      currentPage - firstPage >= deductedMaxLength &&
      lastPage - currentPage >= deductedMaxLength
    ) { // handle two ellipsis

      const deductedSideLength = sideLength - 1;

      res.push(1);
      res.push(NaN);

      for (
        let l = currentPage - deductedSideLength;
        l <= currentPage + deductedSideLength;
        l++
      ) {
        res.push(l);
      }

      res.push(NaN);
      res.push(lastPage);
    } else { // handle ellipsis not in the middle
      const isNearFirstPage = currentPage - firstPage < lastPage - currentPage;
      let remainingLength = maxLength;

      if (isNearFirstPage) {
        for (let m = 1; m <= currentPage + 1; m++) {
          res.push(m);
          remainingLength -= 1;
        }

        res.push(NaN);
        remainingLength -= 1;

        for (let n = lastPage - (remainingLength - 1); n <= lastPage; n++) {
          res.push(n);
        }
      } else {
        for (let o = lastPage; o >= currentPage - 1; o--) {
          res.unshift(o);
          remainingLength -= 1;
        }

        res.unshift(NaN);
        remainingLength -= 1;

        for (let p = remainingLength; p >= 1; p--) {
          res.unshift(p);
        }
      }
    }
  }

  return res;
}
