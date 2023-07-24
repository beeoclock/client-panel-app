import {Component, ViewEncapsulation} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AsyncPipe, NgIf} from "@angular/common";

@Component({
  selector: 'utility-wrapper-identity-component',
  standalone: true,
  template: `
    <div class="flex h-screen flex-col items-center justify-center px-6 py-12 lg:px-8">
      <router-outlet></router-outlet>
    </div>
  `,
  imports: [RouterOutlet, NgIf, AsyncPipe],
  encapsulation: ViewEncapsulation.None
})
export default class WrapperIdentityComponent {

}

