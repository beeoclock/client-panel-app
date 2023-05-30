import {RouterModule} from '@angular/router';
import {NgModule} from "@angular/core";
import {NgxsModule} from "@ngxs/store";
import {ServiceState} from "@service/state/service/service.state";
import {routers} from "@service/presentation";


@NgModule({
  imports: [
    NgxsModule.forFeature([ServiceState]),
    RouterModule.forChild(routers)
  ]
})
export class Module {

}
