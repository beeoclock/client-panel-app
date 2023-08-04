import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit, ViewChild} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {NgSelectComponent, NgSelectModule} from "@ng-select/ng-select";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {BodyCardComponent} from "@utility/presentation/component/card/body.card.component";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {HeaderCardComponent} from "@utility/presentation/component/card/header.card.component";
import {FooterCardComponent} from "@utility/presentation/component/card/footer.card.component";
import {
  ModalMembersFormComponent
} from "@service/presentation/component/form/v1/members/modal.employees.form.component";
import {EventListCustomerAdapter} from "@customer/adapter/external/module/event.list.customer.adapter";
import {ICustomer} from "@customer/domain";
import {initials} from "@utility/domain/initials";
import {TranslateModule} from "@ngx-translate/core";
import {CustomerForm} from "@customer/form";

@Component({
  selector: 'event-customer-attendant-component',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgForOf,
    NgSelectModule,
    ReactiveFormsModule,
    NgIf,
    BodyCardComponent,
    CardComponent,
    HeaderCardComponent,
    FooterCardComponent,
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
      (scrollToEnd)="scrollToEnd($event)"
      [closeOnSelect]="true"
      [clearable]="false"
      [hideSelected]="true"
      [loading]="listCustomerAdapter.loading$.isOn"
      [disabled]="control.disabled"
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
            <span class="text-sm text-gray-500">
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
          <span class="text-sm text-gray-500">
            {{ localControl.value.email }}
          </span>
        </div>
        <div class="col-span-1 flex flex-col justify-center">
          <button (click)="changeValue()" class="text-gray-600 hover:bg-gray-100 px-2 py-1 rounded-2xl">
            <i class="bi bi-pencil"></i>
          </button>
        </div>
      </div>

    </ng-container>

  `
})
export class CustomerAttendantComponent implements OnInit {

  @Input()
  public control = new CustomerForm();

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

      this.localControl.patchValue(this.control.value as ICustomer);

    });

    this.localControl.valueChanges.subscribe((value) => {
      if (value) {
        this.control.patchValue(value);
      }
    });

  }

  public scrollToEnd($event: any) {
    console.log($event);
  }

  public getInitials(item: ICustomer): string {
    return initials(item.firstName ?? '', item.lastName ?? '');
  }

  public changeValue() {
    this.localControl.setValue(null);
    this.customerSelectComponent.open();
  }
}