import {Component, HostBinding, inject, input, OnInit, ViewEncapsulation} from '@angular/core';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NGXLogger} from "ngx-logger";
import {NgClass, NgForOf, NgSwitch, NgSwitchCase} from "@angular/common";
import {NgSelectModule} from "@ng-select/ng-select";
import {CustomerTypeEnum} from "@core/business-logic/customer/enum/customer-type.enum";
import {
	NewCustomerTypeCustomerComponent
} from "@tenant/customer/presentation/ui/component/form/by-customer-type/new.customer-type.customer.component";
import {
	RegularCustomerTypeCustomerComponent
} from "@tenant/customer/presentation/ui/component/form/by-customer-type/regular.customer-type.customer.component";
import {
	AnonymousCustomerTypeCustomerComponent
} from "@tenant/customer/presentation/ui/component/form/by-customer-type/anonymous.customer-type.customer.component";
import {
	UnregisteredCustomerTypeCustomerComponent
} from "@tenant/customer/presentation/ui/component/form/by-customer-type/unregistered.customer-type.customer.component";
import {CustomerForm} from "@tenant/customer/presentation/form";

@Component({
	selector: 'app-customer-type-customer-component',
	encapsulation: ViewEncapsulation.None,
	imports: [
		TranslateModule,
		FormsModule,
		NgSelectModule,
		ReactiveFormsModule,
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

        <div class="bg-white flex gap-4 py-2 sticky top-0 z-10">
            <ng-container *ngFor="let customerType of customerTypes">
                <button
					type="button"
					class="rounded-xl border border-beeColor-200 px-3 text-center py-1.5 dark:bg-beeDarkColor-800 dark:border-beeDarkColor-700 dark:text-white hover:bg-blue-300 active:bg-blue-500"
                        (click)="setCustomerType(customerType.value)"
						[ngClass]="{'bg-blue-500 border-blue-600 text-white': isCustomerTypeSelected(customerType.value)}">
                    {{ customerType.name }}
                </button>
            </ng-container>
        </div>

        <ng-container [ngSwitch]="form().value.customerType">

            <ng-content *ngSwitchCase="customerTypeEnum.new" select="[slot='banner'][customer-type='new']"/>
            <ng-content *ngSwitchCase="customerTypeEnum.regular" select="[slot='banner'][customer-type='regular']"/>
            <ng-content *ngSwitchCase="customerTypeEnum.anonymous" select="[slot='banner'][customer-type='anonymous']"/>
            <ng-content *ngSwitchCase="customerTypeEnum.unregistered"
                        select="[slot='banner'][customer-type='unregistered']"/>

            <app-new-customer-type-customer [form]="form()" *ngSwitchCase="customerTypeEnum.new"/>
            <app-regular-customer-type-customer [form]="form()" *ngSwitchCase="customerTypeEnum.regular" [showList]="showList()"/>
            <app-anonymous-customer-type-customer [form]="form()" *ngSwitchCase="customerTypeEnum.anonymous"/>
            <app-unregistered-customer-type-customer [form]="form()" *ngSwitchCase="customerTypeEnum.unregistered"/>

        </ng-container>

    `
})
export class CustomerTypeCustomerComponent implements OnInit {

	public readonly form = input.required<CustomerForm>();

	public readonly showList = input(false);

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

		this.form().reset();
		this.form().controls.customerType.setValue(customerType);
	}

	public isCustomerTypeSelected(customerType: CustomerTypeEnum): boolean {

		return this.form().controls.customerType.value === customerType;
	}

}
