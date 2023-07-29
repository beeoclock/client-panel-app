import {Component, Input} from '@angular/core';
import {FormControl} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'event-select-date-and-time-form-component',
  standalone: true,
  imports: [
    NgForOf,
    TranslateModule
  ],
  template: `
    <strong>{{ 'general.information' | translate }}</strong>
    TODO
  `
})
export class SelectDateAndTimeFormComponent {

  @Input()
  public control!: FormControl<string>;

}
