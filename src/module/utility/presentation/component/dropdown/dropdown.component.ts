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
    <button
      #dropdownButton
      data-dropdown-toggle="dropdown"
      class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      type="button">
      <ng-container *ngIf="threeDot; else DefaultTemplate">
        <i class="bi bi-three-dots-vertical"></i>
      </ng-container>
      <ng-template #DefaultTemplate>
        {{ buttonLabel }}
        <svg class="-mr-1 ml-1.5 h-5 w-5 text-neutral-400" viewBox="0 0 20 20" fill="currentColor"
             aria-hidden="true">
          <path fill-rule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clip-rule="evenodd"/>
        </svg>
      </ng-template>
    </button>
    <!-- Dropdown menu -->
    <div
      #dropdownMenu
      class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
      <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
        <ng-content select="[content]"></ng-content>
        <!--        <li>-->
        <!--          <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a>-->
        <!--        </li>-->
        <!--        <li>-->
        <!--          <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Earnings</a>-->
        <!--        </li>-->
        <!--        <li>-->
        <!--          <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Sign out</a>-->
        <!--        </li>-->
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

  public ngAfterViewInit(): void {

    // options with default values
    const options: DropdownOptions = {
      placement: 'bottom-start',
      triggerType: 'click',
      // offsetSkidding: 0,
      // offsetDistance: 10,
      // delay: 300,
      // onHide: () => {
      //   console.log('dropdown has been hidden');
      // },
      // onShow: () => {
      //   console.log('dropdown has been shown');
      // },
      // onToggle: () => {
      //   console.log('dropdown has been toggled');
      // }
    };
    /*
    * targetEl: required
    * triggerEl: required
    * options: optional
    */
    console.log(this.dropdownButton);
    console.log(this.dropdownMenu);
    const dropdown: DropdownInterface = new Dropdown(this.dropdownMenu.nativeElement, this.dropdownButton.nativeElement, options);

    console.log(dropdown);

    // show the dropdown
    // dropdown.show();

  }

}

