import {ChangeDetectionStrategy, Component, HostBinding, ViewEncapsulation, input} from '@angular/core';
import {NgIf} from '@angular/common';
import {SpinnerComponent} from '@utility/presentation/component/spinner/spinner.component';
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'bee-form-button-with-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
      <i class="bi bi-plus-lg"></i>
      {{ label() }}
  `,
  imports: [
    NgIf,
    SpinnerComponent,
    TranslateModule
  ]
})
export class FormButtonWithIconComponent {

  public readonly label = input('LABEL OF BUTTON');

	@HostBinding('attr.type')
	public type = 'button';

	@HostBinding()
	public class = `
	cursor-pointer
          text-blue-600
          rounded-2xl
          px-4
          py-2
          hover:bg-blue-100
          dark:hover:bg-beeDarkColor-800
          flex
          gap-3
          items-center
          justify-center`;

}
