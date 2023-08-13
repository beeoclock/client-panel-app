import {AbstractControl, FormArray, FormControl, FormGroup} from "@angular/forms";
import {WeekDaysEnum, WORK_WEEK} from "@utility/domain/enum";

export interface IScheduleForm {
  workDays: FormControl<WeekDaysEnum[]>;
  startTime: FormControl<string>;
  endTime: FormControl<string>;

  [key: string]: AbstractControl<any, any>;
}

export class ScheduleForm extends FormGroup<IScheduleForm> {
  constructor() {
    super({
      workDays: new FormControl(),
      startTime: new FormControl(),
      endTime: new FormControl(),
    });
    this.initValue();
  }

  public initValue(): void {
    this.controls.workDays.setValue(WORK_WEEK);
    this.controls.startTime.setValue('08:00');
    this.controls.endTime.setValue('18:00');
  }
}

export class SchedulesForm extends FormArray<ScheduleForm> {
  constructor() {
    super([]);
  }

  public remove(index: number): void {
    this.controls.splice(index, 1);
  }

}
