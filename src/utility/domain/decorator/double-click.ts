export function DoubleClick(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  let lastClickTime = 0;

  descriptor.value = function (...args: any[]) {
    const currentTime = Date.now();
    if (currentTime - lastClickTime <= 300) {
      lastClickTime = 0; // Reset for the next double-click
      return originalMethod.apply(this, args);
    } else {
      lastClickTime = currentTime;
    }
  };
}
