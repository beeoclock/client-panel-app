import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	HostBinding,
	inject,
	Input,
	OnInit,
	ViewEncapsulation
} from "@angular/core";
import {
	ItemV2ListServiceFormOrderComponent
} from "@src/component/smart/order/form/service/list/item/item-v2.list.service.form.order.component";
import {PrimaryLinkButtonDirective} from "@utility/presentation/directives/button/primary.link.button.directive";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {NGXLogger} from "ngx-logger";
import {Reactive} from "@utility/cdk/reactive";
import {NgForOf} from "@angular/common";
import {IServiceDto} from "@order/external/interface/i.service.dto";
import {RIMember} from "@member/domain";
import {ServiceOrderForm} from "@order/presentation/form/service.order.form";
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";
import {ClientState} from "@client/state/client/client.state";
import {LanguageCodeEnum} from "@utility/domain/enum";
import {AlertController} from "@ionic/angular";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {OrderActions} from "@order/state/order/order.actions";

@Component({
	standalone: true,
	selector: 'app-list-service-form-card-order-component',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	imports: [
		ItemV2ListServiceFormOrderComponent,
		PrimaryLinkButtonDirective,
		TranslateModule,
		NgForOf
	],
	template: `
		<div class="flex-col justify-start items-start flex">
			<div class="bg-white flex-col justify-start items-start flex divide-y border border-gray-200 rounded-2xl">
				@for (item of selectedServicePlusControlList; track item._id; let index = $index) {
					<app-item-list-v2-service-form-order-component
						[id]="idPrefix + item._id"
						(deleteMe)="deleteItem(index)"
						(saveChanges)="saveChanges(item.control)"
						[item]="item"
						[setupPartialData]="item.setupPartialData"/>
				}
			</div>
		</div>
	`
})
export class ListServiceFormCardOrderComponent extends Reactive implements OnInit {

	@Input({required: true})
	public order!: IOrderDto;

	@Input()
	public idPrefix = '';

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

	public ngOnInit() {
		this.#ngxLogger.info('ListServiceFormCardOrderComponent', this.order);
		this.order.services.forEach((orderServiceDto) => {
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

	public async deleteItem(index: number) {
		this.#ngxLogger.info('deleteItem', index);
		const isLastServiceInOrder = this.selectedServicePlusControlList.length === 1;
		const confirmed = await this.confirmToDelete(isLastServiceInOrder);

		if (!confirmed) {
			return;
		}

		this.selectedServicePlusControlList.splice(index, 1);

		isLastServiceInOrder && this.deleteOrder();
		!isLastServiceInOrder && this.deleteServiceOrderAt(index);

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
			...this.order,
			services: this.order.services.map((service) => {
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
		return new OrderActions.DeleteItem(this.order._id);
	}

	protected deleteServiceOrderAt($event: number) {
		this.saveNewChanges({
			...this.order,
			services: this.order.services.filter((_, index) => index !== $event),
		});
	}
}