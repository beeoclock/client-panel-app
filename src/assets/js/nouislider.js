import utils from './utils';

/* -------------------------------------------------------------------------- */
/*                               noUiSlider                                   */
/* -------------------------------------------------------------------------- */
const nouisliderInit = () => {
  if (window.noUiSlider) {
    const elements = document.querySelectorAll('[data-nouislider]');
    elements.forEach(item => {
      const sliderValue = document.querySelector('[data-nouislider-value]');
      const userOptions = utils.getData(item, 'nouislider');
      const defaultOptions = {
        start: [10],
        connect: [true, false],
        step: 1,
        range: {min: [0], max: [100]},
        tooltips: true
      };
      const options = window._.merge(defaultOptions, userOptions);
      window.noUiSlider.create(item, {...options});

      sliderValue &&
      item.noUiSlider.on('update', (values, handle) => {
        sliderValue.innerHTML = values[handle];
      });
    });
  }
};

export default nouisliderInit;
