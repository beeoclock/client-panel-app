import {ChangeDetectionStrategy, Component, input, ViewEncapsulation} from "@angular/core";
import {IonItem, IonLabel, IonList, IonPopover} from "@ionic/angular/standalone";
import {TranslatePipe} from "@ngx-translate/core";

export enum ExportEnum {
	CSV = 'csv',
	PDF = 'pdf',
}

@Component({
	standalone: true,
	selector: 'app-export-button',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		IonItem,
		IonLabel,
		IonList,
		IonPopover,
		TranslatePipe
	],
	template: `

		<button
			[id]="id()"
			class="!min-h-0 px-4 py-3 border border-beeColor-300 rounded-2xl h-full">
			<div class="text-center flex gap-2 items-center pe-2 text-black text-sm uppercase">
				<i class="bi bi-download"></i>
				<span>{{ 'keyword.capitalize.export' | translate }}</span>
			</div>
		</button>
		<ion-popover [trigger]="id()">
			<ng-template>
				<ion-list>

					<!-- CSV -->
					<ion-item [button]="true" lines="full" [detail]="false" (click)="export(exportEnum.CSV)">
						<ion-label class="!flex items-center gap-2">
							CSV
						</ion-label>
					</ion-item>

				</ion-list>
			</ng-template>
		</ion-popover>
	`
})
export class ExportButtonComponent {

	public readonly id = input('export-button');

	public readonly exportEnum = ExportEnum;

	public export(type: ExportEnum): void {
		console.log('Exporting as:', type);
	}

}
