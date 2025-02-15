import {Component, inject, input, ViewEncapsulation} from '@angular/core';
import {FormControl} from "@angular/forms";
import {NgClass, NgForOf} from "@angular/common";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {WEEK_DAYS_OBJECTS, WORK_WEEK} from "src/core/shared/enum";
import {DefaultLabelDirective} from "@utility/presentation/directives/label/default.label.directive";

@Component({
	selector: 'select-week-day-component',
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	imports: [
		NgForOf,
		NgClass,
		TranslateModule,
		DefaultLabelDirective
	],
	template: `
		<label default>
			{{ 'keyword.capitalize.workdays' | translate }}
		</label>
		<div class="grid grid-cols-5 md:grid-cols-7 gap-2">
			<div *ngFor="let day of weekDayList" class="flex items-center justify-center">
				<button
					type="button"
					class="rounded-xl border w-full text-center py-1.5 dark:bg-beeDarkColor-800 dark:border-beeDarkColor-700 dark:text-white"
					[ngClass]="selectedClass(isSelected(day.id))"
					[id]="'service-form-workDays-' + day.id"
					(click)="toggleSelect(day.id)">
					{{day.name}}
				</button>
			</div>
		</div>
	`
})
export class SelectWeekDayComponent {

	public readonly control = input(new FormControl(WORK_WEEK));

	public readonly translateService = inject(TranslateService);

	public readonly weekDayList: { id: number; name: string; }[];

	constructor() {
		this.weekDayList = WEEK_DAYS_OBJECTS.map((weekDay) => {
			return {
				...weekDay,
				name: this.translateService.instant(`weekday.short.${weekDay.name}`)
			}
		});
	}

	public isSelected(id: number): boolean {
		return !!this.control().value?.includes?.(id);
	}

	public toggleSelect(id: number): void {
		const value = this.control().value || [];
		if (value.includes(id)) {
			this.control().setValue(value.filter((v) => v !== id));
		} else {
			this.control().setValue([...value, id]);
		}
	}

	public selectedClass(isSelected: boolean): Record<string, boolean> {
		return {
			'bg-blue-500 border-blue-600 text-white': isSelected,
			'border-beeColor-200': !isSelected,
			'dark:bg-beeDarkColor-800 dark:border-beeDarkColor-700 dark:text-white': !isSelected,
		};
	}

}
