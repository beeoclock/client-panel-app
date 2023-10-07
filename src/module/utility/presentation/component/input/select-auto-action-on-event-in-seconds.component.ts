import {ChangeDetectionStrategy, Component, inject, Input, ViewEncapsulation} from "@angular/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {AutoActionOnEventInSecondsEnum} from "@utility/domain/enum/auto-action-on-event-in-seconds.enum";
import {DefaultLabelDirective} from "@utility/presentation/directives/label/default.label.directive";

@Component({
  selector: 'select-auto-action-on-event-in-seconds-component',
  standalone: true,
  template: `
    <label default [for]="id">
      {{ 'keyword.capitalize.autoActionOnEventInSeconds' | translate }}
    </label>
    <div class="text-sm text-beeColor-500">
      {{ 'client.profile.form.section.bookingSettings.input.autoActionOnEventInSeconds.placeholder' | translate }}
    </div>
    <ng-select
      bindLabel="name"
      bindValue="seconds"
      [items]="autoActionOnEventInSecondsList"
      [clearable]="false"
      [id]="id"
      [formControl]="control">
    </ng-select>
  `,
  encapsulation: ViewEncapsulation.None,
	imports: [
		NgSelectModule,
		ReactiveFormsModule,
		TranslateModule,
		DefaultLabelDirective
	],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectAutoActionOnEventInSecondsComponent {

  @Input()
  public id = '';

  @Input()
  public control = new FormControl();

  public readonly translateService = inject(TranslateService);

  public readonly autoActionOnEventInSecondsList = Object.values(AutoActionOnEventInSecondsEnum)
    .filter((autoActionOnEventInSecondsValue) => typeof autoActionOnEventInSecondsValue === 'string')
    .map((autoActionOnEventInSecondsValue) => {
      return {
        name: this.translateService.instant(`autoActionOnEventInSeconds.${autoActionOnEventInSecondsValue}`),
        seconds: AutoActionOnEventInSecondsEnum[autoActionOnEventInSecondsValue as keyof typeof autoActionOnEventInSecondsValue]
      };
    });

}
