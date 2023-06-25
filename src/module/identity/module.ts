import {RouterModule} from '@angular/router';
import {NgModule} from "@angular/core";
import {routers} from "@identity/presentation";


@NgModule({
  imports: [
    RouterModule.forChild(routers)
  ]
})
export class Module {

}
