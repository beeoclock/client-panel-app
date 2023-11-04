/**
 *
 * @param file
 */
export function file2base64(file: File): Promise<string> {
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
