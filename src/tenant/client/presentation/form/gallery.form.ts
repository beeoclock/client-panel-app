import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";
import {ImageSizeByFileValidation} from "@tenant/client/presentation/form/validation/imageSizeByBase64Validation";

// Define the structure of the gallery form interface
export interface IGalleryForm {
	object: FormControl<'Gallery'>;
	images: FormArray<FormControl<File>>;
}

export const GALLERY_IMAGES_LIMIT = 6;

// Create the GalleryForm class which extends FormGroup
export class GalleryForm extends FormGroup<IGalleryForm> {
	private readonly takeUntilLastImage$ = new Subject<void>();

	constructor() {
		super({
			object: new FormControl('Gallery', {
				nonNullable: true,
			}),
			images: new FormArray([GalleryForm.getNewControlWithValidation()]),
		});

		// Initialize default values and handlers
		this.initHandlerForLastImage();
	}

	public get limitExceeded(): boolean {
		return this.controls.images.length >= GALLERY_IMAGES_LIMIT;
	}

	public get limitNotExceeded(): boolean {
		return !this.limitExceeded;
	}

	public override getRawValue() {
		const data = super.getRawValue();
		return {
			object: data.object,
			images: data.images.filter((image: File) => (image?.size ?? 0) > 0),
		};
	}

	// Initialize the handler for the last image control
	private initHandlerForLastImage(): void {
		// Emit a signal to unsubscribe from previous subscriptions
		this.takeUntilLastImage$.next();

		if (this.limitNotExceeded) {

			// Get the index and control of the last image
			const lastImageControl = this.controls.images.controls.at(-1);

			// Subscribe to changes in the last image control
			lastImageControl?.valueChanges.pipe(takeUntil(this.takeUntilLastImage$)).subscribe((value: File) => {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				if (value?.size || value?.length) {
					// If the value is not empty, add a new image control to the form array
					this.controls.images.push(GalleryForm.getNewControlWithValidation());

					// Initialize the handler for the newly added image control
					this.initHandlerForLastImage();
				}
			});

		} else {

			this.controls.images.statusChanges.pipe(takeUntil(this.takeUntilLastImage$)).subscribe(() => {

				if (this.limitNotExceeded) {
					// If the value is less than the limit, add a new image control to the form array
					this.controls.images.push(GalleryForm.getNewControlWithValidation());

					// Initialize the handler for the newly added image control
					this.initHandlerForLastImage();
				}

			});

		}

	}

	public removeImage(index: number): void {

		this.controls.images.removeAt(index);

	}

	public pushImage(initialValue?: File): FormControl<File> {

		const lastImageControl = this.controls.images.controls.at(-1);

		if (!this.controls.images.length || lastImageControl?.value?.size) {
			this.controls.images.push(GalleryForm.getNewControlWithValidation());
			if (initialValue) this.controls.images.at(-1).patchValue(initialValue);
			this.controls.images.push(GalleryForm.getNewControlWithValidation());
		} else {
			if (initialValue) this.controls.images.at(-1).patchValue(initialValue);
		}

		this.initHandlerForLastImage();

		return this.controls.images.at(-1);

	}

	public static getNewControlWithValidation(): FormControl<File> {
		const control = new FormControl();
		control.setValidators([ImageSizeByFileValidation()]);
		return control;
	}

}
