import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	inject,
	input,
	OnChanges,
	OnDestroy,
	OnInit,
	signal,
	SimpleChange,
	SimpleChanges,
	ViewEncapsulation
} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {FormTextareaComponent} from "@utility/presentation/component/input/form.textarea.component";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {
	ButtonSaveContainerComponent
} from "@utility/presentation/component/container/button-save/button-save.container.component";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {Store} from "@ngxs/store";
import {NGXLogger} from "ngx-logger";
import {CreateOrderForm} from "@[tenant]/order/presentation/form/create.order.form";
import {
	PaymentOrderFormContainerComponent
} from "@[tenant]/order/presentation/ui/component/form/payment.order-form-container.component";
import {OrderActions} from "@[tenant]/order/presentation/state/order/order.actions";
import {Reactive} from "@utility/cdk/reactive";
import {ICustomer} from "@core/business-logic/customer";
import {
	ListServiceFormOrderComponent
} from "@src/component/smart/order/form/service/list/list.service.form.order.component";
import {FormsModule} from "@angular/forms";
import {firstValueFrom, lastValueFrom} from "rxjs";
import {PaymentActions} from "@[tenant]/payment/infrastructure/state/payment/payment.actions";
import {WhacAMoleProvider} from "@utility/presentation/whac-a-mole/whac-a-mole.provider";
import {
	AdditionalMenuComponent
} from "@[tenant]/event/presentation/ui/component/additional-menu/additional-menu.component";
import {
	CalendarWithSpecialistsAction
} from "@[tenant]/event/presentation/state/calendar-with-specialists/calendar-with-specialists.action";
import {IPayment} from "@core/business-logic/payment/interface/i.payment";
import {IService} from "@core/business-logic/service/interface/i.service";
import {IOrder} from "@core/business-logic/order/interface/i.order";
import {IMember} from "@core/business-logic/member/interface/i.member";

