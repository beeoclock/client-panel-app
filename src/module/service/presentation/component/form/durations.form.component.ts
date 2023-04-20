import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {DurationFormComponent} from '@service/presentation/component/form/duration.form.component';
import {DurationVersionForm} from '@service/form/service.form';
import {FormArray} from '@angular/forms';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'service-durations-form-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    DurationFormComponent,
    NgForOf
  ],
  template: `
    <service-duration-form-component
      *ngFor="let durationVersionForm of durationVersionsForm.controls"
      [form]="durationVersionForm">
    </service-duration-form-component>
    <hr>
    <button class="btn btn-primary" (click)="pushNewDurationVersionFormForm($event)">Add new duration</button>
  `
})
export class DurationsFormComponent {

  @Input()
  public durationVersionsForm: FormArray<DurationVersionForm> = new FormArray([new DurationVersionForm()]);

  @Output()
  public readonly handlePushNewDurationVersionFormForm: EventEmitter<Event> = new EventEmitter();

  public pushNewDurationVersionFormForm($event: Event): void {
    this.handlePushNewDurationVersionFormForm.emit($event);
  }

}
