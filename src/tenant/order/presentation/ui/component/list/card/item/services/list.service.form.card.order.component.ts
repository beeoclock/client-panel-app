import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	inject,
	input,
	OnChanges,
	ViewEncapsulation
} from "@angular/core";
import {
	ItemV2ListServiceFormOrderComponent
} from "@src/component/smart/order/form/service/list/item/item-v2.list.service.form.order.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {NGXLogger} from "ngx-logger";
import {Reactive} from "@utility/cdk/reactive";
import {ServiceOrderForm} from "@tenant/order/presentation/form/service.order.form";
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";
import {LanguageCodeEnum} from "@core/shared/enum";
import {AlertController} from "@ionic/angular/standalone";
import {IOrder} from "@core/business-logic/order/interface/i.order";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {OrderActions} from "@tenant/order/presentation/state/order/order.actions";
import {
	BusinessProfileState
} from "@tenant/business-profile/presentation/state/business-profile/business-profile.state";
import {IService} from "@core/business-logic/service/interface/i.service";
import {IMember} from "@core/business-logic/member/interface/i.member";
import {OrderServiceStatusEnum} from "@core/business-logic/order/enum/order-service.status.enum";
import {StateEnum} from "@core/shared/enum/state.enum";

@Component({
	standalone: true,
	selector: 'app-list-service-form-card-order-component',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	imports: [
		ItemV2ListServiceFormOrderComponent,
		TranslateModule,
	],
	template: `
		<div class="flex-col justify-start items-start flex">
			<div class="bg-white flex-col justify-start items-start flex divide-y border border-gray-200 rounded-2xl">
				@for (item of selectedServicePlusControlList; track item._id; let index = $index) {
					@if (specificOrderServiceId() === null || specificOrderServiceId() === item._id) {
						<app-item-list-v2-service-form-order-component
							[id]="idPrefix() + item._id"
							(deleteMe)="deleteOrderedService(item._id)"
							(saveChanges)="saveChanges(item.control)"
							[item]="item"
							[setupPartialData]="item.setupPartialData"/>
					}
				}
			</div>
		</div>
	`,
	host: {
		class: 'flex-col justify-start items-start flex'
	}
})
export class ListServiceFormCardOrderComponent extends Reactive implements OnChanges {

	public readonly order = input.required<IOrder.DTO>();

	public readonly specificOrderServiceId = input<string | null>(null);

	public readonly idPrefix = input('');

	public readonly selectedServicePlusControlList: {
		_id: string;
		service: IService.DTO;
		control: ServiceOrderForm;
		setupPartialData: {
			defaultAppointmentStartDateTimeIso: string;
			defaultMemberForService: IMember.DTO;
		};
	}[] = [];

	@SelectSnapshot(BusinessProfileState.baseLanguage)
	public readonly baseLanguage!: LanguageCodeEnum;

	readonly #ngxLogger = inject(NGXLogger);
	readonly #translateService = inject(TranslateService);
	readonly #changeDetectorRef = inject(ChangeDetectorRef);
	readonly #alertController = inject(AlertController);

	public ngOnChanges() {
		this.selectedServicePlusControlList.length = 0;
		this.order().services.forEach((orderServiceDto) => {
			if (orderServiceDto.state === StateEnum.active) {
				this.selectedServicePlusControlList.push({
					_id: orderServiceDto._id,
					service: orderServiceDto.serviceSnapshot,
					control: ServiceOrderForm.create(orderServiceDto),
					setupPartialData: {
						defaultAppointmentStartDateTimeIso: orderServiceDto.orderAppointmentDetails.start,
						defaultMemberForService: orderServiceDto?.orderAppointmentDetails?.specialists?.[0]?.member
					}
				});
			}
		});
		this.#changeDetectorRef.detectChanges();
	}

	public async deleteOrderedService(orderedServiceId: string) {

		this.#ngxLogger.info('deleteOrderedService', orderedServiceId);

		const isLastServiceInOrder = this.selectedServicePlusControlList.length === 1;
		const confirmed = await this.confirmToDelete(isLastServiceInOrder);

		if (!confirmed) {
			return;
		}

		this.dispatchOrderedServiceState(orderedServiceId, StateEnum.deleted);
		this.#changeDetectorRef.detectChanges();

	}

	private async confirmToDelete(isLastServiceInOrder = false) {
		this.#ngxLogger.info('confirmToDelete', isLastServiceInOrder);

		const header = this.#translateService.instant('order.confirmation.delete.service.header');
		const message = this.#translateService.instant('order.confirmation.delete.service.message');
		let subHeader = '';
		let cssClass = '';

		if (isLastServiceInOrder) {
			subHeader = this.#translateService.instant('order.confirmation.delete.service.subHeader.lastService');
			cssClass = '!text-red-600';
		}
		const modal = await this.#alertController.create({
			header,
			subHeader,
			message,
			buttons: [
				{
					text: this.#translateService.instant('keyword.capitalize.cancel'),
					role: 'cancel'
				},
				{
					cssClass,
					text: this.#translateService.instant('keyword.capitalize.delete'),
					role: 'confirm'
				}
			]
		});
		await modal.present();
		const {role} = await modal.onDidDismiss();
		return role === 'confirm';
	}

	protected saveChanges(control: ServiceOrderForm) {
		this.#ngxLogger.info('saveChanges', control.getRawValue());

		const orderServiceDto = control.getRawValue();
		this.dispatchOrderChanges({
			...this.order(),
			services: this.order().services.map((service) => {
				if (service._id === orderServiceDto._id) {
					return orderServiceDto;
				}
				return service;
			})
		});
	}

	@Dispatch()
	protected dispatchOrderedServiceStatus(orderedServiceId: string, status: OrderServiceStatusEnum) {
		return new OrderActions.OrderedServiceStatus(
			this.order()._id,
			orderedServiceId,
			status
		);
	}

	@Dispatch()
	protected dispatchOrderedServiceState(orderedServiceId: string, state: StateEnum) {
		return new OrderActions.OrderedServiceState(
			this.order()._id,
			orderedServiceId,
			state
		);
	}

	@Dispatch()
	protected dispatchOrderChanges(item: IOrder.DTO): OrderActions.UpdateItem {
		return new OrderActions.UpdateItem(item);
	}

}
