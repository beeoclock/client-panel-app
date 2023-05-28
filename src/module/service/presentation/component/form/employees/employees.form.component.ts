import {AfterViewInit, Component, inject, Input} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {NgSelectModule} from "@ng-select/ng-select";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {ServiceRepository} from "@service/repository/service.repository";
import {EmployeeRepository} from "@employee/repository/employee.repository";
import {IEmployee} from "@employee/domain";
import {BodyCardComponent} from "@utility/presentation/component/card/body.card.component";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {HeaderCardComponent} from "@utility/presentation/component/card/header.card.component";
import {FooterCardComponent} from "@utility/presentation/component/card/footer.card.component";
import {
  ModalEmployeesFormComponent
} from "@service/presentation/component/form/employees/modal.employees.form.component";

@Component({
  selector: 'service-employees-form-component',
  standalone: true,
  imports: [
    NgForOf,
    NgSelectModule,

    ReactiveFormsModule,
    NgIf,
    BodyCardComponent,
    CardComponent,
    HeaderCardComponent,
    FooterCardComponent,
    ModalEmployeesFormComponent
  ],
  providers: [
    ServiceRepository
  ],
  template: `

    <div class="bg-white dark:bg-neutral-800 dark:border dark:border-neutral-700 shadow rounded-lg p-4 mt-4">
      <!--    <h4>-->
      <!--      Employees that can do the service-->
      <!--    </h4>-->
      <!--    <service-modal-employees-form-component>-->
      <!--    </service-modal-employees-form-component>-->
      <div class="col-12 position-relative" *ngIf="control">
        <label for="service-form-employees">Employees</label>
        <ng-select
          id="service-form-employees"
          class="cursor-pointer"
          placeholder="Select employees"
          bindLabel="_id"
          (scrollToEnd)="scrollToEnd($event)"
          [closeOnSelect]="false"
          [loading]="control.pending"
          [disabled]="control.pending"
          [multiple]="multiple"
          [formControl]="control">
          <ng-template ng-label-tmp let-item="item" let-clear="clear">
            <span>{{item.firstName}} {{item.lastName}}</span>
            <span class="ng-value-icon right" (click)="clear(item)" aria-hidden="true">×</span>
          </ng-template>
          <ng-template ng-header-tmp>

            <div>
              <button class="text-blue-600 mx-2"
                      (click)="onSelectAll()">Select All
              </button>
              <button class="text-blue-600 mx-2"
                      (click)="onClearAll()">Clear All
              </button>
            </div>

          </ng-template>
          <ng-option *ngFor="let item of items" [value]="item">
            {{item.firstName}} {{item.lastName}}
          </ng-option>
        </ng-select>
      </div>
    </div>
  `
})
export class EmployeesFormComponent implements AfterViewInit {

  @Input()
  public control!: FormControl;

  @Input()
  public multiple = true;

  public readonly employeeRepository = inject(EmployeeRepository);

  public items: IEmployee[] = [];

  public ngAfterViewInit(): void {
    this.control.markAsPending();
    this.employeeRepository
      .list(10, 1, 'createdAt', 'asc', {})
      .then((result) => {
        this.items = result.data.items;
        this.control.updateValueAndValidity();
      });

  }

  public onSelectAll() {
    const selected = this.items;
    this.control.patchValue(selected);
  }

  public onClearAll() {
    this.control.patchValue([]);
  }

  scrollToEnd($event: any) {
    console.log($event);

  }
}
