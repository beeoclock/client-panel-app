import {AfterViewInit, Component, inject, Input} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {NgSelectModule} from "@ng-select/ng-select";
import {InputErrorComponent} from "@utility/presentation/component/input-error/input-error.component";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {ServiceRepository} from "@service/repository/service.repository";
import {EmployeeRepository} from "@employee/repository/employee.repository";
import {IEmployee} from "@employee/domain";

@Component({
  selector: 'service-employees-form-component',
  standalone: true,
  imports: [
    NgForOf,
    NgSelectModule,
    InputErrorComponent,
    ReactiveFormsModule,
    NgIf
  ],
  providers: [
    ServiceRepository
  ],
  template: `
    <div class="col-12 position-relative" *ngIf="control">
      <label for="service-form-employees">Employees</label>
      <ng-select
        id="service-form-employees"
        class="cursor-pointer"
        placeholder="Select employees"
        (scrollToEnd)="scrollToEnd($event)"
        [closeOnSelect]="false"
        [loading]="control.pending"
        [disabled]="control.pending"
        [multiple]="multiple"
        [formControl]="control">
        <ng-option *ngFor="let item of items" [value]="item">
          {{item.employee.firstName}} {{item.employee.lastName}}
        </ng-option>
      </ng-select>
      <utility-input-error-component [control]="control"></utility-input-error-component>
    </div>
  `
})
export class EmployeesFormComponent implements AfterViewInit {

  @Input()
  public control!: FormControl;

  @Input()
  public multiple = true;

  public readonly employeeRepository = inject(EmployeeRepository);

  public items: { employee: IEmployee }[] = [];

  public ngAfterViewInit(): void {
    this.control.markAsPending();
    this.employeeRepository
      .list(10, 1, 'createdAt', 'asc', {})
      .then((result) => {
        this.items = result.data.items.map((employee) => ({employee: employee}));
        this.control.updateValueAndValidity();
      });

  }

  scrollToEnd($event: any) {
    console.log($event);

  }
}
