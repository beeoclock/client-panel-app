import {AfterViewInit, Component, ElementRef, HostBinding, Input, ViewChild, ViewEncapsulation} from "@angular/core";
import {CdkMenu, CdkMenuTrigger} from "@angular/cdk/menu";
import {NgIf} from "@angular/common";
import {Dropdown, DropdownInterface, DropdownOptions} from "flowbite";

@Component({
  selector: 'utility-dropdown',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CdkMenuTrigger,
    CdkMenu,
    NgIf
  ],
  template: `

    <!--  Dropdown button  -->
    <button
      #dropdownButton
      class="
        text-neutral-800
        bg-neutral-200
        hover:bg-neutral-300
        focus:ring-4
        focus:outline-none
        focus:ring-neutral-400
        font-medium
        rounded-lg
        text-sm
        px-4
        py-2.5
        text-center
        inline-flex
        items-center
        dark:bg-blue-600
        dark:hover:bg-blue-700
        dark:focus:ring-blue-800"
      type="button">
      <ng-container *ngIf="threeDot; else DefaultTemplate">
        <i class="bi bi-three-dots-vertical"></i>
      </ng-container>
      <ng-template #DefaultTemplate>
        {{ buttonLabel }}
        <i class="bi bi-chevron-down -mr-1 ml-1.5 h-5 w-5"></i>
      </ng-template>
    </button>

    <!-- Dropdown menu -->
    <div
      #dropdownMenu
      class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
      <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
        <ng-content select="[content]"></ng-content>
      </ul>
    </div>

  `
})
export class DropdownComponent implements AfterViewInit {

  @ViewChild('dropdownButton')
  public dropdownButton!: ElementRef<HTMLButtonElement>;

  @ViewChild('dropdownMenu')
  public dropdownMenu!: ElementRef<HTMLDivElement>;

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

  #dropdown: DropdownInterface | undefined;

  public get dropdown(): DropdownInterface | undefined {
    return this.#dropdown;
  }

  public ngAfterViewInit(): void {

    // options with default values
    const options: DropdownOptions = {
      placement: 'bottom-start',
      triggerType: 'click',
    };

    /*
    * targetEl: required
    * triggerEl: required
    * options: optional
    */
    this.#dropdown = new Dropdown(this.dropdownMenu.nativeElement, this.dropdownButton.nativeElement, options);

  }

}

