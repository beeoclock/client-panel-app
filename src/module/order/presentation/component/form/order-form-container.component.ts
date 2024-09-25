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
import {IOrderDto} from "@order/external/interface/details/i.order.dto";
import {Store} from "@ngxs/store";
import {NGXLogger} from "ngx-logger";
import {CreateOrderForm} from "@order/presentation/form/create.order.form";
import {IPaymentDto} from "@module/payment/domain/interface/dto/i.payment.dto";
import {
	PaymentOrderFormContainerComponent
} from "@order/presentation/component/form/payment.order-form-container.component";
import {OrderActions} from "@order/state/order/order.actions";
import {CreateOrderApiAdapter} from "@order/external/adapter/api/create.order.api.adapter";
import {CreatePaymentApiAdapter} from "@module/payment/external/adapter/api/create.payment.api.adapter";
import {RIMember} from "@member/domain";
import {Reactive} from "@utility/cdk/reactive";
import {ICustomer} from "@customer/domain";
import {
	ListServiceFormOrderComponent
} from "@src/component/smart/order/form/service/list/list.service.form.order.component";
import {FormsModule} from "@angular/forms";
import {lastValueFrom} from "rxjs";
import {PaymentActions} from "@module/payment/state/payment/payment.actions";

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
					[isDisabled]="form.disabled || (!appListServiceFormOrderComponent.serviceOrderFormArray.length)"
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
		defaultMemberForService?: RIMember;
	}>({});
	public readonly orderDto = input<Partial<IOrderDto>>({});
	public readonly paymentDto = input<Partial<IPaymentDto>>({});
	public readonly isEditMode = input<boolean>(false);
	public readonly firstStepOnInit = input<{
		openServiceForm: boolean;
		serviceFormWasOpened: boolean;
	}>({
		openServiceForm: true,
		serviceFormWasOpened: false
	});

	// TODO: add input of callback and call it on save

	public readonly form: CreateOrderForm = new CreateOrderForm();

	private readonly store = inject(Store);
	private readonly ngxLogger = inject(NGXLogger);
	private readonly changeDetectorRef = inject(ChangeDetectorRef);

	private readonly createOrderApiAdapter = inject(CreateOrderApiAdapter);
	private readonly createPaymentApiAdapter = inject(CreatePaymentApiAdapter);

	public readonly availableCustomersInForm = signal<{ [key: string]: ICustomer }>({});

	public ngOnChanges(changes: SimpleChanges & {
		orderDto: SimpleChange;
		paymentDto: SimpleChange;
		isEditMode: SimpleChange;
	}) {

		const {orderDto, paymentDto} = changes;
		orderDto && this.patchOrderValue(orderDto);
		paymentDto && this.form.controls.payment.patchValue(paymentDto.currentValue);
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
		if (this.form.valid) await this.finishSave();
		if (this.form.invalid) this.ngxLogger.error('Form is invalid', this.form);
	}

	/**
	 * Dispatch put order action
	 * @param item
	 * @private
	 */
	private dispatchPutOrderAction$(item: IOrderDto) {
		const action = new OrderActions.PutItem({
			item
		});
		return this.store.dispatch(action);
	}

	/**
	 * Dispatch put payment action
	 * @param item
	 * @private
	 */
	private dispatchPutPaymentAction$(item: IPaymentDto) {
		const action = new PaymentActions.PutItem({
			item
		});
		return this.store.dispatch(action);
	}

	private async finishSave() {
		const {order, payment} = this.form.value as { order: IOrderDto, payment: IPaymentDto };
		this.form.disable();
		this.form.markAsPending();
		if (this.isEditMode()) {

			await lastValueFrom(this.dispatchPutPaymentAction$(payment));
			await lastValueFrom(this.dispatchPutOrderAction$(order));

		} else {

			try {

				// TODO: Refactoring it into state actions
				const createOrderResponse = await this.createOrderApiAdapter.executeAsync(order as IOrderDto);
				this.ngxLogger.info('Order created', createOrderResponse);

				payment.orderId = createOrderResponse._id;

				if (payment.orderId) {
					const createPaymentResponse = await this.createPaymentApiAdapter.executeAsync(payment as IPaymentDto);
					this.ngxLogger.info('Payment created', createPaymentResponse);
				}

			} catch (error) {

				this.ngxLogger.error('Error while creating order', error);

			}

		}

		this.form.enable();
		this.form.updateValueAndValidity();

		this.store.dispatch(new OrderActions.CloseForm());
	}

	public override ngOnDestroy() {
		super.ngOnDestroy();
		this.form.destroyHandlers();
		this.form.controls.payment.controls.payer.destroyHandlers();
	}

	private patchOrderValue(orderDto: SimpleChange) {
		const {currentValue} = orderDto as { currentValue: IOrderDto };
		this.form.controls.order.patchValue(currentValue);
		currentValue.services?.forEach((service) => {
			this.form.controls.order.controls.services.pushNewOne(service);
		});
		this.changeDetectorRef.detectChanges();
	}

	private updatePaymentFormWithOrderDto(orderDto: Partial<IOrderDto>) {

		if (!orderDto) {
			return;
		}

		if (orderDto._id) this.form.controls.payment.controls.orderId.patchValue(orderDto._id);

	}

}
