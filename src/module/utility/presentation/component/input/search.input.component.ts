import {Component, inject, Input} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule, TranslateService} from "@ngx-translate/core";

@Component({
	selector: 'utility-search-input-component',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		TranslateModule
	],
	template: `
		<div class="flex items-center">
			<label for="simple-search" class="sr-only">
				{{ 'keyword.capitalize.search' | translate }}
			</label>
			<div class="relative w-full">
				<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
					<svg
						aria-hidden="true"
						class="w-5 h-5 text-gray-500 dark:text-gray-400"
						fill="currentColor"
						viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
						<path
							fill-rule="evenodd"
							d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
							clip-rule="evenodd"/>
					</svg>
				</div>
				<input
					type="text"
					id="simple-search"
					class="block pr-4 py-2 pl-10 border border-beeColor-200 rounded-2xl text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					[formControl]="control"
					[placeholder]="placeholder" />
			</div>
		</div>
	`
})
export class SearchInputComponent {

	@Input()
	public control: FormControl = new FormControl();

	public readonly translateService = inject(TranslateService);

	@Input()
	public placeholder = this.translateService.instant('keyword.capitalize.placeholder.search');

}
