import {Directive} from "@angular/core";
import {ButtonColorEnum, ButtonTypeEnum} from "@utility/presentation/directives/button/base.button.directive";
import {LoadingBaseButtonDirective} from "@utility/presentation/directives/button/loading.base.button.directive";

@Directive({
  selector: 'button[link]',
  standalone: true,
})
export class LinkButtonDirective extends LoadingBaseButtonDirective {

  protected override type = ButtonTypeEnum.link;
  protected override color = ButtonColorEnum.default;

}
