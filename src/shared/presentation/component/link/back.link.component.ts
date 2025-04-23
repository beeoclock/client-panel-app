import {Component, ElementRef, HostBinding, inject, Input, input, viewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateModule} from "@ngx-translate/core";
import {LinkButtonDirective} from "@shared/presentation/directives/button/link.button.directive";
import {WINDOW} from "@core/cdk/window.provider";

@Component({
	selector: 'utility-back-link-component',
	standalone: true,
	template: `
		<button
			(click)="navigateToBack()"
			#link link>
			<i class="bi bi-arrow-left me-2"></i>
			{{ 'keyword.capitalize.back' | translate }}
		</button>
	`,
	imports: [
		TranslateModule,
		LinkButtonDirective
	],
	encapsulation: ViewEncapsulation.None
})
export class BackLinkComponent {

	private readonly activatedRoute = inject(ActivatedRoute);

	public readonly queryParams = input({});

	@Input()
	public url: never | string[] = [];

	readonly link = viewChild.required<ElementRef<HTMLElement>>('link');

	@HostBinding()
	public readonly class = 'flex';

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
