import {Directive} from "@angular/core";
import {ButtonColorEnum} from "@utility/presentation/directives/button/base.button.directive";
import {LoadingBaseButtonDirective} from "@utility/presentation/directives/button/loading.base.button.directive";

@Directive({
  selector: 'button[primary]',
  standalone: true,
})
export class PrimaryButtonDirective extends LoadingBaseButtonDirective {

  protected override color = ButtonColorEnum.primary;

}
