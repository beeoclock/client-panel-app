import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {DurationFormComponent} from '@service/presentation/component/form/v1/duration/duration.form.component';
import {DurationVersionsForm} from '@service/presentation/form/service.form';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'service-durations-form-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    DurationFormComponent,
    NgForOf,
    NgIf
  ],
  template: `
    <div class="bg-white dark:bg-beeDarkColor-800 dark:border dark:border-beeDarkColor-700 shadow rounded-2xl p-4 mt-4">

      <div class="flex flex-col gap-3">
        <div
          *ngFor="let durationVersionForm of durationVersionsForm.controls; let index = index"
          class="border border-beeColor-200 rounded-lg dark:bg-beeDarkColor-700 dark:border-beeDarkColor-600 dark:text-white">
          <div
            class="
          justify-between
          flex
          w-full
          px-4
          py-2
          bg-beeColor-100
          border-b
          border-beeColor-200
          rounded-t-lg
          cursor-pointer
          dark:bg-beeDarkColor-800
          dark:border-beeDarkColor-600">
            Duration version #{{ index + 1 }}
            <button class="text-red-500" (click)="durationVersionsForm.remove(index)" *ngIf="index > 0">
              <i class="bi bi-trash"></i>
            </button>
          </div>
          <div class="p-4">

            <service-duration-form-component
              [form]="durationVersionForm">
            </service-duration-form-component>
          </div>
        </div>
      </div>

      <hr class="my-4">

      <button class="border rounded px-4 py-2" (click)="pushNewDurationVersionFormForm($event)">
        <i class="bi bi-plus-lg me-2"></i>
        Add new duration
      </button>

    </div>

  `
})
export class DurationsFormComponent {

  @Input()
  public durationVersionsForm = new DurationVersionsForm();

  @Output()
  public readonly handlePushNewDurationVersionFormForm: EventEmitter<Event> = new EventEmitter();

  public pushNewDurationVersionFormForm($event: Event): void {
    this.handlePushNewDurationVersionFormForm.emit($event);
  }

}
