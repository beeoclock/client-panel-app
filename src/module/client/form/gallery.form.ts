import {AbstractControl, FormArray, FormControl, FormGroup} from "@angular/forms";

export interface IGalleryForm {

  object: FormControl<'Gallery'>;
  images: FormArray<FormControl<string>>;

  [key: string]: AbstractControl<any, any>;
}

export class GalleryForm extends FormGroup<IGalleryForm> {

  constructor() {
    super({
      object: new FormControl(),
      images: new FormArray([new FormControl()]),
    });

    this.initValue();

  }

  private initValue(): void {
    this.controls.object.setValue('Gallery');
  }

}
