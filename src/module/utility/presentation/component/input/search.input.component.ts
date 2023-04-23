import {Component, Input} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'utility-search-input-component',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  template: `
    <input type="text" [formControl]="control" class="form-control" [placeholder]="placeholder">
  `
})
export class SearchInputComponent {

  @Input()
  public control: FormControl = new FormControl();

  @Input()
  public placeholder = 'Write text';

}
