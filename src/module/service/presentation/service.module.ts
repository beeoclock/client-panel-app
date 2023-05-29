import {RouterModule} from '@angular/router';
import {NgModule} from "@angular/core";
import {NgxsModule} from "@ngxs/store";
import {routers} from "@service/presentation/routers";
import {ServiceState} from "@service/state/service/service.state";


@NgModule({
  imports: [
    NgxsModule.forFeature([ServiceState]),
    RouterModule.forChild(routers)
  ]
})
export class ServiceModule {

}
