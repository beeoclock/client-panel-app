import {Component, Input} from '@angular/core';
import {FormControl} from '@angular/forms';
import {InputIconComponent} from "@utility/presentation/component/input/input-icon.component";

@Component({
  selector: 'time-input-component',
  standalone: true,
  imports: [
    InputIconComponent,
  ],
  template: `
    <form-icon-input
      [id]="id"
      placeholder="00:00"
      mask="00:00"
      icon="bi-clock"
      [control]="control"
      [label]="label">
    </form-icon-input>
  `
})
export class TimeInputComponent {

  @Input()
  public control: FormControl = new FormControl();

  @Input()
  public label = '';

  @Input()
  public id = '';

}
