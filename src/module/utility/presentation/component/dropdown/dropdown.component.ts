import {AfterViewInit, Component, ElementRef, HostBinding, Input, ViewChild, ViewEncapsulation} from "@angular/core";
import {NgIf} from "@angular/common";
import {Dropdown, DropdownInterface, DropdownOptions} from "flowbite";
import {Placement} from "@popperjs/core/lib/enums";
import {IconComponent} from "@src/component/adapter/icon/icon.component";

@Component({
	selector: 'utility-dropdown',
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	imports: [
		NgIf,
		IconComponent
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
			[class.rounded-r-none]="group === 'right'"
			[class.rounded-l-none]="group === 'left'"
			type="button">
			@if (threeDot) {
				<app-icon name="bootstrapThreeDotsVertical"/>
			} @else {

				@if (customButtonContent) {
					<ng-content select="[button]"></ng-content>
				} @else {
					{{ buttonLabel }}
					<app-icon name="bootstrapChevronDown" class="-mr-1 ml-1.5 h-5 w-5"/>
				}
			}
		</button>

		<!-- Dropdown menu -->
		<div
			#dropdownMenu
			class="z-10 hidden bg-white divide-y divide-beeColor-100 rounded-lg shadow-xl w-44 dark:bg-beeDarkColor-700">
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
	public placement: Placement = 'bottom-start';

	@Input()
	public buttonLabel = 'More';

	@Input()
	public customButtonContent = false;

	@Input()
	public threeDot = false;

	@Input()
	public group: false | 'left' | 'right' = false;

	@Input()
	public offsetDistance = 0;

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
			placement: this.placement,
			triggerType: 'click',
			offsetDistance: this.offsetDistance,
		};

		/*
		* targetEl: required
		* triggerEl: required
		* options: optional
		*/
		this.#dropdown = new Dropdown(this.dropdownMenu.nativeElement, this.dropdownButton.nativeElement, options);

	}

}

