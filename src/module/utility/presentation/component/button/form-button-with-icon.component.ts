import {ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation} from '@angular/core';
import {NgIf} from '@angular/common';
import {SpinnerComponent} from '@utility/presentation/component/spinner/spinner.component';
import {TranslateModule} from "@ngx-translate/core";
import {IconComponent} from "@src/component/adapter/icon/icon.component";

@Component({
  selector: 'bee-form-button-with-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
	  <app-icon name="bootstrapPlusLg"/>
      {{ label }}
  `,
	imports: [
		NgIf,
		SpinnerComponent,
		TranslateModule,
		IconComponent
	]
})
export class FormButtonWithIconComponent {

  @Input()
  public label = 'LABEL OF BUTTON';

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
