import {Component, Input} from "@angular/core";
import {NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {ServicesFormComponent} from "@service/presentation/component/form/service/services.form.component";
import {DurationsFormComponent} from "@service/presentation/component/form/duration/durations.form.component";
import {SchedulesFormComponent} from "@service/presentation/component/form/schedule/schedules.form.component";
import {EmployeesFormComponent} from "@service/presentation/component/form/employees/employees.form.component";
import {ServiceForm} from "@service/form/service.form";

@Component({
  selector: 'service-form-step-wrapper-component',
  standalone: true,
  imports: [
    NgSwitch,
    NgSwitchCase,
    ServicesFormComponent,
    DurationsFormComponent,
    SchedulesFormComponent,
    EmployeesFormComponent,
    NgIf
  ],
  template: `

    <ng-container *ngIf="isActive" [ngSwitch]="section">

      <service-services-form-component
        *ngSwitchCase="'services'"
        (handlePushNewLanguageVersionForm)="form.pushNewLanguageVersionForm()"
        [form]="form.controls.languageVersions">
      </service-services-form-component>

      <service-durations-form-component
        *ngSwitchCase="'durations'"
        (handlePushNewDurationVersionFormForm)="form.pushNewDurationVersionForm()"
        [durationVersionsForm]="form.controls.durationVersions">
      </service-durations-form-component>

      <service-schedules-form-component
        *ngSwitchCase="'schedules'"
        (handlePushNewScheduleForm)="form.pushNewScheduleForm()"
        [schedulesForm]="form.controls.schedules">
      </service-schedules-form-component>

      <service-employees-form-component
        *ngSwitchCase="'employees'"
        [control]="form.controls.permanentEmployees">
      </service-employees-form-component>

    </ng-container>

  `
})
export class StepWrapperComponent {

  @Input()
  public section: 'services' | 'durations' | 'schedules' | 'employees' = 'services';

  @Input()
  public form!: ServiceForm;

  @Input()
  public isActive: boolean = false;

  public get information(): {
    title: string;
    description: string;
  } {
    return {
      services: {
        title: 'Languages',
        description: 'Set language versions of service'
      },
      durations: {
        title: 'Durations',
        description: 'Set duration versions of service'
      },
      schedules: {
        title: 'Schedules',
        description: 'Set schedule versions of service'
      },
      employees: {
        title: 'Employees',
        description: 'Set permanent employees of service'
      },
    }[this.section];
  }

}
