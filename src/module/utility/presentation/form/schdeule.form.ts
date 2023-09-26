import {AbstractControl, FormArray, FormControl, FormGroup} from "@angular/forms";
import {WeekDaysEnum, WORK_WEEK} from "@utility/domain/enum";
import {ISchedule, RISchedule} from "@utility/domain/interface/i.schedule";
import {extractSecondsFrom_hh_mm_ss} from "@utility/domain/time";

export interface IScheduleForm {
  workDays: FormControl<WeekDaysEnum[]>;
  startInSeconds: FormControl<number>;
  endInSeconds: FormControl<number>;

  [key: string]: AbstractControl<any, any>;
}

export class ScheduleForm extends FormGroup<IScheduleForm> {
  constructor(initialValue?: ISchedule) {
    super({
      workDays: new FormControl(),
      startInSeconds: new FormControl(),
      endInSeconds: new FormControl(),
    });
    this.initValue(initialValue);
  }

  public initValue(initialValue?: ISchedule): void {
    this.controls.startInSeconds.setValue(extractSecondsFrom_hh_mm_ss('08:00', true));
    this.controls.endInSeconds.setValue(extractSecondsFrom_hh_mm_ss('18:00', true));
    if (initialValue) {
      Object.keys(initialValue).forEach(key => {
        if (this.contains(key)) {
          this.controls[key].setValue((initialValue as any)[key]);
        }
      });
    }
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
			startInSeconds && control.controls.startInSeconds.setValue(startInSeconds);
			endInSeconds && control.controls.endInSeconds.setValue(endInSeconds);
    }
    this.push(control);
  }

}
