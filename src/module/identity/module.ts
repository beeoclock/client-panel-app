import {RouterModule} from '@angular/router';
import {NgModule} from "@angular/core";
import {NgxsModule} from "@ngxs/store";
import {routers} from "@identity/presentation";
import {IdentityState} from "@identity/state/identity/identity.state";


@NgModule({
  imports: [
    NgxsModule.forFeature([IdentityState]),
    RouterModule.forChild(routers)
  ]
})
export class Module {

}
