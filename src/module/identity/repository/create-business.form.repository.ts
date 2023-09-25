import {Injectable} from "@angular/core";
import CreateBusinessForm from "@identity/presentation/form/create-business.form";

@Injectable({
	providedIn: 'root'
})
export class CreateBusinessFormRepository {

	public readonly form = new CreateBusinessForm();
	public readonly formLocalStorageKey = 'create-business-form';

	constructor() {
		this.initHandlers();
	}

	public initValueFromLocalStorage(): void {
		const value = localStorage.getItem(this.formLocalStorageKey);
		if (value) {
			this.form.patchValue(JSON.parse(value));
		}
	}

	public clearLocalStorage(): void {
		localStorage.removeItem(this.formLocalStorageKey);
	}

	private initHandlers(): void {
		this.initFormValueHandler();
	}

	private initFormValueHandler(): void {
		this.form.valueChanges.subscribe((value) => {
			console.log(value);
			localStorage.setItem(this.formLocalStorageKey, JSON.stringify(value));
		});
	}

}
