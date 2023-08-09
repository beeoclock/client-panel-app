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
        text-beeColor-800
        dark:text-beeDarkColor-100
        bg-beeColor-200
        hover:bg-beeColor-300
        focus:ring-4
        focus:outline-none
        focus:ring-beeColor-400
        font-medium
        rounded-lg
        text-sm
        px-4
        py-2.5
        text-center
        inline-flex
        items-center
        dark:bg-beeDarkColor-600
        dark:hover:bg-beeDarkColor-700
        dark:focus:ring-beeDarkColor-800"
      type="button">
      <ng-container *ngIf="threeDot; else DefaultTemplate">
        <i class="bi bi-three-dots-vertical"></i>
      </ng-container>
      <ng-template #DefaultTemplate>

        <ng-container *ngIf="customButtonContent">
          <ng-content select="[button]"></ng-content>
        </ng-container>

        <ng-container *ngIf="!customButtonContent">
          {{ buttonLabel }}
          <i class="bi bi-chevron-down -mr-1 ml-1.5 h-5 w-5"></i>

        </ng-container>

      </ng-template>
    </button>

    <!-- Dropdown menu -->
    <div
      #dropdownMenu
      class="z-10 hidden bg-white divide-y divide-beeColor-100 rounded-lg shadow w-44 dark:bg-beeDarkColor-700">
      <ul [class]="menuClassList" aria-labelledby="dropdownDefaultButton">
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
  public customButtonContent = false;

  @Input()
  public threeDot = false;

  @Input()
  public menuClassList = 'py-2 text-sm text-beeColor-700 dark:text-beeDarkColor-200';

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

