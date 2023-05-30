import {RouterModule} from '@angular/router';
import {NgModule} from "@angular/core";
import {NgxsModule} from "@ngxs/store";
import {CompanyState} from "@company/state/company/company.state";
import {routers} from "@company/presentation";


@NgModule({
  imports: [
    NgxsModule.forFeature([CompanyState]),
    RouterModule.forChild(routers)
  ]
})
export class Module {

}
