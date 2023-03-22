/* -------------------------------------------------------------------------- */
/*                                   Tooltip                                  */
/* -------------------------------------------------------------------------- */

export const tooltipInit = () => {
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );

  tooltipTriggerList.map(
    (tooltipTriggerEl) => new (window as any).bootstrap.Tooltip(tooltipTriggerEl, {
      trigger: 'hover'
    })
  );
};
