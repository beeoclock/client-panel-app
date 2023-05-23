import {AfterViewInit, Component, inject, Input} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {NgSelectModule} from "@ng-select/ng-select";
import {InputErrorComponent} from "@utility/presentation/component/input-error/input-error.component";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {ServiceRepository} from "@service/repository/service.repository";
import {EmployeeRepository} from "@employee/repository/employee.repository";
import {IEmployee} from "@employee/domain";
import {BodyCardComponent} from "@utility/presentation/component/card/body.card.component";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {HeaderCardComponent} from "@utility/presentation/component/card/header.card.component";
import {FooterCardComponent} from "@utility/presentation/component/card/footer.card.component";

@Component({
  selector: 'service-employees-form-component',
  standalone: true,
  imports: [
    NgForOf,
    NgSelectModule,
    InputErrorComponent,
    ReactiveFormsModule,
    NgIf,
    BodyCardComponent,
    CardComponent,
    HeaderCardComponent,
    FooterCardComponent
  ],
  providers: [
    ServiceRepository
  ],
  template: `
    <utility-card-component class="mt-3">
      <utility-header-card-component class="border-bottom">
        Employees that can do the service
      </utility-header-card-component>
      <utility-body-card-component>
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
      </utility-body-card-component>
    </utility-card-component>
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
