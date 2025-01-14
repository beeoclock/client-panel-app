import {Component} from '@angular/core';

@Component({
  selector: 'utility-filter-panel-component',
  standalone: true,
  template: `
		<section class="bg-gray-50 dark:bg-gray-900 flex items-center">
			<div class="w-full">
				<!-- Start coding here -->
				<div class="relative bg-white shadow-md dark:bg-gray-800 rounded-b-2xl">
					<div class="flex flex-col items-center justify-between p-4 space-y-3 md:flex-row md:space-y-0 md:space-x-4">
						<div class="w-full md:w-1/2">
							<ng-content select="[start]"/>
						</div>
						<div
							class="flex flex-col items-stretch justify-end flex-shrink-0 w-full space-y-2 md:w-auto md:flex-row md:space-y-0 md:items-center md:space-x-3">
							<ng-content select="[end]"/>
						</div>
					</div>
				</div>
			</div>
		</section>
  `
})
export class FilterPanelComponent {

}
