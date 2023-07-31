/**
 *
 * @param file
 * @param index
 */
export function file2base64(file: File, index = 0): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = function () {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      }
    }
    reader.readAsDataURL(file);
  })
}
