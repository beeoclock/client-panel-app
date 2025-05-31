import {Component, inject, ViewEncapsulation} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {SidebarService} from "@shared/presentation/component/sidebar/sidebar.service";
import {Store} from "@ngxs/store";
import {
	BusinessProfileState
} from "@tenant/business-profile/infrastructure/state/business-profile/business-profile.state";

@Component({
	standalone: true,
	selector: 'utility-navbar-component',
	templateUrl: './navbar.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		TranslateModule,
	]
})
export class NavbarComponent {
	public readonly sidebarService = inject(SidebarService);
	public readonly store = inject(Store);
	public readonly logo = this.store.selectSignal(BusinessProfileState.logo)
}
