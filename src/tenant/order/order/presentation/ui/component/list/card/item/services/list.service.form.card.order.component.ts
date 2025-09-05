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
} from "@shared/presentation/ui/component/smart/order/form/service/list/item/item-v2.list.service.form.order.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {NGXLogger} from "ngx-logger";
import {Reactive} from "@core/cdk/reactive";
import {OrderServiceForm} from "@tenant/order/order/presentation/form/orderServiceForm";
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";
import {LanguageCodeEnum} from "@core/shared/enum";
import {AlertController} from "@ionic/angular/standalone";
import {IOrder} from "@tenant/order/order/domain/interface/i.order";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {OrderActions} from "@tenant/order/order/infrastructure/state/order/order.actions";
import {
	BusinessProfileState
} from "@tenant/business-profile/infrastructure/state/business-profile/business-profile.state";
import {IService} from "@tenant/service/domain/interface/i.service";
import {IMember} from "@tenant/member/member/domain/interface/i.member";
import {OrderServiceStatusEnum} from "@tenant/order/order-service/domain/enum/order-service.status.enum";
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
			<div class="bg-white flex-col justify-start items-start flex gap-4">
				@for (item of selectedServicePlusControlList; track item._id; let index = $index) {
					@if (specificOrderServiceId() === null || specificOrderServiceId() === item._id) {
						<app-item-list-v2-service-form-order-component
							[item]="item"
							[id]="idPrefix() + item._id"
							[setupPartialData]="item.setupPartialData"
							(saveChanges)="saveChanges(item.control)"
							(deleteMe)="deleteOrderedService(item._id)"/>
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
		control: OrderServiceForm;
		setupPartialData: {
			defaultAppointmentStartDateTimeIso: string;
			defaultMemberForService: IMember.DTO;
		};
	}[] = [];

	@SelectSnapshot(BusinessProfileState.baseLanguage)
	public readonly baseLanguage!: LanguageCodeEnum;

	private readonly ngxLogger = inject(NGXLogger);
	private readonly translateService = inject(TranslateService);
	private readonly changeDetectorRef = inject(ChangeDetectorRef);
	private readonly alertController = inject(AlertController);

	public ngOnChanges() {
		this.selectedServicePlusControlList.length = 0;
		this.order().services.forEach((orderServiceDto) => {
			if (orderServiceDto.state === StateEnum.active) {
				this.selectedServicePlusControlList.push({
					_id: orderServiceDto._id,
					service: orderServiceDto.serviceSnapshot,
					control: OrderServiceForm.create(orderServiceDto),
					setupPartialData: {
						defaultAppointmentStartDateTimeIso: orderServiceDto.orderAppointmentDetails.start,
						defaultMemberForService: orderServiceDto?.orderAppointmentDetails?.specialists?.[0]?.member
					}
				});
			}
		});
		this.changeDetectorRef.detectChanges();
	}

	public async deleteOrderedService(orderedServiceId: string) {

		this.ngxLogger.info('deleteOrderedService', orderedServiceId);

		const isLastServiceInOrder = this.selectedServicePlusControlList.length === 1;
		const confirmed = await this.confirmToDelete(isLastServiceInOrder);

		if (!confirmed) {
			return;
		}

		this.dispatchOrderedServiceState(orderedServiceId, StateEnum.deleted);
		this.changeDetectorRef.detectChanges();

	}

	private async confirmToDelete(isLastServiceInOrder = false) {
		this.ngxLogger.info('confirmToDelete', isLastServiceInOrder);

		const header = this.translateService.instant('order.confirmation.delete.service.header');
		const message = this.translateService.instant('order.confirmation.delete.service.message');
		let subHeader = '';
		let cssClass = '';

		if (isLastServiceInOrder) {
			subHeader = this.translateService.instant('order.confirmation.delete.service.subHeader.lastService');
			cssClass = '!text-red-600';
		}
		const modal = await this.alertController.create({
			header,
			subHeader,
			message,
			buttons: [
				{
					text: this.translateService.instant('keyword.capitalize.cancel'),
					role: 'cancel'
				},
				{
					cssClass,
					text: this.translateService.instant('keyword.capitalize.delete'),
					role: 'confirm'
				}
			]
		});
		await modal.present();
		const {role} = await modal.onDidDismiss();
		return role === 'confirm';
	}

	protected saveChanges(control: OrderServiceForm) {
		this.ngxLogger.info('saveChanges', control.getRawValue());

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
