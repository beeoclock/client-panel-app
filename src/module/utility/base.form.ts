import {AbstractControl, FormControl, FormGroup} from "@angular/forms";
import {DateTime} from "luxon";
import ObjectID from "bson-objectid";

export const enum BaseEntityFormFieldsEnum {
	_id = '_id',
	object = 'object',
	createdAt = 'createdAt',
	updatedAt = 'updatedAt',
}


export interface IBaseEntityForm<OBJECT_NAME> {
	[BaseEntityFormFieldsEnum.object]: FormControl<OBJECT_NAME>;
	[BaseEntityFormFieldsEnum.createdAt]: FormControl<string>;
	[BaseEntityFormFieldsEnum.updatedAt]: FormControl<string>;
	[BaseEntityFormFieldsEnum._id]: FormControl<string>;
}

export class BaseEntityForm<OBJECT_NAME, T extends {[K in keyof T]: AbstractControl}> extends FormGroup<T & IBaseEntityForm<OBJECT_NAME>> {
	constructor(
		objectName: OBJECT_NAME,
		controls: T
	) {
		super({
			[BaseEntityFormFieldsEnum.object]: new FormControl(objectName, {
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
