/* -------------------------------------------------------------------------- */
/*                                Theme Control                               */
/* -------------------------------------------------------------------------- */


import {CONFIG} from '@src/script/config';
import {utils} from '@src/script/utls';
import {DomNode} from '@src/script/node';

export const initialDomSetup = (element: any) => {
  if (!element) return;
  const dataUrlDom = element.querySelector(
    '[data-theme-control = "navbarPosition"]'
  );
  const hasDataUrl = dataUrlDom ? utils.getData(dataUrlDom, "page-url") : null;

  element.querySelectorAll("[data-theme-control]").forEach((el: any) => {
    const inputDataAttributeValue = utils.getData(el, "theme-control");
    const localStorageValue = utils.getItemFromStore(inputDataAttributeValue);
    if (
      inputDataAttributeValue === "navbarStyle" &&
      !hasDataUrl &&
      (utils.getItemFromStore("navbarPosition") === "top" ||
        utils.getItemFromStore("navbarPosition") === "double-top")
    ) {
      el.setAttribute("disabled", true);
    }
    if (
      el.type === "select-one" &&
      inputDataAttributeValue === "navbarPosition"
    ) {
      el.value = localStorageValue;
    }
    if (el.type === "checkbox") {
      if (inputDataAttributeValue === "theme") {
        localStorageValue === "dark" && el.setAttribute("checked", true);
      } else {
        localStorageValue && el.setAttribute("checked", true);
      }
    } else {
      const isChecked = localStorageValue === el.value;
      isChecked && el.setAttribute("checked", true);
    }
  });
};

const changeTheme = (element: any) => {
  element.querySelectorAll('[data-theme-control = "theme"]').forEach((el: any) => {
    const inputDataAttributeValue = utils.getData(el, "theme-control");
    const localStorageValue = utils.getItemFromStore(inputDataAttributeValue);

    if (el.type === "checkbox") {
      localStorageValue === "dark" ? (el.checked = true) : (el.checked = false);
    } else {
      localStorageValue === el.value
        ? (el.checked = true)
        : (el.checked = false);
    }
  });
};

export const themeControl = () => {
  const themeController = new DomNode(document.body);

  const navbarVertical = document.querySelector(".navbar-vertical");
  initialDomSetup(themeController.node);

  themeController.on("click", (e: any) => {
    console.log(e);
    const target = new DomNode(e.target);

    if (target.data("theme-control")) {
      const control = target.data("theme-control");
      let value = e.target[e.target.type === "radio" ? "value" : "checked"];
      if (control === "theme") {
        typeof value === "boolean" && (value = value ? "dark" : "light");
      }
      if (control !== "navbarPosition") {
        Reflect.has(CONFIG, control) && utils.setItemToStore(control, value);
        switch (control) {
          case "theme": {
            document.documentElement.setAttribute("data-bs-theme", value);
            const clickControl = new CustomEvent("clickControl", {
              detail: {control, value},
            });
            e.currentTarget.dispatchEvent(clickControl);
            changeTheme(themeController.node);
            break;
          }
          case "navbarStyle": {
            if (navbarVertical) {
              navbarVertical.classList.remove("navbar-card");
              navbarVertical.classList.remove("navbar-inverted");
              navbarVertical.classList.remove("navbar-vibrant");
              if (value !== "transparent") {
                navbarVertical.classList.add(`navbar-${value}`);
              }
            }
            break;
          }
          case "reset": {
            Object.keys(CONFIG).forEach((key) => {
              localStorage.setItem(key, CONFIG[key]);
            });
            window.location.reload();
            break;
          }
          default:
            window.location.reload();
        }
      }
    }
  });

  // control navbar position
  themeController.on("change", (e: any) => {
    const target = new DomNode(e.target);

    if (target.data("theme-control") === "navbarPosition") {
      Reflect.has(CONFIG, 'navbarPosition') &&
      utils.setItemToStore("navbarPosition", e.target.value);

      const pageUrl = utils.getData(target.node.selectedOptions[0], "page-url");
      pageUrl
        ? window.location.replace(pageUrl)
        : window.location.replace(window.location.href.split("#")[0]);
    }
  });
};

