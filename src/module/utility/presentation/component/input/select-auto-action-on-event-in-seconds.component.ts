import {ChangeDetectionStrategy, Component, inject, input, ViewEncapsulation} from "@angular/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {AutoActionOnEventInSecondsEnum} from "@core/shared/enum/auto-action-on-event-in-seconds.enum";
import {DefaultLabelDirective} from "@utility/presentation/directives/label/default.label.directive";
import {is} from "@src/core/shared/checker";

@Component({
	selector: 'select-auto-action-on-event-in-seconds-component',
	standalone: true,
	template: `
		<div class="relative">
			<label default [for]="id()">
				{{ 'keyword.capitalize.autoActionOnOrderInSeconds' | translate }}
			</label>
			<ng-select
				bindLabel="name"
				bindValue="seconds"
				[items]="autoActionOnOrderInSecondsList"
				[clearable]="false"
				[id]="id()"
				[formControl]="control()">
			</ng-select>
		</div>
		<div class="italic leading-tight p-2 text-beeColor-500 text-sm">
			{{ 'client.profile.form.section.bookingSettings.input.autoActionOnOrderInSeconds.placeholder' | translate }}
		</div>
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

	public readonly id = input('');

	public readonly control = input(new FormControl());

	public readonly translateService = inject(TranslateService);

	public readonly autoActionOnOrderInSecondsList = Object.values(AutoActionOnEventInSecondsEnum)
		.filter(is.string)
		.map((autoActionOnOrderInSecondsValue: any) => { // TODO: Find why to delete type "any" here
			return {
				name: this.translateService.instant(`autoActionOnOrderInSeconds.${autoActionOnOrderInSecondsValue}`),
				seconds: AutoActionOnEventInSecondsEnum[autoActionOnOrderInSecondsValue]
			};
		});

}
