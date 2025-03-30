import {AfterViewInit, Directive, DoCheck, ElementRef, HostBinding, inject, input, OnInit} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {SpinnerSvg} from "@shared/domain/spinner.svg";
import {BaseButtonDirective} from "@shared/presentation/directives/button/base.button.directive";

@Directive({
	selector: 'button[loadingBase]',
	standalone: true,
})
export class LoadingBaseButtonDirective extends BaseButtonDirective implements OnInit, DoCheck, AfterViewInit {

	public readonly isLoading = input<boolean>();

	public readonly isDisabled = input(false);

	@HostBinding('disabled')
	public disabled = false;

	private readonly translateService = inject(TranslateService);
	private readonly elementRef: ElementRef<HTMLButtonElement> = inject(ElementRef);
	private temporaryButtonHTML: string | undefined;
	private loadingHTML = '';
	private initialized = false;

	public override ngOnInit(): void {
		super.ngOnInit();
		this.initLoadingLabel();
	}

	public ngDoCheck(): void {
		if (this.initialized) {
			this.detectLoading();
		}
	}

	public ngAfterViewInit() {
		this.initialized = true;
		this.detectLoading();
	}

	private initLoadingLabel(): void {
		const label = this.translateService.instant('keyword.capitalize.processing');
		this.loadingHTML = `<div class="flex items-center justify-center">${SpinnerSvg} ${label}...</div>`;
	}

	private detectLoading(): void {
		const isLoading = this.isLoading();
  if (isLoading === undefined) {
			return;
		}
		if (this.isDisabled()) {
			this.disabled = true;
			return;
		}
		this.disabled = isLoading;
		if (isLoading) {
			if (!this.temporaryButtonHTML) {
				this.temporaryButtonHTML = this.elementRef.nativeElement.innerHTML;
				this.elementRef.nativeElement.innerHTML = this.loadingHTML;
			}
		} else {
			if (this.temporaryButtonHTML) {
				this.elementRef.nativeElement.innerHTML = this.temporaryButtonHTML ?? '';
				this.temporaryButtonHTML = undefined;
			}
		}
	}

}
