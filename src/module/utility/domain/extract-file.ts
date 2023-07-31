export function extractFile(target: HTMLInputElement, index = 0): File {

  const file = target.files?.[index];
  if (file) {
    return file;
  } else {
    throw new Error(`File absent in array at ${index} index`);
  }

}
