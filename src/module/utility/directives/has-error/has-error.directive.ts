import {AfterViewInit, Directive, ElementRef, Input, Optional} from '@angular/core';
import {AbstractControl, FormArray, NgControl} from '@angular/forms';

@Directive({
  selector: '[hasError]',
  standalone: true
})
export class HasErrorDirective implements AfterViewInit {

  @Input()
  public errorClass = 'is-invalid';

  @Input()
  public isMatFormField = false;

  @Input()
  public inputGroup = false;

  @Input()
  public checkFormError = false;

  @Input()
  public needTouched = true;

  @Input()
  public hasErrorEnabled = true;

  @Input()
  public classForNgSelect = 'border-danger';

  @Input()
  public ngSelectQuerySelectorClass = 'ng-select-container';

  @Input()
  public customControl: FormArray | undefined;

  constructor(
    @Optional()
    private readonly ngControl: NgControl,
    private readonly elementRef: ElementRef<HTMLElement>
  ) {
  }

  public ngAfterViewInit(): void {
    const control: AbstractControl = (this.customControl?.controls ?? this.ngControl?.control) as unknown as AbstractControl;
    if (this.hasErrorEnabled && control) {

      if (this.checkFormError) {
        const root: AbstractControl = control.root;
        root.statusChanges.subscribe(() => {
          if (root.invalid && root.errors) {
            this.markInvalidElements(root);
          }
        });
      }

      const callback: () => void = () => {

        if (control) {
          this.markInvalidElements(control);
        }

      };

      control.statusChanges.subscribe(() => {

        callback();

      });

      control.valueChanges.subscribe(() => {

        callback();

      });

      control.markAsTouched = function (opts: { onlySelf?: boolean } = {}) {

        const self = this as unknown as { touched: boolean, _parent: { markAsTouched: (arg: unknown) => void } };

        self.touched = true;

        if (self._parent && !opts.onlySelf) {
          self._parent.markAsTouched(opts);
        }

        callback();

      };

    }
  }

  private markInvalidElements(control: AbstractControl): void {
    const isTouched: boolean = this.needTouched ? control.touched : true;
    const isInvalid: boolean = !!Object.keys(control?.errors ?? {})?.length && isTouched;
    const nativeElement: HTMLElement = this.elementRef?.nativeElement;

    if (!nativeElement) {
      return;
    }

    const parentElement: HTMLElement | null = nativeElement.parentElement;

    if (!parentElement) {
      return;
    }

    const invalidTooltip: Element | null = parentElement?.querySelector?.('.invalid-tooltip');

    if (invalidTooltip) {
      invalidTooltip.classList.toggle('d-none', !isInvalid);
    }

    if (parentElement?.classList?.contains?.('input-group')) {
      Array.from(parentElement.children).forEach((child: Element) => {
        if (!child.classList.contains('invalid-tooltip') && !child.classList.contains('valid-tooltip')) {
          child.classList.toggle('border-danger', isInvalid);
        }
      });
    }

    if (this.elementRef.nativeElement.nodeName === 'NG-SELECT') {
      const div: HTMLElement | null = this.elementRef.nativeElement.querySelector(`.${this.ngSelectQuerySelectorClass}`);
      if (div) {
        div.classList.toggle(this.classForNgSelect, isInvalid);
      }
    }

    if (this.inputGroup) {
      const findInputGroup = (element: HTMLElement) => {
        if (element.classList.contains('input-group')) {
          return element;
        }
        return parentElement;
      };
      const inputGroup: HTMLElement = findInputGroup(this.elementRef.nativeElement);
      if (inputGroup) {
        inputGroup.classList.toggle(this.errorClass, isInvalid);
      }
    } else {
      if (this.isMatFormField) {
        const findParentMatFormField = (element: HTMLElement | null | undefined): HTMLElement => {
          if (element) {
            if (element.tagName === 'MAT-FORM-FIELD') {
              return element;
            }
          }
          return findParentMatFormField(element?.parentElement);
        };
        findParentMatFormField(this.elementRef.nativeElement).classList.toggle(this.errorClass, isInvalid);
      } else {
        this.elementRef.nativeElement.classList.toggle(this.errorClass, isInvalid);
      }
    }

  }

}
