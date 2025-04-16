import {Component, ElementRef, inject, Input, input, viewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateModule} from "@ngx-translate/core";
import {WINDOW} from "@core/cdk/window.provider";

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
		TranslateModule,
	],
	encapsulation: ViewEncapsulation.None
})
export class BackButtonComponent {

	private readonly activatedRoute = inject(ActivatedRoute);

	public readonly queryParams = input({});

	@Input()
	public url: never | string[] = [];

	readonly link = viewChild.required<ElementRef<HTMLElement>>('link');

	private readonly router = inject(Router);

	private readonly window = inject(WINDOW);

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
