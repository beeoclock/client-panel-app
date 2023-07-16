import {RouterModule} from '@angular/router';
import {inject, NgModule} from "@angular/core";
import {NgxsModule, Store} from "@ngxs/store";
import {routers} from "@member/presentation";
import {MemberState} from "@member/state/member/member.state";
import {MemberActions} from "@member/state/member/member.actions";
import {IdentityState} from "@identity/state/identity/identity.state";
import {filter} from "rxjs";


@NgModule({
  imports: [
    NgxsModule.forFeature([MemberState]),
    RouterModule.forChild(routers)
  ]
})
export class Module {

  private readonly store = inject(Store);

  constructor() {
    this.store.select(IdentityState.clientId)
      .pipe(
        filter(result => !!result)
      )
      .subscribe(() => {
        this.store.dispatch(new MemberActions.InitDefaultsFromCache());
      });
  }
}
