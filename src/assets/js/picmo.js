import utils from './utils';

/* -------------------------------------------------------------------------- */
/*                                   Popover                                  */
/* -------------------------------------------------------------------------- */
const picmoInit = () => {
  const picmoBtns = document.querySelectorAll('[data-picmo]');
  if (picmoBtns) {
    Array.from(picmoBtns).forEach(btn => {
      const inputTarget = utils.getData(btn, 'picmo-input-target');
      const userOptions = utils.getData(btn, 'picmo');
      const defaultOptions = {
        referenceElement: btn,
        triggerElement: btn,
        position: 'bottom-center',
        showCloseButton: false
      };
      const options = window._.merge(defaultOptions, userOptions);
      const picker = window.picmoPopup.createPopup(
        {showPreview: false},
        {...options}
      );
      btn.addEventListener('click', () => {
        picker.toggle();
      });
      const input = document.querySelector(inputTarget);
      picker.addEventListener('emoji:select', selection => {
        if (input) {
          input.innerHTML += selection.emoji;
        }
      });
    });
  }
};
export default picmoInit;
