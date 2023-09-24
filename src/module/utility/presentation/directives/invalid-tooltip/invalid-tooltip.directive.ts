import {Directive, DoCheck, ElementRef, inject, Input, Optional} from '@angular/core';
import {AbstractControl, NgControl} from '@angular/forms';
import {is} from "thiis";
import {TranslateService} from "@ngx-translate/core";
import {getFirstKey} from "@utility/domain";

@Directive({
  selector: '[invalidTooltip]',
  standalone: true
})
export class InvalidTooltipDirective implements DoCheck {

  @Input()
  public needTouched = true;

  @Input()
  public basePathOfTranslate = 'form.validation.';

  @Input()
  public setRedBorderTo: string | undefined;

  public control: undefined | null | AbstractControl<any, any>;

  public invalidCustomTooltip: undefined | HTMLDivElement;

  @Optional()
  private readonly ngControl = inject(NgControl);
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly translateService = inject(TranslateService);
  private reason: string | undefined;

  public ngDoCheck(): void {
    this.control = this.ngControl?.control; // Get the associated control
    this.detection(); // Call the function to mark invalid elements
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

    // Remove red border from input
    this.elementRef.nativeElement.classList.remove('!border-red-500');

  }

  // Add invalid custom tooltip in DOM
  public buildInvalidCustomTooltip(): void {

    // Check if control is exist and if it is untouched
    if (!this.control || this.control.root.untouched) {
      return;
    }

    // Get first key of errors from control errors object
    const key = getFirstKey(this.control.errors);

    // Check if tooltip is existed
    if (this.invalidCustomTooltip) {
      // Check reason, if the same then leave the function
      if (this.reason === key) {
        return;
      }
      this.invalidCustomTooltip?.remove();
    }

    // Update reason
    this.reason = key;

    // Check if element has parent element to set relative position
    if (!this.elementRef.nativeElement.parentElement) {
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
      this.basePathOfTranslate + key,
      this.control.errors?.[key] ?? undefined
    );

    this.elementRef.nativeElement.parentElement.appendChild(this.invalidCustomTooltip);

    // Add border red to input
		if (this.setRedBorderTo) {
			const element = document.querySelector(this.setRedBorderTo);
			if (element) {
				element.classList.add('!border-red-500');
			}
		} else {
			this.elementRef.nativeElement.classList.add('!border-red-500');
		}

  }

}
