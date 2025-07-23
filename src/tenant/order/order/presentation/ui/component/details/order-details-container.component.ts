import {afterNextRender, Component, DestroyRef, effect, inject, input, signal, ViewEncapsulation} from '@angular/core';
import {Store} from "@ngxs/store";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {OrderActions} from "@tenant/order/order/infrastructure/state/order/order.actions";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {
	ListServiceFormCardOrderComponent
} from "@tenant/order/order/presentation/ui/component/list/card/item/services/list.service.form.card.order.component";
import {PaymentStatusEnum} from "@tenant/order/payment/domain/enum/payment.status.enum";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {IPayment} from "@tenant/order/payment/domain/interface/i.payment";
import {StandardDetailsEntityComponent} from "@shared/presentation/component/entity/standard-details.entity.component";
import EOrder, {statusColorMap} from "@tenant/order/order/domain/entity/e.order";
import {BusinessNoteComponent} from "@tenant/event/presentation/ui/component/details/component/business-note.component";
import {
	OrderStatusChipComponent
} from "@tenant/order/order/presentation/ui/component/details/change-status/order-status.chip.component";
import {OrderStatusEnum} from "@tenant/order/order/domain/enum/order.status.enum";
import {FormControl} from "@angular/forms";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {AlertController} from "@ionic/angular/standalone";
import {distinctUntilChanged} from 'rxjs';

@Component({
	selector: 'order-detail-page',
	templateUrl: './order-details-container.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		TranslateModule,
		ListServiceFormCardOrderComponent,
		StandardDetailsEntityComponent,
		BusinessNoteComponent,
		OrderStatusChipComponent,
	],
	standalone: true
})
export class OrderDetailsContainerComponent {

	// TODO add base index of details with store and delete method

	public readonly item = input.required<EOrder>();

	public readonly payment = signal<IPayment.DTO | null>(null);

	public readonly orderStatusControl = new FormControl<OrderStatusEnum>(OrderStatusEnum.draft, {
		nonNullable: true,
	})
	public readonly idPrefix = 'order-details-container';

	public readonly destroyRef = inject(DestroyRef);
	public readonly store = inject(Store);
	public readonly sharedUow = inject(SharedUow);
	public readonly alertController = inject(AlertController);
	public readonly translateService = inject(TranslateService);

	private alreadyAskingAboutNewOrderStatus = false;

	public constructor() {
		effect(() => {
			this.preparePayment().then();
		});
		afterNextRender(() => {
			this.orderStatusControl.setValue(this.item()?.status ?? this.orderStatusControl.value);
			this.orderStatusControl.valueChanges.pipe(
				takeUntilDestroyed(this.destroyRef),
				distinctUntilChanged(),
			).subscribe((status) => {
				this.changeStatus(status);
			})
		})
	}

	public get statusColor() {
		return statusColorMap[this.orderStatusControl.getRawValue()];
	}

	private confirm(): Promise<boolean> {
		return new Promise((resolve) => {
			this.alertController.create({
				header: this.translateService.instant('keyword.capitalize.confirm'),
				message: this.translateService.instant('order.confirmation.change-status.message'),
				buttons: [
					{
						text: this.translateService.instant('keyword.capitalize.cancel'),
						role: 'cancel',
						handler: () => resolve(false)
					},
					{
						text: this.translateService.instant('keyword.capitalize.yes'),
						handler: () => resolve(true)
					}
				]
			}).then((alert) => alert.present());
		});
	}

	private async changeStatus(status: OrderStatusEnum) {
		if (this.alreadyAskingAboutNewOrderStatus) return;
		this.alreadyAskingAboutNewOrderStatus = true;
		const answer = await this.confirm();
		if (!answer) {
			this.orderStatusControl.patchValue(this.item()?.status ?? OrderStatusEnum.draft);
			this.alreadyAskingAboutNewOrderStatus = false;
			return;
		}
		this.store.dispatch(
			new OrderActions.ChangeStatus({
				item: this.item(),
				status
			})
		);
		this.alreadyAskingAboutNewOrderStatus = false;
	}

	private async preparePayment() {

		const item = this.item();
		if (!item) {
			return;
		}

		const {items: {0: payment}} = await this.sharedUow.payment.repository.findAsync({
			orderId: item._id,
			page: 1,
			pageSize: 1,
			orderBy: OrderByEnum.CREATED_AT,
			orderDir: OrderDirEnum.DESC,
		});

		this.payment.set(payment);

	}

	public openForm() {
		if (!this.item()) {
			return;
		}
		const action = new OrderActions.OpenFormToEditById(this.item()?._id);
		this.store.dispatch(action);
	}

	protected readonly paymentStatusEnum = PaymentStatusEnum;
}

export default OrderDetailsContainerComponent;
