import {AbstractControl, ValidationErrors} from "@angular/forms";

export function ImageSizeByBase64Validation() {

	return (control: AbstractControl): ValidationErrors | null => {

		const base64Image = control.value;

		// const MAX_IMAGE_SIZE_KB = 5_120; // 5MB
		const MAX_IMAGE_SIZE_MB = 1; // 1MB
		const MAX_IMAGE_SIZE_KB = MAX_IMAGE_SIZE_MB * 1_024; // 1MB
		const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_KB * 1024;
		const BASE64_FACTOR = 1.37;

		if (base64Image) {

			const approximateSize = base64Image.length / BASE64_FACTOR;

			if (approximateSize > MAX_IMAGE_SIZE_BYTES) {

				return {
					imageSize: {
						value: `${(approximateSize / 1024 / 1024).toFixed(2)}MB`,
						max: `${MAX_IMAGE_SIZE_MB}MB`,
					}
				};

			}

		}

		return null

	};

}

export function ImageSizeByFileValidation() {

	return (control: AbstractControl): ValidationErrors | null => {

		const file: File = control.value;

		const MAX_IMAGE_SIZE_MB = 1; // 1MB
		const MAX_IMAGE_SIZE_KB = MAX_IMAGE_SIZE_MB * 1_024; // 1MB
		const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_KB * 1024;

		if (file) {

			const approximateSize = file.size;

			if (approximateSize > MAX_IMAGE_SIZE_BYTES) {

				return {
					imageSize: {
						value: `${(approximateSize / 1024 / 1024).toFixed(2)}MB`,
						max: `${MAX_IMAGE_SIZE_MB}MB`,
					}
				};

			}

		}

		return null

	};
}
