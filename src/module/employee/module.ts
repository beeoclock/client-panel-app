import {RouterModule} from '@angular/router';
import {inject, NgModule} from "@angular/core";
import {NgxsModule, Store} from "@ngxs/store";
import {routers} from "@employee/presentation";
import {EmployeeState} from "@employee/state/employee/employee.state";
import {EmployeeActions} from "@employee/state/employee/employee.actions";


@NgModule({
  imports: [
    NgxsModule.forFeature([EmployeeState]),
    RouterModule.forChild(routers)
  ]
})
export class Module {

  private readonly store = inject(Store);

  constructor() {
    this.store.dispatch(new EmployeeActions.InitDefaultsFromCache());
  }
}
