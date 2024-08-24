import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	HostBinding,
	inject,
	input,
	OnInit,
	output,
	ViewEncapsulation
} from "@angular/core";
import {
	ItemV2ListServiceFormOrderComponent
} from "@src/component/smart/order/form/service/list/item/item-v2.list.service.form.order.component";
import {PrimaryLinkButtonDirective} from "@utility/presentation/directives/button/primary.link.button.directive";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {NGXLogger} from "ngx-logger";
import {WhacAMoleProvider} from "@utility/presentation/whac-a-mole/whac-a-mole.provider";
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
						[id]="item._id"
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

	public readonly order = input.required<IOrderDto>();

	public readonly deleteOrder = output<void>();
	public readonly deleteServiceOrderAt = output<number>();
	public readonly saveOrderServiceChanges = output<IOrderDto>();

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
	readonly #whacAMaleProvider = inject(WhacAMoleProvider);
	readonly #changeDetectorRef = inject(ChangeDetectorRef);
	readonly #alertController = inject(AlertController);

	public ngOnInit() {
		this.order().services.forEach((orderServiceDto) => {
			this.selectedServicePlusControlList.push({
				_id: orderServiceDto._id,
				service: orderServiceDto.serviceSnapshot,
				control: ServiceOrderForm.create(orderServiceDto),
				setupPartialData: {
					defaultAppointmentStartDateTimeIso: orderServiceDto.orderAppointmentDetails.start,
					defaultMemberForService: orderServiceDto.orderAppointmentDetails.specialists[0].member
				}
			});
		});
		this.#changeDetectorRef.detectChanges();
	}

	public async deleteItem(index: number) {
		const isLastServiceInOrder = this.selectedServicePlusControlList.length === 1;
		const confirmed = await this.confirmToDelete(isLastServiceInOrder);

		if (!confirmed) {
			return;
		}

		this.selectedServicePlusControlList.splice(index, 1);

		isLastServiceInOrder && this.deleteOrder.emit();
		!isLastServiceInOrder && this.deleteServiceOrderAt.emit(index);

		this.#changeDetectorRef.detectChanges();

	}

	private async confirmToDelete(isLastServiceInOrder = false) {
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
		const orderServiceDto = control.getRawValue();
		const orderDto = this.order();
		this.saveOrderServiceChanges.emit({
			...orderDto,
			services: orderDto.services.map((service) => {
				if (service._id === orderServiceDto._id) {
					return orderServiceDto;
				}
				return service;
			})
		});
	}
}
