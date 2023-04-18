import {Component, ViewEncapsulation} from '@angular/core';
import {ButtonComponent} from '@utility/presentation/component/button/button.component';

@Component({
  selector: 'company-danger-zone-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    ButtonComponent
  ],
  template: `
    <div class="card">
      <div class="card-header">
        <h5 class="mb-0">Danger Zone</h5>
      </div>
      <div class="card-body bg-light">
        <h5 class="fs-0">Transfer Ownership</h5>
        <p class="fs--1">Transfer this account to another user or to an organization where you have the ability to
          create repositories.</p>
        <div class="d-grid">
          <button beeoclock disabled>Transfer</button>
        </div>
        <div class="border-bottom border-dashed my-4"></div>
        <h5 class="fs-0">Delete this account</h5>
        <p class="fs--1">Once you delete a account, there is no going back. Please be certain.</p>
        <div class="d-grid">
          <button beeoclock disabled>Deactivate Account</button>
        </div>
      </div>
    </div>
  `
})
export class DangerZoneComponent {

}
