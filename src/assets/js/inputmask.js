import utils from './utils';

/* -------------------------------------------------------------------------- */
/*                                   Inputmask                                */
/* -------------------------------------------------------------------------- */
const inputmaskInit = () => {
  if (window.Inputmask) {
    const elements = document.querySelectorAll('[data-input-mask]');
    elements.forEach(item => {
      const userOptions = utils.getData(item, 'input-mask');
      const defaultOptions = {
        showMaskOnFocus: false,
        showMaskOnHover: false,
        jitMasking: true
      };
      const maskOptions = window._.merge(defaultOptions, userOptions);
      const inputmask = new window.Inputmask({
        ...maskOptions
      }).mask(item);

      return inputmask;
    });
  }
};

export default inputmaskInit;
