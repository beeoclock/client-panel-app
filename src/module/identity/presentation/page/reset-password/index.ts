import {Component, HostBinding, ViewEncapsulation} from '@angular/core';
import {
  ResetPasswordComponent
} from "@identity/presentation/component/reset-password.component/reset-password.component";

@Component({
  selector: 'identity-reset-password-page',
  templateUrl: 'index.html',
  standalone: true,
  imports: [
    ResetPasswordComponent
  ],
  encapsulation: ViewEncapsulation.None
})
export default class Index {

  @HostBinding()
  public readonly class = 'w-96 p-8 border dark:border-beeDarkColor-700 bg-white rounded dark:bg-beeDarkColor-800';
}
