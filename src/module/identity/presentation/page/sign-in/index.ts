import {Component, HostBinding, ViewEncapsulation} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {SignInComponent} from '@identity/presentation/component/sign-in.component/sign-in.component';

@Component({
  selector: 'identity-sign-in-page',
  templateUrl: 'index.html',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    SignInComponent
  ],
  encapsulation: ViewEncapsulation.None
})
export default class Index {

  @HostBinding()
  public readonly class = 'w-96 p-8 border dark:border-beeDarkColor-700 bg-white rounded-2xl dark:bg-beeDarkColor-800';

}
