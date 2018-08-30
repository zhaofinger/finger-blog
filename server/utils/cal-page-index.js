const calPageIndex = (current, length, displayLength = 6) => {
  if (length <=1 ) {
    return null;
  }
  displayLength = displayLength - 2;
  let indexes = [1];
  let start = Math.round(current - displayLength / 2);
  let end = Math.round(current + displayLength / 2);
  if (start <= 1) {
    start = 2;
    end = start + displayLength - 1;
    if (end >= length - 1) {
      end = length - 1;
    }
  }
  if (end >= length - 1) {
    end = length - 1;
    start = end - displayLength + 1;
    if (start <= 1) {
      start = 2;
    }
  }
  if (start !== 2) {
    indexes.push('...');
  }
  for (let i = start; i <= end; i++) {
    indexes.push(i);
  }
  if (end !== length - 1) {
    indexes.push('...');
  }
  indexes.push(length);
  return indexes;
};

module.exports = calPageIndex;