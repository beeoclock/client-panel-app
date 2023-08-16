import {Component, inject, Input, ViewEncapsulation} from '@angular/core';
import {FormControl} from "@angular/forms";
import {NgClass, NgForOf} from "@angular/common";
import {Info} from "luxon";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {WORK_WEEK} from "@utility/domain/enum";

@Component({
  selector: 'select-week-day-component',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    TranslateModule
  ],
  template: `
    <label class="dark:text-beeDarkColor-300 block text-sm font-medium leading-6 text-beeColor-900 dark:text-white">
      {{ 'keyword.capitalize.workdays' | translate }}
    </label>
    <div class="grid grid-cols-7 gap-2">
      <div *ngFor="let day of weekDayList" class="flex items-center justify-center">
        <button
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

  @Input()
  public control = new FormControl(WORK_WEEK);

  public readonly translateService = inject(TranslateService);

  public readonly weekDayList: { id: number; name: string; }[] = [];

  constructor() {
    this.weekDayList = Info.weekdays('short', {
      locale: this.translateService.currentLang,
    }).map((name, id) => ({id, name}));
  }

  public isSelected(id: number): boolean {
    return !!this.control.value?.includes?.(id);
  }

  public toggleSelect(id: number): void {
    const value = this.control.value || [];
    if (value.includes(id)) {
      this.control.setValue(value.filter((v) => v !== id));
    } else {
      this.control.setValue([...value, id]);
    }
  }

  public selectedClass(isSelected: boolean): Record<string, boolean> {
    return {
      'bg-blue-500 border-blue-600 text-white': isSelected,
      'bg-beeColor-100 border-beeColor-200': !isSelected,
      'dark:bg-beeDarkColor-800 dark:border-beeDarkColor-700 dark:text-white': !isSelected,
    };
  }
}
