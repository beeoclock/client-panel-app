import {Component, inject, ViewEncapsulation} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {Select} from "@ngxs/store";
import {BeeoclockIdTokenResult, IdentityState} from "@identity/identity/presentation/state/identity/identity.state";
import {Observable} from "rxjs";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {WithTenantIdPipe} from "@shared/presentation/pipes/with-tenant-id.pipe";


@Component({
	standalone: true,
	selector: 'utility-sidebar-configuration-component',
	templateUrl: './configuration.sidebar.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		RouterLink,
		TranslateModule,
		WithTenantIdPipe,
		RouterLinkActive
	],
})
export class ConfigurationSidebarComponent {

	private readonly translateService = inject(TranslateService);

	@Select(IdentityState.token)
	public token$!: Observable<BeeoclockIdTokenResult>;

}
