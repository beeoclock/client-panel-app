import {ChangeDetectionStrategy, Component, EventEmitter, Output, ViewEncapsulation} from '@angular/core';
import {NgIf} from '@angular/common';
import {SpinnerComponent} from '@utility/presentation/component/spinner/spinner.component';
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'delete-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <button type="button"
            (click)="event.emit($event)"
            class="
              inline-flex
              items-center
              rounded-md
              bg-white
              px-3
              py-2
              text-sm
              font-semibold
              text-red-500
              shadow-sm
              ring-1
              ring-inset
              ring-beeColor-300
              hover:bg-beeColor-50">
      <i class="bi bi-trash me-2"></i>
      {{ 'general.delete' | translate }}
    </button>
  `,
  imports: [
    NgIf,
    SpinnerComponent,
    TranslateModule
  ]
})
export class DeleteButtonComponent {

  @Output()
  public readonly event = new EventEmitter<Event>();

}
