import {LanguageVersionsForm} from '@service/form/service.form';
import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {ScheduleFormComponent} from '@service/presentation/component/form/schedule.form.component';
import {ServiceFormComponent} from '@service/presentation/component/form/service/service.form.component';
import {LANGUAGES} from '@utility/domain/enum';

@Component({
  selector: 'service-services-form-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    NgForOf,
    ScheduleFormComponent,
    ServiceFormComponent,
    NgIf
  ],
  template: `
    <strong>
      When are you available for the service:
    </strong>
    <service-service-form-component
      *ngFor="let languageVersionForm of form.controls"
      [form]="languageVersionForm">
    </service-service-form-component>
    <hr>
    <button class="btn btn-primary" *ngIf="showAddMore" (click)="pushNewLanguageVersionForm($event)">Add new language
      version
    </button>
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
