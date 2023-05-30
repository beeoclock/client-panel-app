import {NgModule} from "@angular/core";
import {NgxsModule} from "@ngxs/store";
import {AppState} from "@utility/state/app/app.state";
import {RouterModule} from "@angular/router";
import {routers} from "@utility/presentation";

@NgModule({
  imports: [
    RouterModule.forChild(routers),
    NgxsModule.forFeature([AppState])
  ]
})
export class Module {

}
