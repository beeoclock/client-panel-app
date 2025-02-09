import {AbstractControl, FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {WeekDaysEnum, WORK_WEEK} from "@utility/domain/enum";
import {ISchedule, RISchedule} from "@utility/domain/interface/i.schedule";
import {extractSecondsFrom_hh_mm_ss} from "@utility/domain/time";
import {ShouldBeMoreThenValidation} from "@utility/presentation/form/validation/should-be-more-then.validation";
import {is} from "@utility/checker";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";

export interface IScheduleForm {
	workDays: FormControl<WeekDaysEnum[]>;
	startInSeconds: FormControl<number>;
	endInSeconds: FormControl<number>;

	[key: string]: AbstractControl;
}

export class ScheduleForm extends FormGroup<IScheduleForm> {

	private readonly destroy$ = new Subject<void>();

	constructor(initialValue?: ISchedule) {
		super({
			workDays: new FormControl(WORK_WEEK, {
				nonNullable: true,
			}),
			startInSeconds: new FormControl(extractSecondsFrom_hh_mm_ss('08:00'), {
				nonNullable: true,
			}),
			endInSeconds: new FormControl(extractSecondsFrom_hh_mm_ss('18:00'), {
				nonNullable: true,
			}),
		});
		this.initValue(initialValue);
		this.initValidations();
		this.initHandlers();
	}

	public initValue(initialValue?: ISchedule): void {
		if (initialValue) {
			Object.keys(initialValue).forEach(key => {
				if (this.contains(key)) {
					this.controls[key].setValue((initialValue as never)[key]);
				}
			});
		}
	}

	private initValidations(): void {
		this.controls.workDays.setValidators([Validators.required, Validators.minLength(1)]);
		this.controls.endInSeconds.setValidators([ShouldBeMoreThenValidation(this, 'startInSeconds')]);
	}

	private initHandlers(): void {
		this.initStartInSecondsHandler();
	}

	private initStartInSecondsHandler(): void {
		this.controls.startInSeconds.valueChanges.pipe(
			takeUntil(this.destroy$)
		).subscribe(() => {
			this.controls.endInSeconds.updateValueAndValidity();
		})
	}

	public destroyHandlers(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}

export class SchedulesForm extends FormArray<ScheduleForm> {
	constructor() {
		super([
			new ScheduleForm({
				workDays: WORK_WEEK,
			})
		]);
	}

	public pushNewOne(initialValue?: RISchedule): void {
		const control = new ScheduleForm();
		if (initialValue) {
			const {workDays, startInSeconds, endInSeconds} = initialValue;
			workDays && control.controls.workDays.setValue(workDays);
			is.number(startInSeconds) && control.controls.startInSeconds.setValue(startInSeconds);
			is.number(endInSeconds) && control.controls.endInSeconds.setValue(endInSeconds);
		}
		this.push(control);
	}

}
