import {RouterModule} from '@angular/router';
import {inject, NgModule} from "@angular/core";
import {NgxsModule, Store} from "@ngxs/store";
import {ServiceState} from "@service/state/service/service.state";
import {routers} from "@service/presentation";
import {ServiceActions} from "@service/state/service/service.actions";


@NgModule({
  imports: [
    NgxsModule.forFeature([ServiceState]),
    RouterModule.forChild(routers)
  ]
})
export class Module {

  private readonly store = inject(Store);

  constructor() {
    this.store.dispatch(new ServiceActions.InitDefaultsFromCache());
  }
}
