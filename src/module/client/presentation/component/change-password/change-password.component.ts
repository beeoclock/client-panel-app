import {Component, ViewEncapsulation} from '@angular/core';
import {BodyCardComponent} from '@utility/presentation/component/card/body.card.component';
import {CardComponent} from '@utility/presentation/component/card/card.component';
import {HeaderCardComponent} from '@utility/presentation/component/card/header.card.component';

@Component({
  selector: 'client-change-password-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    BodyCardComponent,
    CardComponent,
    HeaderCardComponent
  ],
  template: `
    <utility-card-component class="mb-3">
      <utility-header-card-component>
        <h5 class="mb-0">Change Password</h5>
      </utility-header-card-component>
      <utility-body-card-component>
        <form>
          <fieldset disabled>
            <div class="mb-3">
              <label class="form-label" for="old-password">Old Password</label>
              <input class="form-control" id="old-password" type="password">
            </div>
            <div class="mb-3">
              <label class="form-label" for="new-password">New Password</label>
              <input class="form-control" id="new-password" type="password">
            </div>
            <div class="mb-3">
              <label class="form-label" for="confirm-password">Confirm Password</label>
              <input class="form-control" id="confirm-password" type="password">
            </div>
            <button class="btn btn-primary d-block w-100" type="submit">Update Password</button>
          </fieldset>
        </form>
      </utility-body-card-component>
    </utility-card-component>
  `
})
export class ChangePasswordComponent {

}
