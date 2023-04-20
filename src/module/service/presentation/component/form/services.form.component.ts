import {FormArray} from '@angular/forms';
import {LanguageVersionForm} from '@service/form/service.form';
import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {NgForOf} from '@angular/common';
import {ScheduleFormComponent} from '@service/presentation/component/form/schedule.form.component';
import {ServiceFormComponent} from '@service/presentation/component/form/service.form.component';

@Component({
  selector: 'service-services-form-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    NgForOf,
    ScheduleFormComponent,
    ServiceFormComponent
  ],
  template: `
    <strong>
      When are you available for the service:
    </strong>
    <service-service-form-component
      *ngFor="let languageVersionForm of languageVersionsForm.controls"
      [languageVersionForm]="languageVersionForm">
    </service-service-form-component>
    <hr>
    <button class="btn btn-primary" (click)="pushNewLanguageVersionForm($event)">Add new language version</button>
  `
})
export class ServicesFormComponent {

  @Input()
  public languageVersionsForm: FormArray<LanguageVersionForm> = new FormArray([new LanguageVersionForm()]);

  @Output()
  public readonly handlePushNewLanguageVersionForm: EventEmitter<Event> = new EventEmitter();

  public pushNewLanguageVersionForm($event: Event): void {
    this.handlePushNewLanguageVersionForm.emit($event);
  }

}
