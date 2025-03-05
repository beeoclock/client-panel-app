import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {routers} from "@utility/presentation";

@NgModule({
  imports: [
    RouterModule.forChild(routers),
  ]
})
export class Module {

}
