import {Component, Input} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'utility-search-input-component',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  template: `
    <input type="text" [formControl]="control" class="rounded px-3 py-2 border" [placeholder]="placeholder">
  `
})
export class SearchInputComponent {

  @Input()
  public control: FormControl = new FormControl();

  @Input()
  public placeholder = 'Write text';

}
