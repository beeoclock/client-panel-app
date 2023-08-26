import {AbstractControl, FormArray, FormControl, FormGroup} from "@angular/forms";
import {WeekDaysEnum, WORK_WEEK} from "@utility/domain/enum";
import {ISchedule} from "@utility/domain/interface/i.schedule";

export interface IScheduleForm {
  workDays: FormControl<WeekDaysEnum[]>;
  startTime: FormControl<string>;
  endTime: FormControl<string>;

  [key: string]: AbstractControl<any, any>;
}

export class ScheduleForm extends FormGroup<IScheduleForm> {
  constructor(initialValue?: ISchedule) {
    super({
      workDays: new FormControl(),
      startTime: new FormControl(),
      endTime: new FormControl(),
    });
    this.initValue(initialValue);
  }

  public initValue(initialValue?: ISchedule): void {
    this.controls.startTime.setValue('08:00');
    this.controls.endTime.setValue('18:00');
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

  public remove(index: number): void {
    this.controls.splice(index, 1);
  }

  public pushNewOne(initialValue?: ISchedule): void {
    const control = new ScheduleForm();
    if (initialValue) {
      const {workDays, startTime, endTime} = initialValue;
      control.setValue({
        workDays,
        startTime,
        endTime,
      });
    }
    this.controls.push(control);
  }

}
