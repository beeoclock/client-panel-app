/* -------------------------------------------------------------------------- */
/*                                    Utils                                   */
/* -------------------------------------------------------------------------- */

const resize = (fn: any) => window.addEventListener("resize", fn);

const isIterableArray = (array: []) => Array.isArray(array) && !!array.length;

const camelize = (str: string) => {
  const text = str.replace(/[-_\s.]+(.)?/g, (_, c) =>
    c ? c.toUpperCase() : ""
  );
  return `${text.substr(0, 1).toLowerCase()}${text.substr(1)}`;
};

const getData = (el: HTMLElement, data: any) => {
  try {
    return JSON.parse(el.dataset[camelize(data)] ?? '');
  } catch (e) {
    return el.dataset[camelize(data)];
  }
};

/* ----------------------------- Colors function ---------------------------- */

const hexToRgb = (hexValue: any) => {
  let hex;
  hexValue.indexOf("#") === 0
    ? (hex = hexValue.substring(1))
    : (hex = hexValue);
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
    hex.replace(shorthandRegex, (m: any, r: any, g: any, b: any) => r + r + g + g + b + b)
  );
  return result
    ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16),
    ]
    : null;
};

const rgbaColor = (color = "#fff", alpha = 0.5) =>
  `rgba(${hexToRgb(color)}, ${alpha})`;

/* --------------------------------- Colors --------------------------------- */

const getColor = (name: string, dom = document.documentElement) =>
  getComputedStyle(dom).getPropertyValue(`--falcon-${name}`).trim();

const getColors = (dom: any) => ({
  primary: getColor("primary", dom),
  secondary: getColor("secondary", dom),
  success: getColor("success", dom),
  info: getColor("info", dom),
  warning: getColor("warning", dom),
  danger: getColor("danger", dom),
  light: getColor("light", dom),
  dark: getColor("dark", dom),
});

const getSubtleColors = (dom: any) => ({
  primary: getColor("primary-bg-subtle", dom),
  secondary: getColor("secondary-bg-subtle", dom),
  success: getColor("success-bg-subtle", dom),
  info: getColor("info-bg-subtle", dom),
  warning: getColor("warning-bg-subtle", dom),
  danger: getColor("danger-bg-subtle", dom),
  light: getColor("light-bg-subtle", dom),
  dark: getColor("dark-bg-subtle", dom),
});

const getGrays = (dom: any) => ({
  white: getColor("gray-white", dom),
  100: getColor("gray-100", dom),
  200: getColor("gray-200", dom),
  300: getColor("gray-300", dom),
  400: getColor("gray-400", dom),
  500: getColor("gray-500", dom),
  600: getColor("gray-600", dom),
  700: getColor("gray-700", dom),
  800: getColor("gray-800", dom),
  900: getColor("gray-900", dom),
  1000: getColor("gray-1000", dom),
  1100: getColor("gray-1100", dom),
  black: getColor("gray-black", dom),
});

const hasClass = (el: HTMLElement, className: string) => {
  !el && false;
  return el.classList.value.includes(className);
};

const addClass = (el: HTMLElement, className: string) => {
  el.classList.add(className);
};

const removeClass = (el: HTMLElement, className: string) => {
  el.classList.remove(className);
};

const getOffset = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect();
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return {top: rect.top + scrollTop, left: rect.left + scrollLeft};
};

function isScrolledIntoView(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  const vertInView = rect.top <= windowHeight && rect.top + rect.height >= 0;
  const horInView = rect.left <= windowWidth && rect.left + rect.width >= 0;

  return vertInView && horInView;
}

const breakpoints: any = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1540,
};

const getBreakpoint = (el: HTMLElement) => {
  const classes: any = el && el.classList.value;
  let breakpoint;
  if (classes) {
    breakpoint =
      breakpoints[
        classes
          .split(" ")
          .filter((cls: string) => cls.includes("navbar-expand-"))
          .pop()
          .split("-")
          .pop()
        ];
  }
  return breakpoint;
};

/* --------------------------------- Cookie --------------------------------- */

const setCookie = (name: string, value: string, expire: number) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + expire);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()}`;
};

const getCookie = (name: string) => {
  const keyValue = document.cookie.match(`(^|;) ?${name}=([^;]*)(;|$)`);
  return keyValue ? keyValue[2] : keyValue;
};

const settings = {
  tinymce: {
    theme: "oxide",
  },
  chart: {
    borderColor: "rgba(255, 255, 255, 0.8)",
  },
};

/* -------------------------- Chart Initialization -------------------------- */

// const newChart = (chart, config) => {
//   const ctx = chart.getContext("2d");
//   return new window.Chart(ctx, config);
// };

/* ---------------------------------- Store --------------------------------- */

const getItemFromStore = (key: string, defaultValue?: any, store = localStorage) => {
  try {
    return JSON.parse(store.getItem(key) ?? '') || defaultValue;
  } catch {
    return store.getItem(key) || defaultValue;
  }
};

const setItemToStore = (key: string, payload: any, store = localStorage) =>
  store.setItem(key, payload);
const getStoreSpace = (store = localStorage) =>
  parseFloat(
    (
      escape(encodeURIComponent(JSON.stringify(store))).length /
      (1024 * 1024)
    ).toFixed(2)
  );

/* get Dates between */

const getDates = (startDate: any, endDate: any, interval = 1000 * 60 * 60 * 24) => {
  const duration = endDate - startDate;
  const steps = duration / interval;
  return Array.from(
    {length: steps + 1},
    (v, i) => new Date(startDate.valueOf() + interval * i)
  );
};

const getPastDates = (duration: any) => {
  let days;

  switch (duration) {
    case "week":
      days = 7;
      break;
    case "month":
      days = 30;
      break;
    case "year":
      days = 365;
      break;

    default:
      days = duration;
  }

  const date = new Date();
  const endDate = date;
  const startDate = new Date(new Date().setDate(date.getDate() - (days - 1)));
  return getDates(startDate, endDate);
};

/* Get Random Number */
const getRandomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min) + min);

export const utils = {
  breakpoints,
  resize,
  isIterableArray,
  camelize,
  getData,
  hasClass,
  addClass,
  hexToRgb,
  rgbaColor,
  getColor,
  getColors,
  getSubtleColors,
  getGrays,
  getOffset,
  isScrolledIntoView,
  getBreakpoint,
  setCookie,
  getCookie,
  // newChart,
  settings,
  getItemFromStore,
  setItemToStore,
  getStoreSpace,
  getDates,
  getPastDates,
  getRandomNumber,
  removeClass,
};
