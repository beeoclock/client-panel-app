import {RouterModule} from '@angular/router';
import {inject, NgModule} from "@angular/core";
import {NgxsModule, Store} from "@ngxs/store";
import {CustomerState} from "@customer/state/customer/customer.state";
import {routers} from "@customer/presentation";
import {CustomerActions} from "@customer/state/customer/customer.actions";


@NgModule({
  imports: [
    NgxsModule.forFeature([CustomerState]),
    RouterModule.forChild(routers)
  ]
})
export class Module {

  private readonly store = inject(Store);

  constructor() {
    this.store.dispatch(new CustomerActions.InitDefaultsFromCache());
  }

}
