import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit, ViewChild} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {NgSelectComponent, NgSelectModule} from "@ng-select/ng-select";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {
	ModalMembersFormComponent
} from "@service/presentation/component/form/v1/members/modal.employees.form.component";
import {EventListCustomerAdapter} from "@customer/adapter/external/module/event.list.customer.adapter";
import {ICustomer} from "@customer/domain";
import {initials} from "@utility/domain/initials";
import {TranslateModule} from "@ngx-translate/core";
import {CustomerForm} from "@customer/presentation/form";

@Component({
  selector: 'event-customer-attendant-component',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgForOf,
    NgSelectModule,
    ReactiveFormsModule,
    NgIf,
    ModalMembersFormComponent,
    TranslateModule
  ],
  template: `

    <ng-select
      #customerSelectComponent
      [class.invisible]="localControl.value"
      [class.h-1]="localControl.value"
      class="cursor-pointer"
      [placeholder]="'event.form.section.attendant.input.selectCustomer.placeholder' | translate"
      [closeOnSelect]="true"
      [clearable]="false"
      [hideSelected]="true"
      [loading]="listCustomerAdapter.loading$.isOn"
      [disabled]="customerForm.disabled"
      [formControl]="localControl">
      <ng-template ng-label-tmp let-item="item" let-clear="clear">
        <span class="text-beeColor-400">
          {{ 'event.form.section.attendant.input.selectCustomer.placeholder' | translate }}
        </span>
      </ng-template>
      <ng-option *ngFor="let item of listCustomerAdapter.tableState.items" [value]="item">

        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-2 pt-1">
            <div
              class="bg-beeColor-300 flex h-[70px] items-center justify-center rounded-2xl text-3xl text-beeColor-500 w-[70px]">
              {{ getInitials(item) }}
            </div>
          </div>
          <div class="col-span-8 flex flex-col">
            <span class="font-bold">
              {{ item.firstName }} {{ item.lastName }}
            </span>
            <span class="text-sm text-beeColor-500">
            {{ item.email }}
          </span>
          </div>
        </div>

      </ng-option>
    </ng-select>

    <ng-container *ngIf="localControl.value">

      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-2 pt-1">
          <div
            class="bg-beeColor-300 flex h-[70px] items-center justify-center rounded-2xl text-3xl text-beeColor-500 w-[70px]">
            {{ getInitials(localControl.value) }}
          </div>
        </div>
        <div class="col-span-9 flex flex-col">
            <span class="font-bold">
              {{ localControl.value.firstName }} {{ localControl.value.lastName }}
            </span>
          <span class="text-sm text-beeColor-500">
            {{ localControl.value.email }}
          </span>
        </div>
        <div class="col-span-1 flex flex-col justify-center">
          <button type="button" (click)="changeValue()" class="text-beeColor-600 hover:bg-beeColor-100 px-2 py-1 rounded-2xl">
            <i class="bi bi-pencil"></i>
          </button>
        </div>
      </div>

    </ng-container>

  `
})
export class CustomerAttendantComponent implements OnInit {

  @Input()
  public customerForm!: CustomerForm;

  @ViewChild('customerSelectComponent')
  public customerSelectComponent!: NgSelectComponent

  public localControl: FormControl<ICustomer | null | undefined> = new FormControl();

  public readonly listCustomerAdapter = inject(EventListCustomerAdapter);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  private async initTableState() {
    if (this.listCustomerAdapter.tableState.total === 0) {

      this.listCustomerAdapter.resetTableState();
      await this.listCustomerAdapter.getPageAsync();
      this.changeDetectorRef.detectChanges();

    }
  }

  public ngOnInit(): void {

    this.initTableState().then(() => {

      if (this.customerForm.isNotEmpty()) {

        this.localControl.patchValue(this.customerForm.value as ICustomer);

      }

    });

    this.localControl.valueChanges.subscribe((value) => {
      if (value) {
        this.customerForm.patchValue(value);
      }
    });

  }

  public getInitials({firstName, lastName}: ICustomer): string {
    return initials(firstName ?? '', lastName ?? '');
  }

  public changeValue() {
    this.localControl.setValue(null);
    this.customerSelectComponent.open();
  }
}
