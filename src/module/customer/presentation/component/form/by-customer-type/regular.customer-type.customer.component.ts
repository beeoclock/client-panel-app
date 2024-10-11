import {Component, HostBinding, inject, Input, ViewEncapsulation} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {NgIf} from "@angular/common";
import {PrimaryLinkButtonDirective} from "@utility/presentation/directives/button/primary.link.button.directive";
import {WhacAMoleProvider} from "@utility/presentation/whac-a-mole/whac-a-mole.provider";
import {Reactive} from "@utility/cdk/reactive";
import {CustomerForm} from "@customer/presentation/form";
import {CustomerExternalListComponent} from "@customer/presentation/component/external/list/list.component";
import {SelectCustomerPushBoxComponent} from "@customer/presentation/push-box/select-customer.push-box.component";
import {ICustomer} from "@customer/domain";
import {IconComponent} from "@src/component/adapter/icon/icon.component";

@Component({
	selector: 'app-regular-customer-type-customer',
	encapsulation: ViewEncapsulation.None,
	imports: [
		NgIf,
		TranslateModule,
		PrimaryLinkButtonDirective,
		CustomerExternalListComponent,
		SelectCustomerPushBoxComponent,
		IconComponent
	],
	standalone: true,
	template: `
		<customer-select-customer-whac-a-mole-component
			*ngIf="showList"
			(selectedCustomerListener)="selectCustomer($event[0])"
			[style.max-width.px]="350"
			[multiple]="multiple"/>

		<ng-container *ngIf="!showList">

			<ng-container *ngIf="getCustomer() as customer">
				<div class="rounded-lg border border-gray-200 grid grid-cols-1 py-2 px-3 text-sm leading-6">
					<div>{{ customer.firstName }} {{ customer.lastName }} </div>
					<div>{{ customer.email }}</div>
					<div>{{ customer.phone }}</div>
				</div>
			</ng-container>

			<div class="block">
				<button type="button" primaryLink (click)="openContainerToSelectCustomer()">
					<app-icon name="bootstrapListCheck"/>
					{{ 'event.form.section.attendant.button.select' | translate }}
				</button>
			</div>

		</ng-container>

	`
})
export class RegularCustomerTypeCustomerComponent extends Reactive {

	@Input()
	public form!: CustomerForm;

	@Input()
	public multiple = false;

	@Input()
	public showList = false;

	@HostBinding()
	public readonly class = 'flex flex-col gap-2'

	private readonly whacAMaleProvider = inject(WhacAMoleProvider);

	public getCustomer() {
		if (!this.form.value) {
			return null;
		}
		if (!this.form.value.firstName) {
			return null;
		}
		return this.form.value;
	}

	public selectCustomer(customer: ICustomer) {
		this.form.patchValue(customer);
	}

	public async openContainerToSelectCustomer() {
		const {SelectCustomerPushBoxComponent} = await import("@customer/presentation/push-box/select-customer.push-box.component");

		const pushBoxWrapperComponentRef = await this.whacAMaleProvider.buildItAsync({
			component: SelectCustomerPushBoxComponent,
			componentInputs: {
				multiple: false,
				selectedCustomerList: [this.form.value]
			}
		});

		if (!pushBoxWrapperComponentRef) {
			return;
		}

		const {renderedComponentRef} = pushBoxWrapperComponentRef.instance;

		if (renderedComponentRef?.instance instanceof SelectCustomerPushBoxComponent) {
			renderedComponentRef.instance.selectedCustomerListener.pipe(this.takeUntil()).subscribe(async () => {

				const {newSelectedCustomerList} = renderedComponentRef.instance;

				this.selectCustomer(newSelectedCustomerList[0]);

				await this.whacAMaleProvider.destroyComponent(SelectCustomerPushBoxComponent);
			});
		}

	}

}
