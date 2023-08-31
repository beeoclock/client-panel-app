import {Directive} from "@angular/core";
import {ButtonTypeEnum} from "@utility/presentation/directives/button/base.button.directive";
import {LoadingBaseButtonDirective} from "@utility/presentation/directives/button/loading.base.button.directive";

@Directive({
  selector: 'button[primaryLink]',
  standalone: true,
})
export class PrimaryLinkButtonDirective extends LoadingBaseButtonDirective {

  protected override type = ButtonTypeEnum.link;

}
