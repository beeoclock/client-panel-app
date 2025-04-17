import {FormControl, FormGroup} from "@angular/forms";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";


export interface IPaginationFilterForm {
	page: FormControl<number>;
	pageSize: FormControl<number>;
	orderBy: FormControl<string>;
	orderDir: FormControl<OrderDirEnum>;
}

type DEFAULT_OMIT = 'page' | 'pageSize' | 'orderBy' | 'orderDir';
type EXTERNAL_FORM_WITHOUT_LOCAL_CONTROLS<FORM_INTERFACE> = {
	[K in keyof Omit<FORM_INTERFACE, DEFAULT_OMIT>]: Omit<FORM_INTERFACE, DEFAULT_OMIT>[K];
};

export class PaginationFilterFromGroup<FORM_INTERFACE extends EXTERNAL_FORM_WITHOUT_LOCAL_CONTROLS<FORM_INTERFACE>> extends FormGroup<EXTERNAL_FORM_WITHOUT_LOCAL_CONTROLS<FORM_INTERFACE> & IPaginationFilterForm> {
	constructor(
		controls: EXTERNAL_FORM_WITHOUT_LOCAL_CONTROLS<FORM_INTERFACE>,
	) {
		super({
			page: new FormControl<number>(0, {
				nonNullable: true
			}),
			pageSize: new FormControl<number>(0, {
				nonNullable: true
			}),
			orderBy: new FormControl<string>(OrderByEnum.CREATED_AT, {
				nonNullable: true
			}),
			orderDir: new FormControl<OrderDirEnum>(OrderDirEnum.DESC, {
				nonNullable: true
			}),

			...controls
		});
	}
}
