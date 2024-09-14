/* -------------------------------------------------------------------------- */
/*                                  Detector                                  */
/* -------------------------------------------------------------------------- */

import {is} from "@utility/checker";

export const detectorInit = (html: HTMLElement) => {

  is.opera() && html.classList.add('opera');
  is.mobile() && html.classList.add('mobile');
  is.firefox() && html.classList.add('firefox');
  is.safari() && html.classList.add('safari');
  is.ios() && html.classList.add('ios');
  is.iphone() && html.classList.add('iphone');
  is.ipad() && html.classList.add('ipad');
  is.ie() && html.classList.add('ie');
  is.edge() && html.classList.add('edge');
  is.chrome() && html.classList.add('chrome');
  is.mac() && html.classList.add('osx');
  is.windows() && html.classList.add('windows');
};

