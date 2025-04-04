import {Component, ViewEncapsulation} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {
	PageLoadingProgressBarComponent
} from "@shared/presentation/component/page-loading-progress-bar/page-loading-progress-bar.component";

@Component({
	selector: 'identity-router-outlet-component',
	standalone: true,
	template: `
		<utility-page-loading-progress-bar/>
		<div class="h-screen overflow-y-auto">
			<router-outlet/>
		</div>
	`,
	imports: [
		RouterOutlet,
		PageLoadingProgressBarComponent,
	],
	encapsulation: ViewEncapsulation.None
})
export default class IdentityRouterOutletComponent {

}

