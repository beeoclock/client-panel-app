import {Component, Input, ViewEncapsulation} from '@angular/core';
import {NgForOf} from '@angular/common';
import {ScheduleFormComponent} from "@utility/presentation/component/schedule/schedule.form.component";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {TranslateModule} from "@ngx-translate/core";
import {SchedulesForm} from "@utility/presentation/form/schdeule.form";
import {FormButtonWithIconComponent} from "@utility/presentation/component/button/form-button-with-icon.component";

@Component({
	selector: 'schedules-form-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		NgForOf,
		ScheduleFormComponent,
		CardComponent,
		TranslateModule,
		FormButtonWithIconComponent,
	],
	template: `
		<bee-card>

			<div class="flex flex-col gap-8">
				<div
					*ngFor="let scheduleForm of schedulesForm.controls; let index = index;"
					class="flex flex-col">

					<div class="flex justify-between">

						<strong class="dark:text-white">
							{{ 'keyword.capitalize.workingHours' | translate }} #{{index + 1}}
						</strong>
						<button
							type="button"
							class="text-beeColor-600 hover:text-red-600 hover:bg-red-100 px-3 py-2 rounded-full"
							(click)="schedulesForm.removeAt(index)">
							<i class="bi bi-trash"></i>
						</button>
					</div>

					<schedule-form-component [form]="scheduleForm"/>

				</div>
			</div>

			<div class="flex">
				<bee-form-button-with-icon
					(click)="schedulesForm.pushNewOne()"
					[label]="'keyword.capitalize.addAvailableHours' | translate"/>
			</div>

		</bee-card>
	`
})
export class SchedulesFormComponent {

	@Input()
	public schedulesForm!: SchedulesForm;

}
