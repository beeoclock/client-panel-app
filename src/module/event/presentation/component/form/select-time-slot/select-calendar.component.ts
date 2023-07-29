import {Component, Input} from '@angular/core';
import {FormControl} from "@angular/forms";
import {IService} from "@service/domain";

@Component({
  selector: 'event-select-time-slot-calendar-form-component',
  standalone: true,
  imports: [],
  template: `
    <div class="flex items-center justify-center gap-3">
      <button (click)="prevMonth()" class="px-3 py-2 hover:bg-gray-300 cursor-pointer rounded-2xl">
        <i class="bi bi-chevron-left"></i>
      </button>
      <span class="text-2xl font-thin">
        September 2023
      </span>
      <button (click)="nextMonth()" class="px-3 py-2 hover:bg-gray-300 cursor-pointer rounded-2xl">
        <i class="bi bi-chevron-right"></i>
      </button>
    </div>
  `
})
export class SelectCalendarComponent {

  @Input()
  public control!: FormControl<IService[]>;

  public prevMonth(): void {

  }

  public nextMonth(): void {

  }
}
