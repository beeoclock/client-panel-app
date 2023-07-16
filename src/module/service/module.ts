import {RouterModule} from '@angular/router';
import {inject, NgModule} from "@angular/core";
import {NgxsModule, Store} from "@ngxs/store";
import {ServiceState} from "@service/state/service/service.state";
import {routers} from "@service/presentation";
import {ServiceActions} from "@service/state/service/service.actions";
import {IdentityState} from "@identity/state/identity/identity.state";
import {filter} from "rxjs";


@NgModule({
  imports: [
    NgxsModule.forFeature([ServiceState]),
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
        this.store.dispatch(new ServiceActions.InitDefaultsFromCache());
      });
  }
}
