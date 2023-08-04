import {Component, Input} from '@angular/core';
import {AttendantComponent} from '@event/presentation/component/form/attendant/attendant.component';
import {NgForOf, NgIf} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {CustomerAttendantComponent} from "@event/presentation/component/form/attendant/customer.attendant.component";
import {AttendantForm, AttendeesForm} from "@event/form/attendant.form";
import {IsNewCustomerEnum} from "@utility/domain/enum";

@Component({
  selector: 'event-attendees-component',
  standalone: true,
  // changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AttendeesComponent,
    AttendantComponent,
    NgForOf,
    TranslateModule,
    CustomerAttendantComponent,
    NgIf
  ],
  template: `
    <div class="flex flex-col gap-4">

      <div class="flex justify-between">
        <strong class="text-2xl">{{ 'general.clients' | translate }}</strong>
        <button (click)="form.pushNewOne()" class="text-sm text-blue-600 rounded-2xl px-2 py-1 hover:bg-blue-100">
          <i class="bi bi-plus-lg"></i>
          {{ 'event.form.section.attendant.button.add' | translate }}
        </button>
      </div>


      <div class="flex flex-col gap-3" *ngFor="let control of form.controls; let index = index">

        <hr *ngIf="index > 0" class="my-2">

        <div class="flex justify-between">
          <span class="text-gray-400">{{ 'keyword.capitalize.customer' | translate }} #{{ index + 1 }}</span>
          <button [disabled]="form.controls.length === 1" (click)="remove(index)"
                  class="text-gray-600 hover:text-red-600 hover:bg-red-100 px-2 py-1 rounded-2xl">
            <i class="bi bi-trash"></i>
          </button>
        </div>

        <ng-container *ngIf="isNew(control); else selectTemplate">

          <event-attendant-component
            [form]="control.controls.customer">
          </event-attendant-component>

        </ng-container>
        <ng-template #selectTemplate>

          <event-customer-attendant-component
            [control]="control.controls.customer"></event-customer-attendant-component>

          <ng-container *ngIf="control.controls.customer.isEmpty()">
            <button (click)="control.toggleIsNewCustomer()" class="text-blue-600 text-sm">
              {{ 'event.form.section.attendant.button.togglePresentationOfNewAttendant' | translate }}
            </button>
          </ng-container>

        </ng-template>

      </div>

    </div>
  `
})
export class AttendeesComponent {

  @Input()
  public form!: AttendeesForm;

  public remove(index: number): void {
    this.form.remove(index);
  }

  public isNew(control: AttendantForm): boolean {
    return control.controls.isNewCustomer.value === IsNewCustomerEnum.YES && control.controls.customer.controls._id.value === null;
  }

}
