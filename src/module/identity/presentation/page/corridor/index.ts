import {Component, HostBinding, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {SignInComponent} from '@identity/presentation/component/sign-in.component/sign-in.component';
import {AppActions} from "@utility/state/app/app.actions";
import {Store} from '@ngxs/store';

@Component({
  selector: 'identity-corridor-page',
  templateUrl: 'index.html',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    SignInComponent
  ],
  encapsulation: ViewEncapsulation.None
})
export default class Index implements OnInit {

  public readonly store = inject(Store);

  @HostBinding()
  public readonly class = 'w-96 p-8 border dark:border-beeDarkColor-700 bg-white rounded dark:bg-beeDarkColor-800';

  public ngOnInit(): void {
    console.log('asd');
    this.store.dispatch(new AppActions.PageLoading(false));

    // TODO get information about user's business clients
    // TODO check if localStorage has information about user's business clients
    // TODO check if localStorage has information about selected user's business client

    // TODO As user have selected business client to redirect the user to dashboard with selected business client

  }

}
