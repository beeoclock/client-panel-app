import {Component, HostBinding, Input, ViewEncapsulation} from "@angular/core";
import {CdkMenu, CdkMenuTrigger} from "@angular/cdk/menu";
import {NgIf} from "@angular/common";

@Component({
  selector: 'utility-popover',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CdkMenuTrigger,
    CdkMenu,
    NgIf
  ],
  template: `
    <button
      [cdkMenuTriggerFor]="menu"
      type="button"
      class="
        inline-flex
        items-center
        rounded-md
        bg-white
        px-3
        py-2
        text-sm
        font-semibold
        text-gray-900
        shadow-sm
        ring-1
        ring-inset
        ring-gray-300
        hover:ring-gray-400"
      [id]="id"
      aria-expanded="false"
      aria-haspopup="true">
      <ng-container *ngIf="threeDot; else DefaultTemplate">
        <i class="bi bi-three-dots-vertical"></i>
      </ng-container>
      <ng-template #DefaultTemplate>
        {{ buttonLabel }}
        <svg class="-mr-1 ml-1.5 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"
             aria-hidden="true">
          <path fill-rule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clip-rule="evenodd"/>
        </svg>
      </ng-template>
    </button>
    <ng-template #menu>
      <div
        cdkMenu
        class="
        abstract
        z-10
        -mr-1
        mt-2
        w-48
        origin-top-right
        rounded-md
        bg-white
        py-1
        shadow-lg
        ring-1
        ring-black
        ring-opacity-5
        focus:outline-none"
        role="menu"
        aria-orientation="vertical"
        [attr.aria-labelledby]="id"
        tabindex="-1">
        <ng-content select="[content]"></ng-content>
      </div>
    </ng-template>
  `
})
export class PopoverComponent {

  @Input()
  public buttonLabel = 'More';

  @Input()
  public threeDot = false;

  @Input()
  @HostBinding()
  public id = 'utility-popover-btn';

  // The popover will present only on mobile size
  @Input()
  @HostBinding('class.sm:hidden')
  public smHidden = false;

  @HostBinding()
  public class = 'relative';

}