@Component({
	selector: 'app-order-form-container',
	encapsulation: ViewEncapsulation.None,
	imports: [
		ListServiceFormOrderComponent,
		ButtonSaveContainerComponent,
		PrimaryButtonDirective,
		TranslateModule,
		CardComponent,
		FormTextareaComponent,
		PaymentOrderFormContainerComponent,
		FormsModule,
	],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<form class="flex flex-col gap-4 bg-white">

			<app-list-service-form-order-component
				#appListServiceFormOrderComponent
				[serviceOrderFormArray]="form.controls.order.controls.services"
				[setupPartialData]="setupPartialData()"
				class="flex-1"/>

			<app-payment-order-form-container [form]="form"/>
			<bee-card>
				<form-textarea-component
					id="order-business-note"
					[label]="'keyword.capitalize.businessNote' | translate"
					[placeholder]="'order.form.input.businessNote.placeholder' | translate"
					[control]="form.controls.order.controls.businessNote"/>
			</bee-card>

			<utility-button-save-container-component class="bottom-0">
				<button
					type="button"
					primary
					[isLoading]="form.pending"
					[isDisabled]="form.disabled || (!appListServiceFormOrderComponent.serviceOrderFormArray().length)"
					[scrollToFirstError]="true"
					(click)="save()">
					{{ 'keyword.capitalize.save' | translate }}
				</button>
			</utility-button-save-container-component>
		</form>
	`
})
export class OrderFormContainerComponent extends Reactive implements OnInit, OnDestroy, OnChanges {

	public readonly setupPartialData = input<{
		defaultAppointmentStartDateTimeIso?: string;
		defaultMemberForService?: IMember.EntityRaw;
		serviceList?: IService.DTO[];
		customer?: ICustomer.EntityRaw;
	}>({});
	public readonly orderDto = input<Partial<IOrder.DTO>>({});
	public readonly paymentDto = input<Partial<IPayment.DTO>>({});
	public readonly isEditMode = input<boolean>(false);
	public readonly firstStepOnInit = input<{
		openServiceForm: boolean;
		serviceFormWasOpened: boolean;
	}>({
		openServiceForm: true,
		serviceFormWasOpened: false
	});

	public readonly form: CreateOrderForm = CreateOrderForm.create();

	private readonly store = inject(Store);
	private readonly ngxLogger = inject(NGXLogger);
	private readonly changeDetectorRef = inject(ChangeDetectorRef);

	private readonly whacAMaleProvider = inject(WhacAMoleProvider);

	public readonly availableCustomersInForm = signal<{ [key: string]: ICustomer.DTO }>({});

	public ngOnChanges(changes: SimpleChanges & {
		orderDto: SimpleChange;
		paymentDto: SimpleChange;
		isEditMode: SimpleChange;
	}) {

		const {orderDto, paymentDto} = changes;
		if (orderDto) this.patchOrderValue(orderDto);
		if (paymentDto) this.form.controls.payment.patchValue(paymentDto.currentValue);
		if (this.isEditMode()) {
			this.updatePaymentFormWithOrderDto(orderDto.currentValue);
		}
		this.form.updateValueAndValidity();

	}

	public ngOnInit(): void {
		this.form.controls.order.patchValue(this.orderDto());
		this.form.controls.payment.patchValue(this.paymentDto());
		this.form.updateValueAndValidity();
		this.form.controls.order.valueChanges.pipe(this.takeUntil()).subscribe((value) => {
			value.services?.forEach((service) => {
				service.orderAppointmentDetails?.attendees.forEach((attendee) => {
					this.availableCustomersInForm.set({
						[attendee.customer._id]: attendee.customer,
						...this.availableCustomersInForm()
					})
				});
			});
		});
	}

	public async save(): Promise<void> {
		this.form.markAllAsTouched();
		if (this.form.invalid) {
			this.ngxLogger.error('Form is invalid', this.form)
			return;
		}
		await this.finishSave();
		await this.whacAMaleProvider.destroyComponent(AdditionalMenuComponent);
	}

	/**
	 * Dispatch put order action
	 * @param item
	 * @private
	 */
	private dispatchPutOrderAction$(item: IOrder.DTO) {
		const action = new OrderActions.UpdateItem(item);
		return this.store.dispatch(action);
	}

	/**
	 * Dispatch put payment action
	 * @param item
	 * @private
	 */
	private dispatchPutPaymentAction$(item: IPayment.DTO) {
		const action = new PaymentActions.Update({
			item
		});
		return this.store.dispatch(action);
	}

	private async finishSave() {
		const {order, payment} = this.form.value as { order: IOrder.DTO, payment: IPayment.DTO };
		this.form.disable();
		this.form.markAsPending();

		try {

			if (this.isEditMode()) {

				await lastValueFrom(this.dispatchPutPaymentAction$(payment));
				await lastValueFrom(this.dispatchPutOrderAction$(order));

			} else {

				payment.orderId = order._id;


				const createOrder$ = this.store.dispatch(new OrderActions.CreateItem(order));
				await firstValueFrom(createOrder$);

				const actions$ = this.store.dispatch([
					new PaymentActions.CreateItem(payment),
					new CalendarWithSpecialistsAction.GetItems(),
				]);

				await firstValueFrom(actions$);

			}

			this.store.dispatch(new OrderActions.CloseForm());

		} catch (error) {

			this.ngxLogger.error('Error while creating order', error);

		}

		this.form.enable();
		this.form.updateValueAndValidity();
	}

	public override ngOnDestroy() {
		super.ngOnDestroy();
		this.form.destroyHandlers();
		this.form.controls.payment.controls.payer.destroyHandlers();
	}

	private patchOrderValue(orderDto: SimpleChange) {
		const {currentValue} = orderDto as { currentValue: IOrder.DTO };
		this.form.controls.order.patchValue(currentValue);
		currentValue.services?.forEach((service) => {
			this.form.controls.order.controls.services.pushNewOne(service);
		});
		this.changeDetectorRef.detectChanges();
	}

	private updatePaymentFormWithOrderDto(orderDto: Partial<IOrder.DTO>) {

		if (!orderDto) {
			return;
		}

		if (orderDto._id) this.form.controls.payment.controls.orderId.patchValue(orderDto._id);

	}

}
