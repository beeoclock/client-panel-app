

/* -------------------------------------------------------------------------- */

/*                              Config                                        */

/* -------------------------------------------------------------------------- */
export const CONFIG: any = {
  isNavbarVerticalCollapsed: false,
  theme: 'light',
  isRTL: false,
  isFluid: false,
  navbarStyle: 'card',
  navbarPosition: 'vertical'
};

Object.keys(CONFIG).forEach((key) => {
  if (localStorage.getItem(key) === null) {
    localStorage.setItem(key, CONFIG[key]);
  }
});

if (JSON.parse(localStorage.getItem('isNavbarVerticalCollapsed') ?? '')) {
  document.documentElement.classList.add('navbar-vertical-collapsed');
}

if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.setAttribute('data-bs-theme', 'dark');
}
