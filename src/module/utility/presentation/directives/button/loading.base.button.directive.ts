import {AfterViewInit, Directive, DoCheck, ElementRef, inject, Input, OnInit} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {SpinnerSvg} from "@utility/domain/spinner.svg";
import {BaseButtonDirective} from "@utility/presentation/directives/button/base.button.directive";

@Directive({
  selector: 'button[loadingBase]',
  standalone: true,
})
export class LoadingBaseButtonDirective extends BaseButtonDirective implements OnInit, DoCheck, AfterViewInit {

  @Input()
  public isLoading: boolean | undefined = undefined;

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
		if (this.isLoading === undefined) {
			return;
		}
    this.elementRef.nativeElement.disabled = this.isLoading;
    if (this.isLoading) {
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
