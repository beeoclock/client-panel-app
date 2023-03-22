/* -------------------------------------------------------------------------- */
/*                                   Popover                                  */
/* -------------------------------------------------------------------------- */

export const popoverInit = () => {
  const popoverTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="popover"]')
  );
  popoverTriggerList.map(popoverTriggerEl => {
    return new (window as any).bootstrap.Popover(popoverTriggerEl);
  });
};
