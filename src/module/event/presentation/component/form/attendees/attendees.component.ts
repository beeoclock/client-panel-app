import {Component, Input} from '@angular/core';
import {AttendantComponent} from '@event/presentation/component/form/attendant/attendant.component';
import {NgForOf} from '@angular/common';
import {AttendeesForm} from '@event/form/event.form';
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'event-attendees-component',
  standalone: true,
  imports: [
    AttendeesComponent,
    AttendantComponent,
    NgForOf,
    TranslateModule
  ],
  template: `
    <div class="flex flex-col gap-4">

      <strong class="text-2xl">{{ 'general.clients' | translate }}</strong>

      <div *ngFor="let control of form.controls; let index = index">

        <div class="flex justify-between">
          <span class="text-gray-400">Client #{{ index + 1 }}</span>
          <button (click)="form.remove(index)" class="text-gray-600 hover:text-red-600 hover:bg-red-100 px-2 py-1 rounded-2xl">
            <i class="bi bi-trash"></i>
          </button>
        </div>

        <event-attendant-component
          [index]="index"
          [form]="control">
        </event-attendant-component>

        <hr class="mt-4">

      </div>

      <button (click)="form.pushNewAttendant()" class="w-full text-blue-600 rounded px-4 py-2 hover:bg-blue-100">
        <i class="bi bi-plus-lg"></i>
        {{ 'event.form.section.attendant.button.add' | translate }}
      </button>
    </div>
  `
})
export class AttendeesComponent {
  @Input()
  public form!: AttendeesForm;

}
