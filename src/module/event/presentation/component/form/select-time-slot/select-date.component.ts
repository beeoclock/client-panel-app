import {Component, Input} from '@angular/core';
import {FormControl} from "@angular/forms";
import {IService} from "@service/domain";

@Component({
  selector: 'event-select-time-slot-date-form-component',
  standalone: true,
  imports: [],
  template: `
    <div class="flex items-center justify-center gap-3">
      <button (click)="prevPackOfDates()" class="px-3 py-2 hover:bg-gray-300 cursor-pointer rounded-2xl">
        <i class="bi bi-chevron-left"></i>
      </button>
      <button class="flex flex-col items-center justify-center border rounded-xl px-3 py-2 hover:bg-gray-100 hover:text-black">
        <span>Tu</span>
        <span>16</span>
      </button>
      <button class="flex flex-col items-center justify-center border rounded-xl px-3 py-2 hover:bg-gray-100 hover:text-black bg-black text-white">
        <span>Tu</span>
        <span>16</span>
      </button>
      <button class="flex flex-col items-center justify-center border rounded-xl px-3 py-2 hover:bg-gray-100 hover:text-black">
        <span>Tu</span>
        <span>16</span>
      </button>
      <button class="flex flex-col items-center justify-center border rounded-xl px-3 py-2 hover:bg-gray-100 hover:text-black">
        <span>Tu</span>
        <span>16</span>
      </button>
      <button class="flex flex-col items-center justify-center border rounded-xl px-3 py-2 hover:bg-gray-100 hover:text-black">
        <span>Tu</span>
        <span>16</span>
      </button>
      <button (click)="nextPackOfDates()" class="px-3 py-2 hover:bg-gray-300 cursor-pointer rounded-2xl">
        <i class="bi bi-chevron-right"></i>
      </button>
    </div>
  `
})
export class SelectDateComponent {

  @Input()
  public control!: FormControl<IService[]>;

  public prevPackOfDates(): void {

  }

  public nextPackOfDates(): void {

  }
}
