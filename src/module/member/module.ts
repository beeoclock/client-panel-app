import {RouterModule} from '@angular/router';
import {NgModule} from "@angular/core";
import {NgxsModule} from "@ngxs/store";
import {routers} from "@member/presentation";
import {MemberState} from "@member/state/member/member.state";


@NgModule({
  imports: [
    NgxsModule.forFeature([MemberState]),
    RouterModule.forChild(routers)
  ]
})
export class Module {
}
