import {Component, EventEmitter, Input, Output} from "@angular/core";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {RouterLink} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";

@Component({
	selector: 'not-found-table-data-component',
	standalone: true,
	imports: [
		NgOptimizedImage,
		PrimaryButtonDirective,
		RouterLink,
		TranslateModule,
		NgIf
	],
	template: `
		<div class="grid grid-cols-12 h-[calc(100%-118px)] md:h-[calc(100%-70px)]">
			<div class="col-span-8 col-start-3 md:col-span-4 md:col-start-5 flex flex-col justify-center items-center gap-4 text-center">
				<img ngSrc="/asset/img/starter.svg" alt="" height="327" width="355">
				<div class="text-beeColor-500">
					{{ label }}
				</div>
				<ng-template [ngIf]="showLinkToForm">
					<button type="button" primary (click)="clickListener.emit($event)">
						<i class="bi bi-plus-lg"></i>
						{{ linkLabel }}
					</button>
				</ng-template>
				<ng-content/>
			</div>
		</div>
	`
})
export class NotFoundTableDataComponent {

	@Input()
	public label = 'Data not found, try adding';

	@Input()
	public showLinkToForm = false;

	@Input()
	public linkLabel = 'TODO';

	@Output()
	public readonly clickListener = new EventEmitter<MouseEvent>();

}
