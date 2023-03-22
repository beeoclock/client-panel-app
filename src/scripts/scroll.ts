/* -------------------------------------------------------------------------- */
/*                                 Scrollbars                                 */
/* -------------------------------------------------------------------------- */

export const scrollInit = () => {
  console.log(window.innerWidth);
  if (window.innerWidth < 1200) {
    const dropdownElements = Array.from(document.querySelectorAll('[data-hide-on-body-scroll]'));

    console.log(dropdownElements);

    console.log(window.innerWidth);
    window.addEventListener('scroll', () => {
      dropdownElements.forEach(dropdownElement => {
        console.log(dropdownElement);
        // TODO try to undester how it works
        // const instanceEl = Dropdown.getInstance(dropdownElement);
        // console.log(instanceEl);
        // instanceEl && instanceEl.hide();
      });
    });
  }
};
