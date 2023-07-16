import {RouterModule} from '@angular/router';
import {inject, NgModule} from "@angular/core";
import {NgxsModule, Store} from "@ngxs/store";
import {CustomerState} from "@customer/state/customer/customer.state";
import {routers} from "@customer/presentation";
import {CustomerActions} from "@customer/state/customer/customer.actions";
import {IdentityState} from "@identity/state/identity/identity.state";
import {filter} from "rxjs";


@NgModule({
  imports: [
    NgxsModule.forFeature([CustomerState]),
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
        this.store.dispatch(new CustomerActions.InitDefaultsFromCache());
      });
  }

}
