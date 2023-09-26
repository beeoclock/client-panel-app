import {Injectable} from "@angular/core";
import CreateBusinessForm from "@identity/presentation/form/create-business.form";
import {BooleanState} from "@utility/domain";
import {NGXLogger} from "ngx-logger";
import {RISchedule} from "@utility/domain/interface/i.schedule";

@Injectable({
	providedIn: 'root'
})
export class CreateBusinessFormRepository {

	public readonly form = new CreateBusinessForm();
	public readonly formLocalStorageKey = 'create-business-form';
	public readonly initializedValueFromStorage = new BooleanState(false);

	constructor(
		private readonly logger: NGXLogger
	) {
		if (this.initializedValueFromStorage.isOff) {
			this.initValueFromLocalStorage();
		}
		this.initHandlers();
	}

	public initValueFromLocalStorage(): void {
		this.logger.debug('CreateBusinessFormRepository.initValueFromLocalStorage');
		const value = localStorage.getItem(this.formLocalStorageKey);
		if (value) {
			const parsedValue = JSON.parse(value) as { schedules: RISchedule[], gallery: {object: string; images: string[]} };
			this.logger.debug('CreateBusinessFormRepository.initValueFromLocalStorage', parsedValue);
			const {schedules, gallery, ...restOfForm} = parsedValue;
			this.form.patchValue(restOfForm);

			// Schedules
			this.form.controls.schedules.clear();
			schedules.forEach((schedule) => {
				this.form.controls.schedules.pushNewOne(schedule);
			});

			// Gallery
			this.form.controls.gallery.controls.images.clear();
			console.log(gallery);
			gallery.images.forEach((image) => {
				this.form.controls.gallery.pushImage(image);
			});
		}
		this.initializedValueFromStorage.switchOn();
	}

	public clearLocalStorage(): void {
		localStorage.removeItem(this.formLocalStorageKey);
	}

	private initHandlers(): void {
		this.logger.debug('CreateBusinessFormRepository.initHandlers');
		this.initFormValueHandler();
	}

	private initFormValueHandler(): void {
		this.form.valueChanges.subscribe((value) => {
			this.logger.debug('CreateBusinessFormRepository.initFormValueHandler.form.valueChanges', value);
			this.saveToStorage();
		});
	}

	public saveToStorage(): void {
		localStorage.setItem(this.formLocalStorageKey, JSON.stringify(this.form.getRawValue()));
	}

}
