import {RouterModule} from '@angular/router';
import {NgModule} from "@angular/core";
import {NgxsModule} from "@ngxs/store";
import {EventState} from "@event/state/event/event.state";
import {routers} from "@event/presentation";


@NgModule({
  imports: [
    NgxsModule.forFeature([EventState]),
    RouterModule.forChild(routers)
  ]
})
export class Module {

}
