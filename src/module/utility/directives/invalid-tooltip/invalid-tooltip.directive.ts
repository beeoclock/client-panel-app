import {AfterViewInit, Directive, ElementRef, inject, Input, Optional} from '@angular/core';
import {AbstractControl, NgControl} from '@angular/forms';
import {is} from "thiis";
import {TranslateService} from "@ngx-translate/core";
import {getFirstKey} from "@utility/domain";

@Directive({
  selector: '[invalidTooltip]',
  standalone: true
})
export class InvalidTooltipDirective implements AfterViewInit {

  @Input()
  public needTouched = true;

  @Input()
  public basePathOfTranslate: string = 'form.validation.';

  public control: undefined | null | AbstractControl<any, any>;

  public invalidCustomTooltip: undefined | HTMLDivElement;

  @Optional()
  private readonly ngControl = inject(NgControl);
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly translateService = inject(TranslateService);

  public ngAfterViewInit(): void {
    this.control = this.ngControl?.control;
    if (this.control) {

      const callback: () => void = () => {

        this.detection();

      };

      this.control.statusChanges.subscribe(() => {

        callback();

      });

      this.control.valueChanges.subscribe(() => {

        callback();

      });

      this.control.markAsTouched = function (opts: { onlySelf?: boolean } = {}) {

        const self = this as unknown as { touched: boolean, _parent: { markAsTouched: (arg: unknown) => void } };

        self.touched = true;

        if (self._parent && !opts.onlySelf) {
          self._parent.markAsTouched(opts);
        }

        callback();

      };

    }
  }

  // Detect if control has error, if it true that add
  // invalid custom tooltip about the error
  // if it false that we try to remove existing invalid custom tooltip
  public detection(): void {

    const hasError = is.object.not.empty(this.control?.errors);

    if (hasError) {

      this.buildInvalidCustomTooltip();

    } else {

      this.disposeInvalidCustomTooltip();

    }

  }

  // Delete existing invalid custom tooltip form DOM
  public disposeInvalidCustomTooltip(): void {

    this.invalidCustomTooltip?.remove();

  }

  // Add invalid custom tooltip in DOM
  public buildInvalidCustomTooltip(): void {

    // Check if tooltip is existed
    if (this.invalidCustomTooltip) {
      return;
    }

    // Check if element has parent element to set relative position
    if (!this.elementRef.nativeElement.parentElement) {
      return;
    }

    // Check if control is exist
    if (!this.control) {
      return;
    }

    // Check if parent has relative position
    if (
      !this.elementRef.nativeElement.parentElement.classList.contains('relative')
    ) {
      // If it has not that add
      this.elementRef.nativeElement.parentElement.classList.add('relative')
    }

    // Build custom DOM element
    this.invalidCustomTooltip = document.createElement('div');
    this.invalidCustomTooltip.classList.add(
      'absolute',
      'top-full',
      'rounded',
      'bg-red-500',
      'text-white',
      'px-3',
      'py-1',
      'z-30'
    );

    // Set message about error
    this.invalidCustomTooltip.innerText = this.translateService.instant(
      this.basePathOfTranslate + getFirstKey(this.control.errors)
    );

    this.elementRef.nativeElement.parentElement.appendChild(this.invalidCustomTooltip)

  }

}
