import {RouterModule} from '@angular/router';
import {NgModule} from "@angular/core";
import {NgxsModule} from "@ngxs/store";
import {routers} from "@employee/presentation";
import {EmployeeState} from "@employee/state/employee/employee.state";


@NgModule({
  imports: [
    NgxsModule.forFeature([EmployeeState]),
    RouterModule.forChild(routers)
  ]
})
export class Module {

}
