import {Component, Input} from '@angular/core';

@Component({
	selector: 'utility-default-panel-component',
	standalone: true,
	imports: [],
	template: `
		<section class="bg-gray-50 dark:bg-gray-900 flex items-center">
			<div class="w-full">
				<div
					[class.rounded-b-2xl]="roundedBottom"
					class="relative bg-white border-b border-beeColor-200 dark:bg-gray-800 p-4 flex flex-col md:flex-row-reverse md:items-center gap-4">
					<div class="flex items-center justify-between gap-4 w-full">
						<ng-content/>
					</div>
				</div>
			</div>
		</section>
	`
})
export class DefaultPanelComponent {

	@Input()
	public roundedBottom = true;

}
