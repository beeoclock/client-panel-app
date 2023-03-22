/* -------------------------------------------------------------------------- */
/*                                    Toast                                   */
/* -------------------------------------------------------------------------- */

export const toastInit = () => {
  const toastElList = [].slice.call(document.querySelectorAll('.toast'));
  toastElList.map((toastEl) => new (window as any).bootstrap.Toast(toastEl));


  const liveToastBtn = document.getElementById('liveToastBtn');

  if (liveToastBtn) {
    const liveToast = new (window as any).bootstrap.Toast(document.getElementById('liveToast') as any);

    liveToastBtn.addEventListener('click', () => {
      liveToast && liveToast.show();
    })
  }
};
