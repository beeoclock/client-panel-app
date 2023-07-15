import {Component, ViewEncapsulation} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {StreamToastComponent} from '@utility/presentation/component/toast/stream.toast.component';
import {AsyncPipe, NgIf} from "@angular/common";
import {Select} from "@ngxs/store";
import {IdentityState} from "@identity/state/identity/identity.state";
import {Observable} from "rxjs";
import {IdTokenResult} from "@angular/fire/auth";

@Component({
  selector: 'utility-wrapper-identity-component',
  standalone: true,
  template: `
    <ng-container *ngIf="token$ | async">
      <div class="flex h-screen flex-col items-center justify-center px-6 py-12 lg:px-8">
        <router-outlet></router-outlet>
      </div>
    </ng-container>
  `,
  imports: [RouterOutlet, StreamToastComponent, NgIf, AsyncPipe],
  encapsulation: ViewEncapsulation.None
})
export default class WrapperIdentityComponent {

  @Select(IdentityState.token)
  public readonly token$!: Observable<IdTokenResult | undefined>;

}

