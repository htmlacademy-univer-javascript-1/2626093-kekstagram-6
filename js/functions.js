function notLongerThan(str, maxLength) {
  return str.length <= maxLength;
}

function isPalindrome(str) {
  const cleaned = str.replace(/[^a-z0-9]/gi, '').toLowerCase();
  // we can do it in one line, but it's not very efficient
  // because it creates a new string in memory
  // if its big - it can be a problem
  // // const reversed = cleaned.split('').reverse().join('');
  // // return cleaned === reversed;
  // so, lets compare only half of the string
  const len = Math.floor(cleaned.length / 2);
  for (let i = 0; i < len; i++) {
    if (cleaned[i] !== cleaned[cleaned.length - 1 - i]) {
      return false;
    }
  }
  return true;
}

function getNumber(value) {
  // if values is a string, we have to get all digits from it
  if (typeof value === 'string') {
    const digits = value.match(/\d+/g);
    if (digits) {
      return parseInt(digits.join(''), 10);
    }
    return NaN;
  }
  // if value is a number, return its positive integer part
  if (typeof value === 'number') {
    return Math.abs(Math.trunc(value));
  }
  // for other types return NaN
  return NaN;
}
