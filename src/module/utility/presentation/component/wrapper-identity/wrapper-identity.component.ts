import {Component, ViewEncapsulation} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {StreamToastComponent} from '@utility/presentation/component/toast/stream.toast.component';

@Component({
  selector: 'utility-wrapper-identity-component',
  standalone: true,
  template: `
    <div class="flex min-h-full flex-col items-center justify-center px-6 py-12 lg:px-8">
      <router-outlet></router-outlet>
      <utility-stream-toast-component></utility-stream-toast-component>
    </div>
  `,
  imports: [RouterOutlet, StreamToastComponent],
  encapsulation: ViewEncapsulation.None
})
export default class WrapperIdentityComponent {

}

