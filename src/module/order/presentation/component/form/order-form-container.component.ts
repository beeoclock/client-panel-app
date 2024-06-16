import {
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
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {DatetimeLocalInputComponent} from "@utility/presentation/component/input/datetime-local.input.component";
import {TranslateModule} from "@ngx-translate/core";
import {FormTextareaComponent} from "@utility/presentation/component/input/form.textarea.component";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {
	FormBusinessProfileComponent
} from "@client/presentation/component/business-profile/form-business-profile.component";
import {SwitchComponent} from "@utility/presentation/component/switch/switch.component";
import {
	ButtonSaveContainerComponent
} from "@utility/presentation/component/container/button-save/button-save.container.component";
import {FormsModule} from "@angular/forms";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";
import {Store} from "@ngxs/store";
import {NGXLogger} from "ngx-logger";
import {CreateOrderForm} from "@order/presentation/form/create.order.form";
import {IPaymentDto} from "@module/payment/domain/interface/dto/i.payment.dto";
import {
	PaymentOrderFormContainerComponent
} from "@order/presentation/component/form/payment.order-form-container.component";
import {
	ServiceOrderFormContainerComponent
} from "@order/presentation/component/form/service.order-form-container.component";
import {OrderActions} from "@order/state/order/order.actions";
import {CreateOrderApiAdapter} from "@order/external/adapter/api/create.order.api.adapter";
import {CreatePaymentApiAdapter} from "@module/payment/external/adapter/api/create.payment.api.adapter";
import {RIMember} from "@member/domain";
import {Reactive} from "@utility/cdk/reactive";
import {ICustomer} from "@customer/domain";
import {UpdateOrderApiAdapter} from "@order/external/adapter/api/update.order.api.adapter";
import {UpdatePaymentApiAdapter} from "@module/payment/external/adapter/api/update.payment.api.adapter";
import {
	CustomerTypeCustomerComponent
} from "@customer/presentation/component/form/by-customer-type/customer-type.customer.component";

@Component({
	selector: 'app-order-form-container',
	encapsulation: ViewEncapsulation.None,
	imports: [
		FormInputComponent,
		DatetimeLocalInputComponent,
		TranslateModule,
		FormTextareaComponent,
		CardComponent,
		FormBusinessProfileComponent,
		SwitchComponent,
		ButtonSaveContainerComponent,
		FormsModule,
		PrimaryButtonDirective,
		PaymentOrderFormContainerComponent,
		ServiceOrderFormContainerComponent,
		CustomerTypeCustomerComponent
	],
	standalone: true,
	template: `
		<form class="flex flex-col gap-4">

			<app-service-order-form-container [form]="form.controls.order" [setupPartialData]="setupPartialData()"/>
			<bee-card>
				<app-customer-type-customer-component
					[form]="form.controls.payment.controls.payer">
					<div class="font-bold" slot="label">{{ 'keyword.capitalize.payer' | translate }}</div>
					<div slot="banner" customer-type="new"
						 class="bg-beeColor-100 border-2 px-3 py-2 rounded-lg text-beeColor-600 text-sm flex flex-col">
						<div class="font-bold">
							<i class="bi bi-exclamation-triangle-fill"></i>
							{{ 'keyword.capitalize.warning' | translate }}
						</div>
						<div>
							{{ 'order.form.payment.payer.case.new.hint' | translate }}
						</div>
					</div>

					<div slot="banner" customer-type="unregistered"
						 class="bg-beeColor-100 border-2 px-3 py-2 rounded-lg text-beeColor-600 text-sm flex flex-col">
						<div class="font-bold">
							<i class="bi bi-exclamation-triangle-fill"></i>
							{{ 'keyword.capitalize.warning' | translate }}
						</div>
						<div>
							{{ 'order.form.payment.payer.case.unregistered.hint' | translate }}
						</div>
					</div>
				</app-customer-type-customer-component>
			</bee-card>
			<app-payment-order-form-container [form]="form"/>
			<bee-card>
				<form-textarea-component
					id="order-business-note"
					[label]="'keyword.capitalize.note' | translate"
					[placeholder]="'event.form.section.additional.input.note.placeholder' | translate"
					[control]="form.controls.order.controls.businessNote"/>
			</bee-card>

			<utility-button-save-container-component class="bottom-0">
				<button
					type="button"
					primary
					[isLoading]="form.pending"
					[disabled]="form.disabled"
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

	// TODO: add input of callback and call it on save

	public readonly form: CreateOrderForm = new CreateOrderForm();

	private readonly store = inject(Store);
	private readonly ngxLogger = inject(NGXLogger);

	private readonly createOrderApiAdapter = inject(CreateOrderApiAdapter);
	private readonly createPaymentApiAdapter = inject(CreatePaymentApiAdapter);

	private readonly updateOrderApiAdapter = inject(UpdateOrderApiAdapter);
	private readonly updatePaymentApiAdapter = inject(UpdatePaymentApiAdapter);

	public readonly availableCustomersInForm = signal<{ [key: string]: ICustomer }>({});

	public ngOnChanges(changes: SimpleChanges & {
		orderDto: SimpleChange;
		paymentDto: SimpleChange;
		isEditMode: SimpleChange;
	}) {

		const {orderDto, paymentDto} = changes;
		orderDto && this.patchOrderValue(orderDto);
		paymentDto && this.form.controls.payment.patchValue(paymentDto.currentValue);
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
		this.form.valid && await this.finishSave();
		this.form.invalid && this.ngxLogger.error('Form is invalid', this.form);
	}

	private async finishSave() {
		const {order, payment} = this.form.value as { order: IOrderDto, payment: IPaymentDto };
		this.form.disable();
		this.form.markAsPending();
		if (this.isEditMode()) {

			await this.updateOrderApiAdapter.executeAsync(order as IOrderDto);
			await this.updatePaymentApiAdapter.executeAsync(payment as IPaymentDto);

		} else {

			// TODO check for error response from order
			const createOrderResponse = await this.createOrderApiAdapter.executeAsync(order as IOrderDto);
			this.ngxLogger.info('Order created', createOrderResponse);

			payment.orderId = createOrderResponse._id;

			if (payment.orderId) {
				const createPaymentResponse = await this.createPaymentApiAdapter.executeAsync(payment as IPaymentDto);
				this.ngxLogger.info('Payment created', createPaymentResponse);
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
	}

}
