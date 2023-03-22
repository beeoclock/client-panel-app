import {AfterViewInit, Component, ViewEncapsulation} from '@angular/core';
import SidebarComponent from '@utility/presentation/components/sidebar/sidebar.component';
import CustomizeComponent from '@utility/presentation/components/customize/customize.component';
import NavbarComponent from '@utility/presentation/components/navbar/navbar.component';
import FooterComponent from '@utility/presentation/components/footer/footer.component';
import ModalComponent from '@utility/presentation/components/modal/modal.component';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'utility-wrapper-panel-component',
  standalone: true,
  template: `
    <!-- ===============================================-->
    <!--    Main Content-->
    <!-- ===============================================-->
    <main class="main" id="top">
      <div class="container" data-layout="container">
        <utility-sidebar-component></utility-sidebar-component>
        <div class="content">
          <utility-navbar-component></utility-navbar-component>
          <!--      Content-->
          <router-outlet></router-outlet>

          <!--      Content-->
          <utility-footer-component></utility-footer-component>
        </div>
        <utility-modal-component></utility-modal-component>
      </div>
    </main>
    <!-- ===============================================-->
    <!--    End of Main Content-->
    <!-- ===============================================-->
    <utility-customize-component></utility-customize-component>

  `,
  imports: [SidebarComponent, CustomizeComponent, NavbarComponent, FooterComponent, ModalComponent, RouterOutlet],
  encapsulation: ViewEncapsulation.None
})
export default class WrapperPanelComponent implements AfterViewInit {


  public readonly config: any = {
    isNavbarVerticalCollapsed: false,
    theme: 'light',
    isRTL: false,
    isFluid: false,
    navbarStyle: 'card',
    navbarPosition: 'vertical'
  };

  public ngAfterViewInit(): void {

    Object.keys(this.config).forEach((key) => {
      if (localStorage.getItem(key) === null) {
        localStorage.setItem(key, this.config[key]);
      }
    })

    if (JSON.parse(localStorage.getItem('isNavbarVerticalCollapsed') ?? '')) {
      document.documentElement.classList.add('navbar-vertical-collapsed');
    }

    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
    }

    const navbarStyle = localStorage.getItem("navbarStyle");
    if (navbarStyle && navbarStyle !== 'transparent') {
      const navbar = document.querySelector('.navbar-vertical');
      console.log(navbar);
      if (navbar) {
        navbar.classList.add(`navbar-${navbarStyle}`);
      }
    }

    const hasTopNavOnly = true;

    if (hasTopNavOnly) {

      const navbarPosition = localStorage.getItem('navbarPosition');
      const navbarTop = document.querySelector('[data-layout] .navbar-top:not([data-double-top-nav');
      const navbarDoubleTop = document.querySelector('[data-double-top-nav]');

      if (localStorage.getItem('navbarPosition') === 'double-top') {
        document.documentElement.classList.toggle('double-top-nav-layout');
      }

      if (navbarPosition === 'double-top') {
        if (navbarDoubleTop) {
          navbarDoubleTop.removeAttribute('style');
        }
        if (navbarTop) {
          navbarTop.remove(); // argument: navbarTop
        }
      } else {
        if (navbarTop) {
          navbarTop.removeAttribute('style');
        }
        if (navbarDoubleTop) {
          navbarDoubleTop.remove(); // argument: navbarDoubleTop
        }
      }
    } else {

      const navbarPosition = localStorage.getItem('navbarPosition');
      const navbarVertical = document.querySelector('.navbar-vertical');
      const navbarTopVertical = document.querySelector('.content .navbar-top');
      const navbarTop = document.querySelector('[data-layout] .navbar-top:not([data-double-top-nav');
      const navbarDoubleTop = document.querySelector('[data-double-top-nav]');
      const navbarTopCombo = document.querySelector('.content [data-navbar-top="combo"]');

      if (localStorage.getItem('navbarPosition') === 'double-top') {
        document.documentElement.classList.toggle('double-top-nav-layout');
      }

      if (navbarPosition === 'top') {
        if (navbarTop) {
          navbarTop.removeAttribute('style');
        }
        if (navbarTopVertical) {
          navbarTopVertical.remove(); // argument: navbarTopVertical
        }
        if (navbarVertical) {
          navbarVertical.remove(); // argument: navbarVertical
        }
        if (navbarTopCombo) {
          navbarTopCombo.remove(); // argument: navbarTopCombo
        }
        if (navbarDoubleTop) {
          navbarDoubleTop.remove(); // argument: navbarDoubleTop
        }
      } else if (navbarPosition === 'combo') {
        if (navbarVertical) {
          navbarVertical.removeAttribute('style');
        }
        if (navbarTopCombo) {
          navbarTopCombo.removeAttribute('style');
        }
        if (navbarTop) {
          navbarTop.remove(); // argument: navbarTop
        }
        if (navbarTopVertical) {
          navbarTopVertical.remove(); // argument: navbarTopVertical
        }
        if (navbarDoubleTop) {
          navbarDoubleTop.remove(); // argument: navbarDoubleTop
        }
      } else if (navbarPosition === 'double-top') {
        if (navbarDoubleTop) {
          navbarDoubleTop.removeAttribute('style');
        }
        if (navbarTopVertical) {
          navbarTopVertical.remove(); // argument: navbarTopVertical
        }
        if (navbarVertical) {
          navbarVertical.remove(); // argument: navbarVertical
        }
        if (navbarTop) {
          navbarTop.remove(); // argument: navbarTop
        }
        if (navbarTopCombo) {
          navbarTopCombo.remove(); // argument: navbarTopCombo
        }
      } else {
        if (navbarVertical) {
          navbarVertical.removeAttribute('style');
        }
        if (navbarTopVertical) {
          navbarTopVertical.removeAttribute('style');
        }
        if (navbarTop) {
          navbarTop.remove(); // argument: navbarTop
        }
        if (navbarDoubleTop) {
          navbarDoubleTop.remove(); // argument: navbarDoubleTop
        }
        if (navbarTopCombo) {
          navbarTopCombo.remove(); // argument: navbarTopCombo
        }
      }

    }

