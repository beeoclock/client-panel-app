import {AfterViewInit, Directive, ElementRef, Input, Optional} from '@angular/core';
import {AbstractControl, FormArray, FormControl, NgControl} from '@angular/forms';

@Directive({
  selector: '[isRequired]',
  standalone: true
})
export class IsRequiredDirective implements AfterViewInit {

  @Input()
  public isRequiredEnabled = true;

  @Input()
  public labelForId: string | undefined;

  @Input()
  public formArray: FormArray | null = null;

  constructor(
    @Optional()
    private readonly ngControl: NgControl,
    private readonly elementRef: ElementRef<HTMLElement>
  ) {
  }

  public ngAfterViewInit(): void {

    if (this.isRequiredEnabled && (this.ngControl || this.formArray)) {

      if (this.formArray?.controls) {

        const validatorsCheck = !this.formArray.controls?.some((item: AbstractControl) => {
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

		if (this.labelForId) {
			this.setLabelForId(this.labelForId);
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
