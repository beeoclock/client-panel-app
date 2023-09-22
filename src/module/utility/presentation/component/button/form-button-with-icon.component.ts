import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';
import {NgIf} from '@angular/common';
import {SpinnerComponent} from '@utility/presentation/component/spinner/spinner.component';
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'bee-form-button-with-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <button
			type="button"
      class="
          text-blue-600
          rounded-2xl
          px-4
          py-2
          hover:bg-blue-100
          dark:hover:bg-beeDarkColor-800
          flex
          gap-3
          items-center
          justify-center
        ">
      <i class="bi bi-plus-lg"></i>
      {{ label }}
    </button>
  `,
  imports: [
    NgIf,
    SpinnerComponent,
    TranslateModule
  ]
})
export class FormButtonWithIconComponent {

  @Input()
  public label = 'LABEL OF BUTTON';

}
