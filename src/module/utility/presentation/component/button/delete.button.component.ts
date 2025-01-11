import {ChangeDetectionStrategy, Component, EventEmitter, Output, ViewEncapsulation, input} from '@angular/core';
import {NgIf} from '@angular/common';
import {SpinnerComponent} from '@utility/presentation/component/spinner/spinner.component';
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'bee-delete-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <button
      type="button"
      (click)="event.emit($event)"
      [class.w-full]="buttonWidthFull()"
      class="
        flex items-center justify-center
        rounded-2xl
        bg-white
        hover:bg-beeColor-50
        dark:bg-beeDarkColor-800
        dark:hover:bg-red-800
        px-4
        py-2
        text-sm
        font-semibold
        text-red-500
        dark:hover:text-red-200
        shadow-sm
        ring-1
        ring-inset
        ring-beeColor-300
        dark:ring-red-700
        hover:dark:ring-red-700">
      <i class="bi bi-trash me-2"></i>
      {{ 'keyword.capitalize.delete' | translate }}
    </button>
  `,
  imports: [
    NgIf,
    SpinnerComponent,
    TranslateModule
  ]
})
export class DeleteButtonComponent {

  public readonly buttonWidthFull = input(false);

  @Output()
  public readonly event = new EventEmitter<Event>();

}
