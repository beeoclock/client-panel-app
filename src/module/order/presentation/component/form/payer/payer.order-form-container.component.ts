import {Component, inject, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {DatetimeLocalInputComponent} from "@utility/presentation/component/input/datetime-local.input.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {FormTextareaComponent} from "@utility/presentation/component/input/form.textarea.component";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {
    FormBusinessProfileComponent
} from "@client/presentation/component/business-profile/form-business-profile.component";
import {SwitchComponent} from "@utility/presentation/component/switch/switch.component";
import {
    ButtonSaveContainerComponent
} from "@utility/presentation/component/container/button-save/button-save.container.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {NGXLogger} from "ngx-logger";
import {PaymentForm} from "@module/payment/presentation/form/payment.form";
import {CurrencyPipe, NgClass, NgForOf, NgSwitch, NgSwitchCase} from "@angular/common";
import {NgSelectModule} from "@ng-select/ng-select";
import {DefaultLabelDirective} from "@utility/presentation/directives/label/default.label.directive";
import {CustomerTypeEnum} from "@customer/domain/enum/customer-type.enum";
import {
    NewPayerOrderFormContainerComponent
} from "@order/presentation/component/form/payer/by-customer-type/new.payer.order-form-container.component";
import {
    RegularPayerOrderFormContainerComponent
} from "@order/presentation/component/form/payer/by-customer-type/regular.payer.order-form-container.component";
import {
    UnknownPayerOrderFormContainerComponent
} from "@order/presentation/component/form/payer/by-customer-type/unknown.payer.order-form-container.component";
import {
    UnregisteredPayerOrderFormContainerComponent
} from "@order/presentation/component/form/payer/by-customer-type/unregistered.payer.order-form-container.component";

@Component({
    selector: 'app-payer-order-form-container',
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
        CurrencyPipe,
        NgSelectModule,
        ReactiveFormsModule,
        DefaultLabelDirective,
        NgForOf,
        NgClass,
        NgSwitch,
        NewPayerOrderFormContainerComponent,
        NgSwitchCase,
        RegularPayerOrderFormContainerComponent,
        UnknownPayerOrderFormContainerComponent,
        UnregisteredPayerOrderFormContainerComponent
    ],
    standalone: true,
    template: `

        <bee-card>

            <div class="font-bold">{{ 'keyword.capitalize.payer' | translate }}</div>

            <div class="flex flex-wrap gap-4">
                <ng-container *ngFor="let customerType of customerTypes">
                    <button
                            (click)="setCustomerType(customerType.value)"
                            type="button"
                            [ngClass]="{
                                'bg-blue-500 border-blue-600 text-white': isCustomerTypeSelected(customerType.value)
                            }"
                            class="rounded-xl border border-beeColor-200 px-3 text-center py-1.5 dark:bg-beeDarkColor-800 dark:border-beeDarkColor-700 dark:text-white hover:bg-blue-300 active:bg-blue-500">
                        {{ customerType.name }}
                    </button>
                </ng-container>
            </div>

            <ng-container [ngSwitch]="form.controls.payer.value.customerType">

                <app-new-payer-order-form-container [form]="form" *ngSwitchCase="customerTypeEnum.new"/>
                <app-regular-payer-order-form-container [form]="form" *ngSwitchCase="customerTypeEnum.regular"/>
                <app-unknown-payer-order-form-container [form]="form" *ngSwitchCase="customerTypeEnum.unknown"/>
                <app-unregistered-payer-order-form-container [form]="form" *ngSwitchCase="customerTypeEnum.unregistered"/>

            </ng-container>

        </bee-card>

    `
})
export class PayerOrderFormContainerComponent implements OnInit {

    @Input()
    public form!: PaymentForm;

    // TODO: Add customer from services

    // TODO: Allow to select one customer if customer type is CustomerTypeEnum.regular
    // TODO: Show and allow to fill form of new customer if customer type is CustomerTypeEnum.new
    // TODO: Show and allow to fill form of unregistered customer if customer type is CustomerTypeEnum.unregistered

    private readonly ngxLogger = inject(NGXLogger);
    private readonly translateService = inject(TranslateService);

    public readonly customerTypes = Object.values(CustomerTypeEnum).map((value: CustomerTypeEnum) => {
        return {
            value,
            name: this.translateService.instant(`customer.enum.type.${value}`)
        };
    });
    public readonly customerTypeEnum = CustomerTypeEnum;

    public ngOnInit(): void {

        this.ngxLogger.info('PayerOrderFormContainerComponent.ngOnInit()');

    }

    public setCustomerType(customerType: CustomerTypeEnum): void {

        this.ngxLogger.info('PayerOrderFormContainerComponent.setCustomerType()', {customerType});

        this.form.controls.payer.reset();
        this.form.controls.payer.controls.customerType.setValue(customerType);
    }

    public isCustomerTypeSelected(customerType: CustomerTypeEnum): boolean {

        return this.form.controls.payer.controls.customerType.value === customerType;
    }

}
