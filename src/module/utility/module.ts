import {NgModule} from "@angular/core";
import {NgxsModule} from "@ngxs/store";
import {AppState} from "@utility/state/app/app.state";
import {RouterModule} from "@angular/router";
import {routers} from "@utility/presentation";
import {CacheState} from "@utility/state/cache/cache.state";

@NgModule({
  imports: [
    RouterModule.forChild(routers),
    NgxsModule.forFeature([AppState, CacheState])
  ]
})
export class Module {

}
