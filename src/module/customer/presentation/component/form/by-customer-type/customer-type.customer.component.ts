import {Component, HostBinding, inject, Input, OnInit, ViewEncapsulation} from '@angular/core';
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
import {CurrencyPipe, NgClass, NgForOf, NgSwitch, NgSwitchCase} from "@angular/common";
import {NgSelectModule} from "@ng-select/ng-select";
import {DefaultLabelDirective} from "@utility/presentation/directives/label/default.label.directive";
import {CustomerTypeEnum} from "@customer/domain/enum/customer-type.enum";
import {
	NewCustomerTypeCustomerComponent
} from "@customer/presentation/component/form/by-customer-type/new.customer-type.customer.component";
import {
	RegularCustomerTypeCustomerComponent
} from "@customer/presentation/component/form/by-customer-type/regular.customer-type.customer.component";
import {
	AnonymousCustomerTypeCustomerComponent
} from "@customer/presentation/component/form/by-customer-type/anonymous.customer-type.customer.component";
import {
	UnregisteredCustomerTypeCustomerComponent
} from "@customer/presentation/component/form/by-customer-type/unregistered.customer-type.customer.component";
import {CustomerForm} from "@customer/presentation/form";

@Component({
	selector: 'app-customer-type-customer-component',
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
		NgSwitchCase,
		NewCustomerTypeCustomerComponent,
		RegularCustomerTypeCustomerComponent,
		AnonymousCustomerTypeCustomerComponent,
		UnregisteredCustomerTypeCustomerComponent
	],
	standalone: true,
	template: `

        <ng-content select="[slot='label']"/>

        <div class="flex flex-wrap gap-4">
            <ng-container *ngFor="let customerType of customerTypes">
                <button
                        (click)="setCustomerType(customerType.value)"
                        type="button"
                        [ngClass]="{'bg-blue-500 border-blue-600 text-white': isCustomerTypeSelected(customerType.value)}"
                        class="rounded-xl border border-beeColor-200 px-3 text-center py-1.5 dark:bg-beeDarkColor-800 dark:border-beeDarkColor-700 dark:text-white hover:bg-blue-300 active:bg-blue-500">
                    {{ customerType.name }}
                </button>
            </ng-container>
        </div>

        <ng-container [ngSwitch]="form.value.customerType">

            <ng-content *ngSwitchCase="customerTypeEnum.new" select="[slot='banner'][customer-type='new']"/>
            <ng-content *ngSwitchCase="customerTypeEnum.regular" select="[slot='banner'][customer-type='regular']"/>
            <ng-content *ngSwitchCase="customerTypeEnum.anonymous" select="[slot='banner'][customer-type='anonymous']"/>
            <ng-content *ngSwitchCase="customerTypeEnum.unregistered"
                        select="[slot='banner'][customer-type='unregistered']"/>

            <app-new-customer-type-customer [form]="form" *ngSwitchCase="customerTypeEnum.new"/>
            <app-regular-customer-type-customer [form]="form" *ngSwitchCase="customerTypeEnum.regular"/>
            <app-anonymous-customer-type-customer [form]="form" *ngSwitchCase="customerTypeEnum.anonymous"/>
            <app-unregistered-customer-type-customer [form]="form" *ngSwitchCase="customerTypeEnum.unregistered"/>

        </ng-container>

    `
})
export class CustomerTypeCustomerComponent implements OnInit {

	@Input()
	public form!: CustomerForm;

	@HostBinding()
	public readonly class = 'flex flex-col gap-4'

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

		this.ngxLogger.info('CustomerTypeCustomerComponent.ngOnInit()');

	}

	public setCustomerType(customerType: CustomerTypeEnum): void {

		this.ngxLogger.info('CustomerTypeCustomerComponent.setCustomerType()', {customerType});

		this.form.reset();
		this.form.controls.customerType.setValue(customerType);
	}

	public isCustomerTypeSelected(customerType: CustomerTypeEnum): boolean {

		return this.form.controls.customerType.value === customerType;
	}

}
