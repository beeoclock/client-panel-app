import {Component, Input} from '@angular/core';
import {FormControl} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'event-note-form-component',
  standalone: true,
  imports: [
    NgForOf,
    TranslateModule
  ],
  template: `
    <strong>{{ 'general.additional' | translate }}</strong>

    <div class="flex flex-col">
      <label for="customer-form-note">{{ 'general.note' | translate }}</label>
      <textarea
        invalidTooltip
        class="border rounded bg-white px-2 py-1"
        rows="4"
        placeholder="Write some notes of customer"
        id="customer-form-note"
        formControlName="description"></textarea>
    </div>
  `
})
export class NoteComponent {

  @Input()
  public control!: FormControl<string>;

}
