import {FormControl, FormGroup} from "@angular/forms";
import {DateTime} from "luxon";
import ObjectID from "bson-objectid";
import {StateEnum} from "@core/shared/enum/state.enum";
import {Types} from "@core/shared/types";


export interface IBaseEntityForm<OBJECT_NAME> {
	object: FormControl<OBJECT_NAME>;
	createdAt: FormControl<string>;
	updatedAt: FormControl<string>;
	_id: FormControl<string>;

	state: FormControl<StateEnum>;
	stateHistory: FormControl<{
		state: StateEnum;
		setAt: string & Types.DateTime;
	}[]>;
}

type DEFAULT_OMIT = 'object' | '_id' | 'createdAt' | 'updatedAt' | 'state' | 'stateHistory';
type EXTERNAL_FORM_WITHOUT_LOCAL_CONTROLS<FORM_INTERFACE> = {
	[K in keyof Omit<FORM_INTERFACE, DEFAULT_OMIT>]: Omit<FORM_INTERFACE, DEFAULT_OMIT>[K];
};

export class BaseEntityForm<OBJECT_NAME, FORM_INTERFACE extends EXTERNAL_FORM_WITHOUT_LOCAL_CONTROLS<FORM_INTERFACE>> extends FormGroup<EXTERNAL_FORM_WITHOUT_LOCAL_CONTROLS<FORM_INTERFACE> & IBaseEntityForm<OBJECT_NAME>> {
	constructor(
		objectName: OBJECT_NAME,
		controls: EXTERNAL_FORM_WITHOUT_LOCAL_CONTROLS<FORM_INTERFACE>,
	) {
		super({
			object: new FormControl(objectName, {
				nonNullable: true,
			}),
			createdAt: new FormControl(DateTime.now().toUTC().toISO(), {
				nonNullable: true,
			}),
			updatedAt: new FormControl(DateTime.now().toUTC().toISO(), {
				nonNullable: true,
			}),
			_id: new FormControl(ObjectID().toHexString(), {
				nonNullable: true,
			}),

			state: new FormControl(StateEnum.active, {
				nonNullable: true,
			}),

			stateHistory: new FormControl([], {
				nonNullable: true,
			}),
			...controls
		});
	}
}
