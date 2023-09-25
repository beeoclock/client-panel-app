import {Injectable} from "@angular/core";
import CreateBusinessForm from "@identity/presentation/form/create-business.form";
import {BooleanState} from "@utility/domain";
import {NGXLogger} from "ngx-logger";

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
		this.initHandlers();
		if (this.initializedValueFromStorage.isOff) {
			this.initValueFromLocalStorage();
		}
	}

	public initValueFromLocalStorage(): void {
		this.logger.debug('CreateBusinessFormRepository.initValueFromLocalStorage');
		const value = localStorage.getItem(this.formLocalStorageKey);
		if (value) {
			const parsedValue = JSON.parse(value);
			this.logger.debug('CreateBusinessFormRepository.initValueFromLocalStorage', parsedValue);
			this.form.patchValue(parsedValue);
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
			localStorage.setItem(this.formLocalStorageKey, JSON.stringify(value));
		});
	}

}
