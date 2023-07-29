import {Component, Input} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {InvalidTooltipDirective} from "@utility/directives/invalid-tooltip/invalid-tooltip.directive";

@Component({
  selector: 'event-note-form-component',
  standalone: true,
  imports: [
    NgForOf,
    TranslateModule,
    InvalidTooltipDirective,
    ReactiveFormsModule
  ],
  template: `
    <strong>{{ 'general.note' | translate }}</strong>

    <div class="flex flex-col">
      <textarea
        invalidTooltip
        class="border rounded bg-white px-2 py-1"
        rows="4"
        placeholder="Write some notes of customer"
        id="event-form-note"
        [formControl]="control"></textarea>
    </div>
  `
})
export class NoteComponent {

  @Input()
  public control!: FormControl<string>;

}
