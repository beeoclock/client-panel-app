

/* -------------------------------------------------------------------------- */

/*                              Config                                        */

/* -------------------------------------------------------------------------- */
export const CONFIG: any = {
  theme: 'light',
};

Object.keys(CONFIG).forEach((key) => {
  if (localStorage.getItem(key) === null) {
    localStorage.setItem(key, CONFIG[key]);
  }
});
