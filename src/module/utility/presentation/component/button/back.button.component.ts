import {Component, ElementRef, inject, Input, ViewChild, ViewEncapsulation, input} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {TranslateModule} from "@ngx-translate/core";
import {LinkButtonDirective} from "@utility/presentation/directives/button/link.button.directive";
import {WINDOW, WINDOW_PROVIDERS} from "@utility/cdk/window.provider";

@Component({
	selector: 'utility-back-button-component',
	standalone: true,
	template: `
		<button
			type="button"
			(click)="navigateToBack()"
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
	providers: [
		WINDOW_PROVIDERS
	],
	encapsulation: ViewEncapsulation.None
})
export class BackButtonComponent {

	private readonly activatedRoute = inject(ActivatedRoute);

	public readonly queryParams = input({});

	@Input()
	public url: never | string[] = [];

	@ViewChild('link')
	public link!: ElementRef<HTMLElement>;

	private readonly router = inject(Router);

	private readonly window = inject(WINDOW) as Window;

	public navigateToBack() {
		const {returnUrl} = this.activatedRoute.snapshot.queryParams;
		if (!this.url.length) {
			if (returnUrl) {
				this.url = [returnUrl];
			} else {
				if (this.window.history.length > 1) {
					this.window.history.back();
					return;
				}
				this.url = ['../'];
			}
		}
		return this.router.navigate(this.url, {
			relativeTo: this.activatedRoute,
			queryParams: this.queryParams()
		});
	}

}
