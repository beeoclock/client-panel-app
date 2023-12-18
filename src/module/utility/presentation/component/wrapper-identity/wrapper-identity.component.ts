import {Component, ViewEncapsulation} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AsyncPipe, NgIf} from "@angular/common";
import {
	PageLoadingProgressBarComponent
} from "@utility/presentation/component/page-loading-progress-bar/page-loading-progress-bar.component";

@Component({
	selector: 'utility-wrapper-identity-component',
	standalone: true,
	template: `
		<utility-page-loading-progress-bar/>
		<div class="h-screen overflow-y-auto">
			<router-outlet/>
		</div>
	`,
	imports: [
		RouterOutlet,
		NgIf,
		AsyncPipe,
		PageLoadingProgressBarComponent,
	],
	encapsulation: ViewEncapsulation.None
})
export default class WrapperIdentityComponent {

}

