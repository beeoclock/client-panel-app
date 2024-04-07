import {AbstractControl, FormControl, FormGroup} from "@angular/forms";
import {DateTime} from "luxon";
import ObjectID from "bson-objectid";

export const enum BaseEntityFormFieldsEnum {
	_id = '_id',
	object = 'object',
	createdAt = 'createdAt',
	updatedAt = 'updatedAt',
}


export interface IBaseEntityForm {
	[BaseEntityFormFieldsEnum.object]: FormControl<'Customer'>;
	[BaseEntityFormFieldsEnum.createdAt]: FormControl<string>;
	[BaseEntityFormFieldsEnum.updatedAt]: FormControl<string>;
	[BaseEntityFormFieldsEnum._id]: FormControl<string>;
}

export class BaseEntityForm<T extends {[K in keyof T]: AbstractControl}> extends FormGroup<T & IBaseEntityForm> {
	constructor(
		controls: T
	) {
		super({
			[BaseEntityFormFieldsEnum.object]: new FormControl('Customer', {
				nonNullable: true,
			}),
			[BaseEntityFormFieldsEnum.createdAt]: new FormControl(DateTime.now().toUTC().toISO(), {
				nonNullable: true,
			}),
			[BaseEntityFormFieldsEnum.updatedAt]: new FormControl(DateTime.now().toUTC().toISO(), {
				nonNullable: true,
			}),
			[BaseEntityFormFieldsEnum._id]: new FormControl(ObjectID().toHexString(), {
				nonNullable: true,
			}),
			...controls
		});
	}
}
