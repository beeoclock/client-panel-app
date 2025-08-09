import {ChangeDetectionStrategy, Component, inject, input, ViewEncapsulation} from "@angular/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {IonSelect, IonSelectOption} from "@ionic/angular/standalone";
import {OrderServiceStatusEnum} from "@tenant/order/order-service/domain/enum/order-service.status.enum";

@Component({
	selector: 'ion-select-order-service-status',
	standalone: true,
	template: `
		<ion-select
			[multiple]="multiple()"
			[formControl]="control()"
			[placeholder]="'keyword.capitalize.allStatuses' | translate"
			class="!min-h-0 px-4 py-3 border border-beeColor-300 rounded-2xl h-full"
			fill="solid"
			interface="popover">
			@for (status of statusList; track status.id) {
				<ion-select-option [value]="status.id">
					{{ status.label }}
				</ion-select-option>
			}
		</ion-select>
	`,
	encapsulation: ViewEncapsulation.None,
	imports: [
		NgSelectModule,
		ReactiveFormsModule,
		TranslateModule,
		IonSelect,
		IonSelectOption,
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class IonSelectOrderServiceStatusComponent {

	public readonly multiple = input(true);

	public readonly id = input('');

	public readonly control = input.required<FormControl>();

	private readonly translateService = inject(TranslateService);

	public readonly statusList: { id: null | string; label: string; }[] = [
		OrderServiceStatusEnum.accepted,
		OrderServiceStatusEnum.done,
		OrderServiceStatusEnum.requested,
		OrderServiceStatusEnum.cancelled,
	].map((status) => {
		const labelKey = this.statusLabelKeyMap[status] ?? status;
		return {
			id: status,
			label: this.translateService.instant(`event.keyword.status.plural.${labelKey}`)
		};
	});

	private readonly statusLabelKeyMap: Partial<Record<OrderServiceStatusEnum, string>> = {
		[OrderServiceStatusEnum.accepted]: 'confirmed',
	};
}
