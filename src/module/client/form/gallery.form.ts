import {AbstractControl, FormArray, FormControl, FormGroup} from "@angular/forms";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";

// Define the structure of the gallery form interface
export interface IGalleryForm {
  object: FormControl<'Gallery'>;
  images: FormArray<FormControl<string>>;

  [key: string]: AbstractControl<any, any>;
}

export const GALLERY_IMAGES_LIMIT = 6;

// Create the GalleryForm class which extends FormGroup
export class GalleryForm extends FormGroup<IGalleryForm> {
  private readonly takeUntilLastImage$ = new Subject<void>();

  constructor() {
    super({
      object: new FormControl(),
      images: new FormArray([new FormControl()]),
    });

    // Initialize default values and handlers
    this.initValue();
    this.initHandlerForLastImage();
  }

  public get limitExceeded(): boolean {
    return this.controls.images.length >= GALLERY_IMAGES_LIMIT;
  }

  public get limitNotExceeded(): boolean {
    return !this.limitExceeded;
  }

  // Set initial value for the 'object' control
  private initValue(): void {
    this.controls.object.setValue('Gallery');
  }

  // Initialize the handler for the last image control
  private initHandlerForLastImage(): void {
    // Emit a signal to unsubscribe from previous subscriptions
    this.takeUntilLastImage$.next();

    if (this.limitNotExceeded) {

      // Get the index and control of the last image
      const lastImageIndex = this.controls.images.length - 1;
      const lastImageControl = this.controls.images.controls[lastImageIndex];

      // Subscribe to changes in the last image control
      lastImageControl.valueChanges.pipe(takeUntil(this.takeUntilLastImage$)).subscribe((value) => {

        console.log('lastImageControl: ', value);

        if (value?.length) {
          // If the value is not empty, add a new image control to the form array
          this.controls.images.push(new FormControl());

          // Initialize the handler for the newly added image control
          this.initHandlerForLastImage();
        }
      });

    } else {

      this.controls.images.statusChanges.pipe(takeUntil(this.takeUntilLastImage$)).subscribe((value) => {

        console.log('images: ', value);

        if (this.limitNotExceeded) {
          // If the value is less than the limit, add a new image control to the form array
          this.controls.images.push(new FormControl());

          // Initialize the handler for the newly added image control
          this.initHandlerForLastImage();
        }

      });

    }

  }

  public removeImage(index: number): void {

    this.controls.images.controls.splice(index, 1);
    this.controls.images.markAsPending();

  }

}