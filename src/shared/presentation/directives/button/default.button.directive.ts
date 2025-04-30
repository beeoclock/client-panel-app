import {Directive} from "@angular/core";
import {ButtonColorEnum} from "@shared/presentation/directives/button/base.button.directive";
import {LoadingBaseButtonDirective} from "@shared/presentation/directives/button/loading.base.button.directive";

@Directive({
  selector: 'button[default]',
  standalone: true,
})
export class DefaultButtonDirective extends LoadingBaseButtonDirective {

  protected override color = ButtonColorEnum.default;

}
