export function debounce(wait = 500, callCallback = true) {
  return function(target, key, descriptor) {
    let timeout;
    let initialCall;
    let previousCallback;

    return {
      ...descriptor,
      value() {
        const later = () => {
          timeout = null;
          initialCall = null;
          Reflect.apply(descriptor.value, this, arguments);
        };
        const callNow = !timeout && !initialCall || !(Date.now() - initialCall <= wait);

        if (callNow) {
          initialCall = Date.now();
          Reflect.apply(descriptor.value, this, arguments);
        } else {
          clearTimeout(timeout);

          if (previousCallback) {
            previousCallback();
            previousCallback = null;
          }

          if (callCallback && typeof arguments[0] === 'function') {
            previousCallback = arguments[0];
          }

          if (callCallback && typeof arguments[1] === 'function') {
            previousCallback = arguments[1];
          }

          timeout = setTimeout(later, wait);
        }
      }
    };
  };
}
