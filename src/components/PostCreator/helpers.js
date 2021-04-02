export function isURLValid(str) {
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator
  return !!pattern.test(str);
}

export const transformText = (text, shouldTrim) => {
  return shouldTrim
    ? text.replace(/\n/g, ' ').trim()
    : text.replace(/\n/g, ' ');
};

export const removeEmptyLines = (text) => {
  return text.replace(/^\s*$(?:\r\n?|\n)/gm, '');
};
