import {ChangeDetectionStrategy, Component, Input, input, OnInit, ViewEncapsulation} from '@angular/core';
import {NgTemplateOutlet} from "@angular/common";
import {FormControl} from "@angular/forms";

@Component({
	selector: 'app-select-tailwindcss-component',
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		NgTemplateOutlet
	],
	template: `
		@if (label?.length) {
			<label
				[for]="id()"
				class="block text-sm font-medium leading-6 text-gray-900 mb-2">
				{{ label }}
			</label>
		}
		<div class="relative">
			<button
				[id]="id()"
				type="button"
				class="cursor-pointer transition-all min-w-[240px] relative w-full rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6"
				(click)="toggleDropdown()"
				[attr.aria-expanded]="dropdownOpen"
				aria-haspopup="listbox"
				aria-labelledby="listbox-label"
			>
			  <span class="flex items-center">
				<ng-container
					[ngTemplateOutlet]="avatarTemplate"
					[ngTemplateOutletContext]="{item: selectedItem}">
				</ng-container>
				<span class="ml-3 block truncate">{{ selectedItem?.label }}</span>
			  </span>
				<span class="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
					<svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
					  <path fill-rule="evenodd"
							d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
							clip-rule="evenodd"/>
					</svg>
				  </span>
			</button>

			@if (dropdownOpen) {

				<ul
					class="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
					role="listbox"
					aria-labelledby="listbox-label"
				>
					@for (item of items(); track item.id; let index = $index) {
						<li
							class="cursor-pointer transition-all relative select-none py-2 pl-3 pr-9 text-gray-900"
							[class.bg-blue-600]="isSelected(item.id)"
							[class.text-white]="isSelected(item.id)"
							(click)="select(item.id)"
							role="option"
							[attr.aria-selected]="isSelected(item.id)">
							<div class="flex items-center">
								<ng-container
									[ngTemplateOutlet]="avatarTemplate"
									[ngTemplateOutletContext]="{item}">
								</ng-container>

								<span [class.font-semibold]="isSelected(item.id)" class="ml-3 block truncate">
								{{ item.label }}
							  </span>
							</div>
						</li>
					}
				</ul>
			}
		</div>

		<ng-template #avatarTemplate let-item='item'>
			<div
				class="rounded-full bg-beeColor-400 min-h-7 min-w-7 max-h-7 max-w-7 h-7 w-7 flex justify-center items-center">
				@if (item?.avatar?.length) {

					<img [src]="item.avatar"
						 class="min-h-7 min-w-7 max-h-7 max-w-7 h-7 w-7 rounded-full object-cover"
						 [attr.alt]="item.label">

				} @else {

					@if (item.label.split(' '); as labelParts) {
						<div
							class="text-white text-xs font-bold">{{ labelParts?.[0]?.[0] ?? '' }}
						</div>

						<div
							class="text-white text-xs font-bold">{{ labelParts?.[1]?.[0] ?? '' }}
						</div>
					}

				}

			</div>
		</ng-template>

	`
})
export class SelectTailwindcssComponent implements OnInit {

	public readonly id = input<string>('');

	@Input()
	public label: string = '';

	public readonly formControl = input.required<FormControl>();

	public readonly items = input<{
    label: string;
    avatar: string;
    id: string;
}[]>([
    {
        id: 'default',
        label: 'Tom Cook',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
        id: '1',
        label: 'Wade Cooper',
        avatar: 'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
]);

	public dropdownOpen = false;

	public isSelected(id: string) {
		return this.formControl().value === id;
	}

	public get selectedItem() {
		return this.items().find(item => item.id === this.formControl().value);
	}

	public ngOnInit() {
		this.select(this.items()[0].id); // Default selection
	}

	public toggleDropdown() {
		this.dropdownOpen = !this.dropdownOpen;
	}

	public select(id: string) {
		this.formControl().setValue(id);
		this.dropdownOpen = false;
	}
}
