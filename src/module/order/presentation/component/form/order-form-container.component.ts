import {Component, inject, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
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
    PayerOrderFormContainerComponent
} from "@order/presentation/component/form/payer.order-form-container.component";
import {
    ServiceOrderFormContainerComponent
} from "@order/presentation/component/form/service.order-form-container.component";
import {OrderActions} from "@order/state/order/order.actions";
import {CreateOrderApiAdapter} from "@order/external/adapter/api/create.order.api.adapter";
import {CreatePaymentApiAdapter} from "@module/payment/external/adapter/api/create.payment.api.adapter";

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
        PayerOrderFormContainerComponent,
        ServiceOrderFormContainerComponent
    ],
    standalone: true,
    template: `
        <form class="flex flex-col gap-4">

            <app-service-order-form-container [form]="form.controls.order"/>
            <app-payer-order-form-container [form]="form.controls.payment"/>
            <app-payment-order-form-container [form]="form" />
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
export class OrderFormContainerComponent implements OnInit, OnDestroy {

    @Input()
    public orderDto!: IOrderDto;

    @Input()
    public paymentDto!: IPaymentDto;

    public readonly form: CreateOrderForm = new CreateOrderForm();

    private readonly store = inject(Store);
    private readonly ngxLogger = inject(NGXLogger);
    private readonly createOrderApiAdapter = inject(CreateOrderApiAdapter);
    private readonly createPaymentApiAdapter = inject(CreatePaymentApiAdapter);

    public ngOnInit(): void {
        this.form.controls.order.patchValue(this.orderDto);
        this.form.controls.payment.patchValue(this.paymentDto);
        this.form.updateValueAndValidity();
    }

    public async save(): Promise<void> {
        this.form.markAllAsTouched();
        this.form.valid && await this.finishSave();
        this.form.invalid && this.ngxLogger.error('Form is invalid', this.form);
    }

    private async finishSave() {
        const {order, payment} = this.form.value as { order: IOrderDto, payment: IPaymentDto };
        console.log({order, payment});
        this.form.disable();
        this.form.markAsPending();
        // TODO
        const createOrderResponse = await this.createOrderApiAdapter.executeAsync(order as IOrderDto);
        payment.orderId = createOrderResponse._id;
        const createPaymentResponse = await this.createPaymentApiAdapter.executeAsync(payment as IPaymentDto);

        console.log(createPaymentResponse);

        this.form.enable();
        this.form.updateValueAndValidity();

        this.store.dispatch(new OrderActions.CloseForm());
    }

    public ngOnDestroy() {
        this.form.destroyHandlers();
        this.form.controls.payment.controls.payer.destroyHandlers();
    }

}
