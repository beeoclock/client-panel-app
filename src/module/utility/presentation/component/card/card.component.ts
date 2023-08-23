import {Component, Input, ViewEncapsulation} from '@angular/core';
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'card',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    NgIf,
    NgClass
  ],
  template: `
    <div
      class="bg-white dark:text-white dark:bg-beeDarkColor-800/50 dark:border dark:border-beeDarkColor-700 shadow rounded-2xl flex flex-col" [ngClass]="['gap-' + gap, 'w-' + width, 'p-' + padding]">
      <ng-content></ng-content>
    </div>
  `
})
export class CardComponent {
  @Input()
  public gap: '4' | '1' | '2' | '3' | '8' = '4';

  @Input()
  public padding: '4' | '1' | '2' | '3' | '8' = '4';

  @Input()
  public width: 'auto' | '96' | string = 'auto';
}
