import {importProvidersFrom, NgModule} from "@angular/core";
import {AbsenceModule} from "@tenant/member/absence/absence.module";
import {MemberModule} from "@tenant/member/member/member.module";

@NgModule({
	providers: [
		importProvidersFrom(
			AbsenceModule,
			MemberModule,
		)
	]
})
export class MemberDomainModule {


}
