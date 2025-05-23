import {importProvidersFrom, NgModule} from "@angular/core";
import {AbsenceModule} from "@tenant/member/absence/absence.module";
import {MemberModule} from "@tenant/member/member/member.module";
import {RolesModule} from "@tenant/member/roles/roles.module";

@NgModule({
	providers: [
		importProvidersFrom(
			AbsenceModule,
			MemberModule,
			RolesModule
		)
	]
})
export class MemberDomainModule {


}
