import {Component, ElementRef, HostBinding, inject, Input, ViewChild, ViewEncapsulation, input} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {TranslateModule} from "@ngx-translate/core";
import {LinkButtonDirective} from "@utility/presentation/directives/button/link.button.directive";
import {WINDOW, WINDOW_PROVIDERS} from "@utility/cdk/window.provider";

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
    RouterLink,
    TranslateModule,
    LinkButtonDirective
  ],
	providers: [
		WINDOW_PROVIDERS
	],
  encapsulation: ViewEncapsulation.None
})
export class BackLinkComponent {

  private readonly activatedRoute = inject(ActivatedRoute);

  public readonly queryParams = input({});

  @Input()
  public url: never | string[] = [];

  @ViewChild('link')
  public link!: ElementRef<HTMLElement>;

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
