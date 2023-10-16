import {Component, ElementRef, inject, Input, ViewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {TranslateModule} from "@ngx-translate/core";
import {LinkButtonDirective} from "@utility/presentation/directives/button/link.button.directive";

@Component({
	selector: 'utility-back-button-component',
	standalone: true,
	template: `
		<button
			type="button"
			[routerLink]="url"
			[queryParams]="queryParams"
			class="flex items-center justify-center rounded-2xl bg-white hover:bg-beeColor-50 dark:bg-beeDarkColor-800 dark:hover:bg-beeDarkColor-600 px-4 py-2 text-sm font-semibold text-beeColor-900 dark:text-beeColor-200 shadow-sm ring-1 ring-inset ring-beeColor-300 cursor-pointer"
			#link>
			<i class="bi bi-arrow-left me-2"></i>
			{{ 'keyword.capitalize.back' | translate }}
		</button>
	`,
	imports: [
		RouterLink,
		TranslateModule,
		LinkButtonDirective
	],
	encapsulation: ViewEncapsulation.None
})
export class BackButtonComponent {

	private readonly activatedRoute = inject(ActivatedRoute);

	@Input()
	public queryParams = {};

	@Input()
	public url: string | string[] = this.activatedRoute.snapshot.queryParams['returnUrl'] ?? ['../'];

	@ViewChild('link')
	public link!: ElementRef<HTMLElement>;

}
