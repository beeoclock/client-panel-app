import {RouterModule} from '@angular/router';
import {NgModule} from "@angular/core";
import {NgxsModule} from "@ngxs/store";
import {routers} from "@company/presentation/routers";
import {CompanyState} from "@company/state/company/company.state";


@NgModule({
  imports: [
    NgxsModule.forFeature([CompanyState]),
    RouterModule.forChild(routers)
  ]
})
export class CompanyModule {

}
