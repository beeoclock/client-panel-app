import {Component, HostBinding, inject, input, ViewEncapsulation} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {PrimaryLinkButtonDirective} from "@shared/presentation/directives/button/primary.link.button.directive";
import {WhacAMoleProvider} from "@shared/presentation/whac-a-mole/whac-a-mole.provider";
import {Reactive} from "@core/cdk/reactive";
import {CustomerForm} from "@tenant/customer/presentation/form";
import {
	SelectCustomerPushBoxComponent
} from "@tenant/customer/presentation/push-box/select-customer.push-box.component";
import {ICustomer} from "@tenant/customer/domain";

@Component({
	selector: 'app-regular-customer-type-customer',
	encapsulation: ViewEncapsulation.None,
	imports: [
		TranslateModule,
		PrimaryLinkButtonDirective,
		SelectCustomerPushBoxComponent
	],
	standalone: true,
	template: `
		@if (showList()) {

			<customer-select-customer-whac-a-mole-component
				(selectedCustomerListener)="selectCustomer($event[0])"
				[style.max-width.px]="350"
				[multiple]="multiple()"/>
		} @else {

			@if (getCustomer(); as customer) {

				<div class="rounded-lg border border-gray-200 grid grid-cols-1 py-2 px-3 text-sm leading-6">

					<div>{{ customer.firstName }} {{ customer.lastName }} </div>
					<div>{{ customer.email }}</div>
					<div>{{ customer.phone }}</div>

				</div>

			}

			<div class="block">
				<button type="button" primaryLink (click)="openContainerToSelectCustomer()">
					<i class="bi bi-list-check"></i>
					{{ 'event.form.section.attendant.button.select' | translate }}
				</button>
			</div>
		}

	`
})
export class RegularCustomerTypeCustomerComponent extends Reactive {

	public readonly form = input.required<CustomerForm>();

	public readonly multiple = input(false);

	public readonly showList = input(false);

	@HostBinding()
	public readonly class = 'flex flex-col gap-2'

	private readonly whacAMaleProvider = inject(WhacAMoleProvider);

	public getCustomer() {
		const form = this.form();
  if (!form.value) {
			return null;
		}
		if (!form.value.firstName) {
			return null;
		}
		return form.value;
	}

	public selectCustomer(customer: ICustomer.DTO) {
		this.form().patchValue(customer);
	}

	public async openContainerToSelectCustomer() {
		const {SelectCustomerPushBoxComponent} = await import("@tenant/customer/presentation/push-box/select-customer.push-box.component");

		const pushBoxWrapperComponentRef = await this.whacAMaleProvider.buildItAsync({
			component: SelectCustomerPushBoxComponent,
			componentInputs: {
				multiple: false,
				selectedCustomerList: [this.form().value]
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
