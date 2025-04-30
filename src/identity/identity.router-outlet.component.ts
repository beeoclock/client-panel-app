import {Component, ViewEncapsulation} from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
	selector: 'identity-router-outlet-component',
	standalone: true,
	template: `
		<div class="h-screen overflow-y-auto">
			<router-outlet/>
		</div>
	`,
	imports: [
		RouterOutlet,
	],
	encapsulation: ViewEncapsulation.None
})
export default class IdentityRouterOutletComponent {

}