    const isFluid = JSON.parse(localStorage.getItem('isFluid') ?? '');
    if (isFluid) {
      const container = document.querySelector('[data-layout]');
      if (container) {
        container.classList.remove('container');
        container.classList.add('container-fluid');
      }
    }


    const isRTL = JSON.parse(localStorage.getItem('isRTL') ?? '');
    if (isRTL) {
      const linkDefault = document.getElementById('style-default');
      const userLinkDefault = document.getElementById('user-style-default');
      if (linkDefault) {
        linkDefault.setAttribute('disabled', 'true');
      }
      if (userLinkDefault) {
        userLinkDefault.setAttribute('disabled', 'true');
      }
      document.querySelector('html')?.setAttribute('dir', 'rtl');
    } else {
      const linkRTL = document.getElementById('style-rtl');
      const userLinkRTL = document.getElementById('user-style-rtl');
      linkRTL?.setAttribute('disabled', 'true');
      userLinkRTL?.setAttribute('disabled', 'true');
    }

    navbarDarkenOnScroll();
    handleNavbarVerticalCollapsed();


  }

}


/* -------------------------------------------------------------------------- */
/*                                    Utils                                   */
/* -------------------------------------------------------------------------- */
const docReady = (fn: any) => {
  // see if DOM is already available
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn);
  } else {
    setTimeout(fn, 1);
  }
};

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

