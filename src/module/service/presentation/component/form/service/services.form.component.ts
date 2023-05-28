import {LanguageVersionsForm} from '@service/form/service.form';
import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {ServiceFormComponent} from '@service/presentation/component/form/service/service.form.component';
import {LANGUAGES} from '@utility/domain/enum';
import {ScheduleFormComponent} from "@service/presentation/component/form/schedule/schedule.form.component";
import {BodyCardComponent} from "@utility/presentation/component/card/body.card.component";
import {HeaderCardComponent} from "@utility/presentation/component/card/header.card.component";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {FooterCardComponent} from "@utility/presentation/component/card/footer.card.component";

@Component({
  selector: 'service-services-form-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    NgForOf,
    ScheduleFormComponent,
    ServiceFormComponent,
    NgIf,
    BodyCardComponent,
    HeaderCardComponent,
    CardComponent,
    FooterCardComponent
  ],
  template: `

    <div class="bg-white dark:bg-beecolor-800 dark:border dark:border-beecolor-700 shadow rounded-lg p-4 mt-4">

      <div
        *ngFor="let languageVersionForm of form.controls; let index = index"
        class="border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
        <div
          class="
          justify-between
          flex
          w-full
          px-4
          py-2
          bg-beecolor-100
          border-b
          border-gray-200
          rounded-t-lg
          cursor-pointer
          dark:bg-gray-800
          dark:border-gray-600">
          Language version #{{ index + 1 }}
          <button class="text-red-500" (click)="form.remove(index)" *ngIf="index > 0">
            <i class="bi bi-trash"></i>
          </button>
        </div>
        <div class="p-4">
          <service-service-form-component
            [form]="languageVersionForm">
          </service-service-form-component>
        </div>
      </div>

      <hr *ngIf="showAddMore" class="my-4">

      <button class="border rounded px-4 py-2" *ngIf="showAddMore" (click)="pushNewLanguageVersionForm($event)">
        <i class="bi bi-plus-lg me-2"></i>
        Add new language version
      </button>
    </div>
  `
})
export class ServicesFormComponent {

  @Input()
  public form = new LanguageVersionsForm();

  @Output()
  public readonly handlePushNewLanguageVersionForm: EventEmitter<Event> = new EventEmitter();

  public pushNewLanguageVersionForm($event: Event): void {
    this.handlePushNewLanguageVersionForm.emit($event);
  }

  public get showAddMore(): boolean {
    return this.form.length !== LANGUAGES.length;
  }

}
