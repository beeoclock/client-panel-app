import {AfterViewInit, Directive, ElementRef, input, Optional} from '@angular/core';
import {AbstractControl, FormArray, FormControl, NgControl} from '@angular/forms';

@Directive({
  selector: '[isRequired]',
  standalone: true
})
export class IsRequiredDirective implements AfterViewInit {

  public readonly isRequiredEnabled = input(true);

  public readonly labelForId = input<string>();

  public readonly formArray = input<FormArray | null>(null);

  constructor(
    @Optional()
    private readonly ngControl: NgControl,
    private readonly elementRef: ElementRef<HTMLElement>
  ) {
  }

  public ngAfterViewInit(): void {

    const formArray = this.formArray();
    if (this.isRequiredEnabled() && (this.ngControl || formArray)) {

      if (formArray?.controls) {

        const validatorsCheck = !formArray.controls?.some((item: AbstractControl) => {
          return !item?.validator && !item?.validator?.(new FormControl())?.['required'];
        });
        if (validatorsCheck) {
          this.initRequiredAsterisk();
        }

      }

      if (this.ngControl?.control?.validator?.(new FormControl())?.['required']) {

        this.initRequiredAsterisk();

      }

    }

  }

  private initRequiredAsterisk(): void {

		const labelForId = this.labelForId();
  if (labelForId) {
			this.setLabelForId(labelForId);
			return;
		}

    const id: string | null = this.elementRef.nativeElement.getAttribute('id');

    if (id) {

      this.setLabelForId(id);

    } else {

      throw new Error(`Not found id attribute in tag, please add id to tag. ${id}`);

    }

  }

	private setLabelForId(id: string): void {

		const label: Element | null | undefined = this.elementRef?.nativeElement?.parentElement?.parentElement?.querySelector(`label[for="${id}"]`);

		if (label) {

			label.setAttribute('required', 'true');

		} else {

			throw new Error(`Not found label in parent scope, please add label and add attribute for label [for]="${id}".`);

		}

	}

}
