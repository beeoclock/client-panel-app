/* -------------------------------------------------------------------------- */
/*                                 step wizard                                */
/* -------------------------------------------------------------------------- */

export const wizardInit = () => {
  const wizards = document.querySelectorAll('.theme-wizard');

  const tabPillEl = document.querySelectorAll(
    '#pill-tab2 [data-bs-toggle="pill"]'
  );
  const tabProgressBar = document.querySelector('.theme-wizard .progress');

  wizards.forEach(wizard => {
    const tabToggleButtonEl = wizard.querySelectorAll('[data-wizard-step]');
    const inputEmail: HTMLInputElement = wizard.querySelector('[data-wizard-validate-email]') as any;
    const emailPattern = inputEmail?.getAttribute('pattern');
    const inputPassword: HTMLInputElement = wizard.querySelector('[data-wizard-validate-password]') as any;
    const inputConfirmPassword: HTMLInputElement = wizard.querySelector(
      '[data-wizard-validate-confirm-password]'
    ) as any;
    const form = wizard.querySelector('[novalidate]');
    const nextButton = wizard.querySelector('.next button');
    const prevButton = wizard.querySelector('.previous button');
    const cardFooter = wizard.querySelector('.theme-wizard .card-footer');
    let count = 0;

    const validatePattern = (pattern: any, value: any) => {
      const regexPattern = new RegExp(pattern);
      return regexPattern.test(String(value).toLowerCase());
    };

    prevButton?.classList.add('d-none');

    if (inputEmail && inputPassword && form && inputConfirmPassword) {

      // on button click tab change
      nextButton?.addEventListener('click', () => {
        if (
          (!(
              inputEmail.value && validatePattern(emailPattern, inputEmail.value)
            ) ||
            !inputPassword.value ||
            !inputConfirmPassword.value) &&
          form.className.includes('needs-validation')
        ) {
          form.classList.add('was-validated');
        } else {
          count = count + 1;
          const tab = new (window as any).bootstrap.Tab(tabToggleButtonEl[count]);
          tab.show();
        }
      });

    }

    prevButton?.addEventListener('click', () => {
      count = count - 1;
      const tab = new (window as any).bootstrap.Tab(tabToggleButtonEl[count]);
      tab.show();
    });
    if (tabToggleButtonEl.length) {
      tabToggleButtonEl.forEach((item, index) => {
        /* eslint-disable */

        item.addEventListener('shown.bs.tab', e => {
          if (
            (!(
                inputEmail.value &&
                validatePattern(emailPattern, inputEmail?.value)
              ) ||
              !inputPassword?.value ||
              !inputConfirmPassword?.value) &&
            form?.className.includes('needs-validation')
          ) {
            e.preventDefault();
            form?.classList.add('was-validated');
            // return null;
            /* eslint-enable */
          }
          count = index;
          // can't go back tab
          if (count === tabToggleButtonEl.length - 1) {
            tabToggleButtonEl.forEach(tab => {
              tab.setAttribute('data-bs-toggle', 'modal');
              tab.setAttribute('data-bs-target', '#error-modal');
            });
          }
          //add done class
          for (let i = 0; i < count; i = i + 1) {
            tabToggleButtonEl[i].classList.add('done');
          }
          //remove done class
          for (let j = count; j < tabToggleButtonEl.length; j = j + 1) {
            tabToggleButtonEl[j].classList.remove('done');
          }
          // card footer remove at last step
          if (count > tabToggleButtonEl.length - 2) {
            item.classList.add('done');
            cardFooter?.classList.add('d-none');
          } else {
            cardFooter?.classList.remove('d-none');
          }
          // prev-button removing
          if (count > 0) {
            prevButton?.classList.remove('d-none');
          } else {
            prevButton?.classList.add('d-none');
          }
        });
      });
    }
  });

  // control wizard progressbar
  if (tabPillEl.length) {
    const dividedProgressbar = 100 / tabPillEl.length;
    if (tabProgressBar) {
      const progressBar: HTMLElement = tabProgressBar.querySelector('.progress-bar') as any;
      if (progressBar) {
        progressBar.style.width = dividedProgressbar + '%';

        tabPillEl.forEach((item, index) => {
          item.addEventListener('shown.bs.tab', () => {
            progressBar.style.width =
              dividedProgressbar * (index + 1) + '%';
          });
        });
      }
    }
  }
};
