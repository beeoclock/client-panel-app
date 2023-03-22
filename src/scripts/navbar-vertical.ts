/* -------------------------------------------------------------------------- */
/*                               Navbar Vertical                              */
/* -------------------------------------------------------------------------- */

import {utils} from '@src/scripts/utls';

export const handleNavbarVerticalCollapsed = () => {
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
  const navbarVerticalToggle: HTMLInputElement = document.querySelector(
    Selector.NAVBAR_VERTICAL_TOGGLE
  ) as any;
  const html: HTMLElement = document.querySelector(Selector.HTML) as any;
  const navbarVerticalCollapse = document.querySelector(
    Selector.NAVBAR_VERTICAL_COLLAPSE
  );

  if (navbarVerticalToggle) {
    navbarVerticalToggle.addEventListener(Events.CLICK, (e) => {
      navbarVerticalToggle.blur();
      if (html) {
        html.classList.toggle(ClassNames.NAVBAR_VERTICAL_COLLAPSED);
      }

      // Set collapse state on localStorage
      const isNavbarVerticalCollapsed = utils.getItemFromStore(
        'isNavbarVerticalCollapsed'
      );
      utils.setItemToStore(
        'isNavbarVerticalCollapsed',
        !isNavbarVerticalCollapsed
      );

      const event = new CustomEvent(Events.NAVBAR_VERTICAL_TOGGLE);
      e.currentTarget?.dispatchEvent(event);
    });
  }
  if (navbarVerticalCollapse) {
    navbarVerticalCollapse.addEventListener(Events.MOUSE_OVER, () => {
      if (html) {
        if (utils.hasClass(html, ClassNames.NAVBAR_VERTICAL_COLLAPSED)) {
          html.classList.add(ClassNames.NAVBAR_VERTICAL_COLLAPSED_HOVER);
        }
      }
    });
    navbarVerticalCollapse.addEventListener(Events.MOUSE_LEAVE, () => {
      if (html) {
        if (utils.hasClass(html, ClassNames.NAVBAR_VERTICAL_COLLAPSED_HOVER)) {
          html.classList.remove(ClassNames.NAVBAR_VERTICAL_COLLAPSED_HOVER);
        }
      }
    });
  }
};

