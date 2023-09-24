import {Component, Input} from "@angular/core";
import {NgOptimizedImage} from "@angular/common";

@Component({
	selector: 'not-found-table-data-component',
	standalone: true,
	imports: [
		NgOptimizedImage
	],
	template: `
		<div class="grid grid-cols-12 h-[calc(100%-118px)] md:h-[calc(100%-70px)]">
			<div class="col-span-8 col-start-3 md:col-span-4 md:col-start-5 flex flex-col justify-center items-center gap-4 text-center">
				<img ngSrc="/asset/img/starter.svg" alt="" height="327" width="355">
				<div class="text-beeColor-500">
					{{ label }}
				</div>
			</div>
		</div>
	`
})
export class NotFoundTableDataComponent {

	@Input()
	public label = 'Data not found, try adding';

}
