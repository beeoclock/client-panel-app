export function file2base64(element: HTMLInputElement): Promise<string> {
  return new Promise((resolve, reject) => {
    const file = element.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = function () {
        console.log('RESULT', reader.result)
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        }
      }
      reader.readAsDataURL(file);
    } else {
      reject('File is empty!');
    }
  })
}
