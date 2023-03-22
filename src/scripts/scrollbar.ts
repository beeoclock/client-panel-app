/* -------------------------------------------------------------------------- */
/*                                 Scrollbars                                 */
/* -------------------------------------------------------------------------- */

export const scrollbarInit = () => {
  console.log(document.querySelectorAll('.scrollbar-overlay'), (window as any).SimpleBar);

  Array.prototype.forEach.call(
    document.querySelectorAll('.scrollbar-overlay'),
    (el) => new (window as any).SimpleBar(el, {autoHide: true})
  );
};

