export function debounce(wait = 500, callCallback = true) {
  return function(target, key, descriptor) {
    let timeout;
    let initialCall;

    return {
      ...descriptor,
      value() {
        if (callCallback && typeof arguments[0] === 'function') {
          arguments[0]();
        }

        if (callCallback && typeof arguments[1] === 'function') {
          arguments[1]();
        }

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
          timeout = setTimeout(later, wait);
        }
      }
    };
  };
}
