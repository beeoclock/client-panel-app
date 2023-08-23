import {Component, ViewEncapsulation} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AsyncPipe, NgIf} from "@angular/common";
import {
  PageLoadingProgressBarComponent
} from "@utility/presentation/component/page-loading-progress-bar/page-loading-progress-bar.component";

@Component({
  selector: 'utility-wrapper-identity-component',
  standalone: true,
  template: `
    <utility-page-loading-progress-bar></utility-page-loading-progress-bar>
    <div class="flex h-screen flex-col items-center justify-center px-6 py-12 lg:px-8 ">
      <router-outlet></router-outlet>
    </div>
  `,
  imports: [RouterOutlet, NgIf, AsyncPipe, PageLoadingProgressBarComponent],
  encapsulation: ViewEncapsulation.None
})
export default class WrapperIdentityComponent {

}

