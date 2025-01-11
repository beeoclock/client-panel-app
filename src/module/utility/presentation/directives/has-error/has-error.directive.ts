import {Directive, DoCheck, ElementRef, inject, Input, Optional, input} from '@angular/core';
import {AbstractControl, NgControl} from '@angular/forms';

@Directive({
  selector: '[hasError]', // Selector to apply directive
  standalone: true // Indicating it's a standalone directive
})
export class HasErrorDirective implements DoCheck {

  // Input properties with default values
  public readonly errorClass = input('is-invalid');

  public readonly needTouched = input(true);

  public readonly hasErrorEnabled = input(true);

  public readonly classForNgSelect = input('!border-red-500');

  public readonly ngSelectQuerySelectorClass = input('ng-select-container');

  // Control property to bind the associated control
  @Input()
  public control: AbstractControl | null | undefined;

  @Optional()
  private readonly ngControl = inject(NgControl); // Optional NgControl injection

  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef); // ElementRef for DOM manipulation

  public ngDoCheck(): void {
    if (this.hasErrorEnabled()) {
      this.control = this.ngControl?.control; // Get the associated control
      this.markInvalidElements(this.control); // Call the function to mark invalid elements
    }
  }

  private markInvalidElements(control: AbstractControl | null | undefined): void {

    if (!control) {
      return; // If control is missing, exit
    }

    const isTouched: boolean = this.needTouched() ? control.touched : true;
    const isInvalid: boolean = !!Object.keys(control?.errors ?? {}).length && isTouched;

    const nativeElement: HTMLElement = this.elementRef.nativeElement;

    if (!nativeElement) {
      return; // If native element is missing, exit
    }

    const parentElement: HTMLElement | null = nativeElement.parentElement;

    if (!parentElement) {
      return; // If parent element is missing, exit
    }

    // Toggle visibility of invalid tooltip
    const invalidTooltip: Element | null = parentElement?.querySelector?.('.invalid-message');
    if (invalidTooltip) {
      invalidTooltip.classList.toggle('d-none', !isInvalid);
    }

    // Toggle CSS class for NG-SELECT
    if (this.elementRef.nativeElement.nodeName === 'NG-SELECT') {
      const div: HTMLElement | null = this.elementRef.nativeElement.querySelector(`.${this.ngSelectQuerySelectorClass()}`);
      if (div) {
        div.classList.toggle(this.classForNgSelect(), isInvalid);
      }
    }

    // Toggle the errorClass for styling
    this.elementRef.nativeElement.classList.toggle(this.errorClass(), isInvalid);
  }
}
