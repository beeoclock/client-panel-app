import {Component, ViewEncapsulation} from '@angular/core';
import {
  ResetPasswordComponent
} from "@identity/presentation/component/reset-password.component/reset-password.component";
import {BackLinkComponent} from "@utility/presentation/component/link/back.link.component";

@Component({
  selector: 'identity-reset-password-page',
  templateUrl: 'index.html',
  standalone: true,
  imports: [
    ResetPasswordComponent,
    BackLinkComponent
  ],
  encapsulation: ViewEncapsulation.None
})
export default class Index {
}
