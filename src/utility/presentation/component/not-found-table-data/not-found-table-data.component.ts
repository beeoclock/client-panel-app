import {Component, input, output} from "@angular/core";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {TranslateModule} from "@ngx-translate/core";

@Component({
	selector: 'not-found-table-data-component',
	standalone: true,
	imports: [
		NgOptimizedImage,
		PrimaryButtonDirective,
		TranslateModule,
		NgIf
	],
	template: `
		<div class="grid grid-cols-12 h-[calc(100%-118px)] md:h-[calc(100%-70px)]">
			<div class="col-span-8 col-start-3 md:col-span-4 md:col-start-5 flex flex-col justify-center items-center gap-4 text-center">
				<img ngSrc="/asset/img/starter.svg" alt="" height="327" width="355">
				<div class="text-beeColor-500">
					{{ label() }}
				</div>
				<ng-template [ngIf]="showLinkToForm()">
					<button type="button" primary (click)="clickListener.emit($event)">
						<i class="bi bi-plus-lg"></i>
						{{ linkLabel() }}
					</button>
				</ng-template>
				<ng-content/>
			</div>
		</div>
	`
})
export class NotFoundTableDataComponent {

	public readonly label = input('Data not found, try adding');

	public readonly showLinkToForm = input(false);

	public readonly linkLabel = input('TODO');

	public readonly clickListener = output<MouseEvent>();

}
