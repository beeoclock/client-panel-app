import {RouterModule} from '@angular/router';
import {inject, NgModule} from "@angular/core";
import {NgxsModule, Store} from "@ngxs/store";
import {EventState} from "@event/state/event/event.state";
import {routers} from "@event/presentation";
import {EventActions} from "@event/state/event/event.actions";
import {IdentityState} from "@identity/state/identity/identity.state";
import {filter} from "rxjs";


@NgModule({
  imports: [
    NgxsModule.forFeature([EventState]),
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
        this.store.dispatch(new EventActions.InitDefaultsFromCache());
      });
  }
}
