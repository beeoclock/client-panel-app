import {RouterModule} from '@angular/router';
import {NgModule} from "@angular/core";
import {NgxsModule} from "@ngxs/store";
import {routers} from "@customer/presentation/routers";
import {CustomerState} from "@customer/state/customer/customer.state";


@NgModule({
  imports: [
    NgxsModule.forFeature([CustomerState]),
    RouterModule.forChild(routers)
  ]
})
export class CustomerModule {

}
