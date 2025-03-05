import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {RouterOutlet} from "@angular/router";
import {AnalyticsService} from "@utility/cdk/analytics.service";
import {
	CreateBusinessFormRepository
} from "@src/identity/module/identity/infrastructure/repository/create-business.form.repository";
import {CreateBusinessQuery} from "@src/identity/module/identity/infrastructure/query/create-business.query";

@Component({
	selector: 'app-identity-create-business-identity-page',
	template: `
		<div class="h-screen relative p-4 overflow-y-auto">
			<router-outlet/>
		</div>
	`,
	standalone: true,
	imports: [
		ReactiveFormsModule,
		TranslateModule,
		RouterOutlet
	],
	providers: [
		CreateBusinessFormRepository,
		CreateBusinessQuery
	],
	encapsulation: ViewEncapsulation.None
})
export class CreateBusinessIdentityPage implements OnInit {

	readonly #analyticsService = inject(AnalyticsService);
	// readonly #activatedRoute = inject(ActivatedRoute);
	// readonly #router = inject(Router);

	public ngOnInit() {
		this.#analyticsService.logEvent('member_list_page_initialized');
		// let {tenantId} = this.#activatedRoute.snapshot.params;
		// if (!tenantId) {
		// 	tenantId = new ObjectID().toHexString();
		// 	this.#router.navigate([tenantId], {relativeTo: this.#activatedRoute}).then();
		// }
	}

}

export default CreateBusinessIdentityPage;
