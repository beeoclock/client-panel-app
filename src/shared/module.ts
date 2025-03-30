import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {routers} from "@shared/presentation";

@NgModule({
  imports: [
    RouterModule.forChild(routers),
  ]
})
export class Module {

}
