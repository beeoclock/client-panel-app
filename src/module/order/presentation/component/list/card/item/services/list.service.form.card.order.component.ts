import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	HostBinding,
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
import {IServiceDto} from "@src/core/business-logic/order/interface/i.service.dto";
import {RIMember} from "@src/core/business-logic/member";
import {ServiceOrderForm} from "@order/presentation/form/service.order.form";
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";
import {ClientState} from "@client/infrastructure/state/client/client.state";
import {LanguageCodeEnum} from "@utility/domain/enum";
import {AlertController} from "@ionic/angular";
import {IOrderDto} from "@src/core/business-logic/order/interface/details/i.order.dto";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {OrderActions} from "@order/infrastructure/state/order/order.actions";

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
							(deleteMe)="deleteItem(item._id)"
							(saveChanges)="saveChanges(item.control)"
							[item]="item"
							[setupPartialData]="item.setupPartialData"/>
					}
				}
			</div>
		</div>
	`
})
export class ListServiceFormCardOrderComponent extends Reactive implements OnChanges {

	public readonly order = input.required<IOrderDto>();

	public readonly specificOrderServiceId = input<string | null>(null);

	public readonly idPrefix = input('');

	@HostBinding()
	public class = 'flex-col justify-start items-start flex';

	public readonly selectedServicePlusControlList: {
		_id: string;
		service: IServiceDto;
		control: ServiceOrderForm;
		setupPartialData: {
			defaultAppointmentStartDateTimeIso: string;
			defaultMemberForService: RIMember;
		};
	}[] = [];

	@SelectSnapshot(ClientState.baseLanguage)
	public readonly baseLanguage!: LanguageCodeEnum;

	readonly #ngxLogger = inject(NGXLogger);
	readonly #translateService = inject(TranslateService);
	readonly #changeDetectorRef = inject(ChangeDetectorRef);
	readonly #alertController = inject(AlertController);

	public ngOnChanges() {
		this.selectedServicePlusControlList.length = 0;
		this.order().services.forEach((orderServiceDto) => {
			this.selectedServicePlusControlList.push({
				_id: orderServiceDto._id,
				service: orderServiceDto.serviceSnapshot,
				control: ServiceOrderForm.create(orderServiceDto),
				setupPartialData: {
					defaultAppointmentStartDateTimeIso: orderServiceDto.orderAppointmentDetails.start,
					defaultMemberForService: orderServiceDto?.orderAppointmentDetails?.specialists?.[0]?.member
				}
			});
		});
		this.#changeDetectorRef.detectChanges();
	}

	public async deleteItem(orderServiceId: string) {
		this.#ngxLogger.info('deleteItem', orderServiceId);
		const isLastServiceInOrder = this.selectedServicePlusControlList.length === 1;
		const confirmed = await this.confirmToDelete(isLastServiceInOrder);

		if (!confirmed) {
			return;
		}

		const index = this.selectedServicePlusControlList.findIndex(({_id}) => _id === orderServiceId);
		this.selectedServicePlusControlList.splice(index, 1);

		if (isLastServiceInOrder) {
			this.deleteOrder();
		} else {
			this.deleteServiceOrderAt(orderServiceId);
		}

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
		const {data, role} = await modal.onDidDismiss();
		return role === 'confirm';
	}

	protected saveChanges(control: ServiceOrderForm) {
		this.#ngxLogger.info('saveChanges', control.getRawValue());

		const orderServiceDto = control.getRawValue();
		this.saveNewChanges({
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
	protected saveNewChanges(item: IOrderDto): OrderActions.UpdateItem {
		return new OrderActions.UpdateItem(item);
	}

	@Dispatch()
	protected deleteOrder() {
		return new OrderActions.DeleteItem(this.order()._id);
	}

	protected deleteServiceOrderAt(orderServiceId: string) {
		this.saveNewChanges({
			...this.order(),
			services: this.order().services.filter(({_id}) => _id !== orderServiceId),
		});
	}
}
