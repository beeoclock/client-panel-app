import {RouterModule} from '@angular/router';
import {NgModule} from "@angular/core";
import {NgxsModule} from "@ngxs/store";
import {ClientState} from "./state/client/client.state";
import {routers} from ".//presentation";


@NgModule({
  imports: [
    NgxsModule.forFeature([ClientState]),
    RouterModule.forChild(routers)
  ]
})
export class Module {

}
