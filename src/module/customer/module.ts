import {RouterModule} from '@angular/router';
import {NgModule} from "@angular/core";
import {NgxsModule} from "@ngxs/store";
import {CustomerState} from "@customer/state/customer/customer.state";
import {routers} from "@customer/presentation";


@NgModule({
  imports: [
    NgxsModule.forFeature([CustomerState]),
    RouterModule.forChild(routers)
  ]
})
export class Module {

}
