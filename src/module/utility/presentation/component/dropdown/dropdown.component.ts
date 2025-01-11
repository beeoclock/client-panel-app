import {
	AfterViewInit,
	Component,
	ElementRef,
	HostBinding,
	Input,
	input,
	viewChild,
	ViewEncapsulation
} from "@angular/core";
import {NgIf} from "@angular/common";
import {Dropdown, DropdownInterface, DropdownOptions} from "flowbite";
import {Placement} from "@popperjs/core/lib/enums";

@Component({
  selector: 'utility-dropdown',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    NgIf
  ],
  template: `

    <!--  Dropdown button  -->
    <button
      #dropdownButton
      class="
        text-beeColor-800
        dark:text-beeDarkColor-100
        border-beeColor-200
        border
        hover:bg-beeColor-300
        focus:outline-none
        font-medium
        rounded-2xl
        text-sm
        px-3
        py-2
        text-center
        inline-flex
        items-center
        dark:bg-beeDarkColor-600
        dark:hover:bg-beeDarkColor-700"
			[class.rounded-r-none]="group() === 'right'"
			[class.rounded-l-none]="group() === 'left'"
      type="button">
      <ng-container *ngIf="threeDot(); else DefaultTemplate">
        <i class="bi bi-three-dots-vertical"></i>
      </ng-container>
      <ng-template #DefaultTemplate>

        <ng-container *ngIf="customButtonContent()">
          <ng-content select="[button]"></ng-content>
        </ng-container>

        <ng-container *ngIf="!customButtonContent()">
          {{ buttonLabel() }}
          <i class="bi bi-chevron-down -mr-1 ml-1.5 h-5 w-5"></i>

        </ng-container>

      </ng-template>
    </button>

    <!-- Dropdown menu -->
    <div
      #dropdownMenu
      class="z-10 hidden bg-white divide-y divide-beeColor-100 rounded-lg shadow-xl w-44 dark:bg-beeDarkColor-700">
      <ul [class]="menuClassList()" aria-labelledby="dropdownDefaultButton">
        <ng-content select="[content]"></ng-content>
      </ul>
    </div>

  `
})
export class DropdownComponent implements AfterViewInit {

  readonly dropdownButton = viewChild.required<ElementRef<HTMLButtonElement>>('dropdownButton');

  readonly dropdownMenu = viewChild.required<ElementRef<HTMLDivElement>>('dropdownMenu');

  public readonly placement = input<Placement>('bottom-start');

  public readonly buttonLabel = input('More');

  public readonly customButtonContent = input(false);

  public readonly threeDot = input(false);

  public readonly group = input<false | 'left' | 'right'>(false);

  public readonly offsetDistance = input(0);

  public readonly menuClassList = input('py-2 text-sm text-beeColor-700 dark:text-beeDarkColor-200');

  @Input()
  @HostBinding()
  public id = 'utility-popover-btn';

  // The popover will present only on mobile size
  @Input()
  @HostBinding('class.sm:hidden')
  public smHidden = false;

  #dropdown: DropdownInterface | undefined;

  public get dropdown(): DropdownInterface | undefined {
    return this.#dropdown;
  }

  public ngAfterViewInit(): void {

    // options with default values
    const options: DropdownOptions = {
      placement: this.placement(),
      triggerType: 'click',
			offsetDistance: this.offsetDistance(),
    };

    /*
    * targetEl: required
    * triggerEl: required
    * options: optional
    */
    this.#dropdown = new Dropdown(this.dropdownMenu().nativeElement, this.dropdownButton().nativeElement, options);

  }

}

