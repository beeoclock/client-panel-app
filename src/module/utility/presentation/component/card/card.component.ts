import {Component, Input, ViewEncapsulation} from '@angular/core';
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'bee-card',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    NgIf,
    NgClass
  ],
  template: `
    <div
      class="bg-white dark:text-white dark:bg-beeDarkColor-800/50 border rounded-2xl flex flex-col"
      [ngClass]="[gap, 'w-' + width, padding, borderColor, 'dark:' + darkBorderColor]">
      <ng-content></ng-content>
    </div>
  `
})
export class CardComponent {
  @Input()
  public gap: 'gap-0' | 'gap-4' | 'gap-1' | 'gap-2' | 'gap-3' | 'gap-8' = 'gap-4';

  @Input()
  public padding = 'p-4';

  @Input()
  public width: 'auto' | '96' | string = 'auto';

  @Input()
  public borderColor = 'border-beeColor-200';

  @Input()
  public darkBorderColor = 'border-beeDarkColor-700';

}
