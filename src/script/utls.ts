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
  resize,
  isIterableArray,
  camelize,
  getData,
  hasClass,
  addClass,
  getOffset,
  setCookie,
  getCookie,
  settings,
  getItemFromStore,
  setItemToStore,
  getStoreSpace,
  getDates,
  getPastDates,
  getRandomNumber,
  removeClass,
};