const utils = {
  docReady,
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


const navbarDarkenOnScroll = () => {
  const Selector = {
    NAVBAR: '[data-navbar-darken-on-scroll]',
    NAVBAR_COLLAPSE: '.navbar-collapse',
    NAVBAR_TOGGLER: '.navbar-toggler',
  };

  const ClassNames = {
    COLLAPSED: 'collapsed',
  };

  const Events = {
    SCROLL: 'scroll',
    SHOW_BS_COLLAPSE: 'show.bs.collapse',
    HIDE_BS_COLLAPSE: 'hide.bs.collapse',
    HIDDEN_BS_COLLAPSE: 'hidden.bs.collapse',
  };

  const DataKey = {
    NAVBAR_DARKEN_ON_SCROLL: 'navbar-darken-on-scroll',
  };

  const navbar: HTMLElement = document.querySelector(Selector.NAVBAR) as any;
  console.log(navbar);

  function removeNavbarBgClass() {
    navbar.classList.remove('bg-dark');
    navbar.classList.remove('bg-100');
  }

  const toggleThemeClass = (theme: string) => {
    if (theme === 'dark') {
      navbar.classList.remove('navbar-dark');
      navbar.classList.add('navbar-light');
    } else {
      navbar.classList.remove('navbar-light');
      navbar.classList.add('navbar-dark');
    }
  };

  function getBgClassName(name: string, defaultColorName: string) {
    const parent = document.documentElement;
    const allColors: any = {
      ...utils.getColors(parent),
      ...utils.getGrays(parent),
    };

    const colorName: any = Object.keys(allColors).includes(name)
      ? name
      : defaultColorName;
    const color = allColors[colorName];
    const bgClassName = `bg-${colorName}`;
    return {color, bgClassName};
  }

  if (navbar) {
    const theme = localStorage.getItem('theme');
    let defaultColorName: any = theme === 'dark' ? '100' : 'dark';
    const name = utils.getData(navbar, DataKey.NAVBAR_DARKEN_ON_SCROLL);

    toggleThemeClass(theme as string);

    document.body?.addEventListener(
      'clickControl',
      (event) => {
        console.log(event);
        const {detail: {control, value}} = event as any;
        if (control === 'theme') {
          toggleThemeClass(value);
          defaultColorName = value === 'dark' ? '100' : 'dark';
          if (
            navbar.classList.contains('bg-dark') ||
            navbar.classList.contains('bg-100')
          ) {
            removeNavbarBgClass();
            navbar.classList.add(
              getBgClassName(name, defaultColorName).bgClassName
            );
          }
        }
      }
    );

    const windowHeight = window.innerHeight;
    const html = document.documentElement;
    const navbarCollapse = navbar.querySelector(Selector.NAVBAR_COLLAPSE);
    console.log(navbarCollapse);
    const colorRgb = utils.hexToRgb(
      getBgClassName(name, defaultColorName).color
    );
    const {backgroundImage} = window.getComputedStyle(navbar);
    const transition = 'background-color 0.35s ease';

    navbar.style.backgroundImage = 'none';
    // Change navbar background color on scroll
    window.addEventListener(Events.SCROLL, () => {
      const {scrollTop} = html;
      let alpha = (scrollTop / windowHeight) * 2;
      alpha >= 1 && (alpha = 1);
      navbar.style.backgroundColor = `rgba(${colorRgb?.[0] ?? ''}, ${colorRgb?.[1]}, ${colorRgb?.[2]}, ${alpha})`;
      navbar.style.backgroundImage =
        alpha > 0 || utils.hasClass(navbarCollapse as HTMLElement, 'show')
          ? backgroundImage
          : 'none';
    });

    // Toggle bg class on window resize
    utils.resize(() => {
      const breakPoint = utils.getBreakpoint(navbar);
      if (window.innerWidth > breakPoint) {
        removeNavbarBgClass();
        navbar.style.backgroundImage = html.scrollTop
          ? backgroundImage
          : 'none';
        navbar.style.transition = 'none';
      } else if (
        utils.hasClass(
          navbar.querySelector(Selector.NAVBAR_TOGGLER) as HTMLElement,
          ClassNames.COLLAPSED
        )
      ) {
        removeNavbarBgClass();
        navbar.style.backgroundImage = backgroundImage;
      }

      if (window.innerWidth <= breakPoint) {
        navbar.style.transition = utils.hasClass(navbarCollapse as HTMLElement, 'show')
          ? transition
          : 'none';
      }
    });

    navbarCollapse?.addEventListener(Events.SHOW_BS_COLLAPSE, () => {
      navbar.classList.add(getBgClassName(name, defaultColorName).bgClassName);
      navbar.style.backgroundImage = backgroundImage;
      navbar.style.transition = transition;
    });

    navbarCollapse?.addEventListener(Events.HIDE_BS_COLLAPSE, () => {
      removeNavbarBgClass();
      !html.scrollTop && (navbar.style.backgroundImage = 'none');
    });

    navbarCollapse?.addEventListener(Events.HIDDEN_BS_COLLAPSE, () => {
      navbar.style.transition = 'none';
    });
  }
}


const handleNavbarVerticalCollapsed = () => {
  const Selector = {
    HTML: 'html',
    NAVBAR_VERTICAL_TOGGLE: '.navbar-vertical-toggle',
    NAVBAR_VERTICAL_COLLAPSE: '.navbar-vertical .navbar-collapse',
    ECHART_RESPONSIVE: '[data-echart-responsive]',
  };

  const Events = {
    CLICK: 'click',
    MOUSE_OVER: 'mouseover',
    MOUSE_LEAVE: 'mouseleave',
    NAVBAR_VERTICAL_TOGGLE: 'navbar.vertical.toggle',
  };
  const ClassNames = {
    NAVBAR_VERTICAL_COLLAPSED: 'navbar-vertical-collapsed',
    NAVBAR_VERTICAL_COLLAPSED_HOVER: 'navbar-vertical-collapsed-hover',
  };
  const navbarVerticalToggle = document.querySelector(
    Selector.NAVBAR_VERTICAL_TOGGLE
  );
  const html = document.querySelector(Selector.HTML);
  const navbarVerticalCollapse = document.querySelector(
    Selector.NAVBAR_VERTICAL_COLLAPSE
  );

  if (navbarVerticalToggle) {
    navbarVerticalToggle.addEventListener(Events.CLICK, (e) => {
      (navbarVerticalToggle as any).blur();
      html?.classList.toggle(ClassNames.NAVBAR_VERTICAL_COLLAPSED);

      // Set collapse state on localStorage
      const isNavbarVerticalCollapsed = utils.getItemFromStore(
        'isNavbarVerticalCollapsed'
      );
      utils.setItemToStore(
        'isNavbarVerticalCollapsed',
        !isNavbarVerticalCollapsed
      );

      const event = new CustomEvent(Events.NAVBAR_VERTICAL_TOGGLE);
      e?.currentTarget?.dispatchEvent(event);
    });
  }
  if (navbarVerticalCollapse) {
    navbarVerticalCollapse.addEventListener(Events.MOUSE_OVER, () => {
      if (utils.hasClass(html as HTMLElement, ClassNames.NAVBAR_VERTICAL_COLLAPSED)) {
        html?.classList.add(ClassNames.NAVBAR_VERTICAL_COLLAPSED_HOVER);
      }
    });
    navbarVerticalCollapse.addEventListener(Events.MOUSE_LEAVE, () => {
      if (utils.hasClass(html as HTMLElement, ClassNames.NAVBAR_VERTICAL_COLLAPSED_HOVER)) {
        html?.classList.remove(ClassNames.NAVBAR_VERTICAL_COLLAPSED_HOVER);
      }
    });
  }
};

