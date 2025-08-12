import {ChangeDetectionStrategy, Component, input, ViewEncapsulation} from "@angular/core";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {ICustomer} from "@tenant/customer/domain";
import ECustomer from "@tenant/customer/domain/entity/e.customer";
import {
	CustomerPresentationActions
} from "@tenant/customer/infrastructure/state/presentation/customer.presentation.actions";
import {TranslatePipe} from "@ngx-translate/core";
import {CustomerTypeEnum} from "@tenant/customer/domain/enum/customer-type.enum";

@Component({
	selector: 'customer-chip',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	imports: [
		TranslatePipe
	],
	host: {
		class: 'text-sm font-medium'
	},
	template: `

		@switch (customer().customerType) {

			@case (customerTypeEnum.unregistered) {

				@let firstName = customer().firstName ?? '' ;
				@let lastName = customer().lastName ?? '' ;

				<div class="flex gap-2 items-center">
					<div
						class="rounded-full uppercase bg-gradient-to-r from-sky-100 to-sky-200 min-h-8 min-w-8 flex justify-center items-center font-bold text-sky-700">
						{{ firstName?.[0] ?? '' }}{{ lastName?.[0] ?? '' }}
					</div>

					<div class="text-slate-900 text-sm font-normal truncate">
						{{ customer().firstName }}
					</div>

				</div>

			}
			@case (customerTypeEnum.regular) {


				<button (click)="openCustomerDetails($event)"
						class="inline-flex flex-nowrap gap-2 items-center bg-white border border-neutral-200 hover:bg-neutral-200 transition-all rounded-full p-1 pe-3 dark:bg-neutral-900 dark:border-neutral-700">

					@let firstName = customer().firstName ?? '' ;
					@let lastName = customer().lastName ?? '' ;

					<div
						class="rounded-full uppercase bg-gradient-to-r from-amber-100 to-amber-200 min-h-8 min-w-8 flex justify-center items-center font-bold text-yellow-700">
						{{ firstName?.[0] ?? '' }}{{ lastName?.[0] ?? '' }}
					</div>

					<div class="whitespace-nowrap font-medium text-neutral-800 dark:text-white flex flex-col">
						<span class="truncate">{{ customer().firstName }}</span>
					</div>
				</button>

			}
			@case (customerTypeEnum.new) {

				<div class="flex gap-2 items-center">

					@let firstName = customer().firstName ?? '' ;
					@let lastName = customer().lastName ?? '' ;

					<div
						class="rounded-full uppercase bg-gradient-to-r from-amber-100 to-amber-200 min-h-8 min-w-8 flex justify-center items-center font-bold text-yellow-700">
						{{ firstName?.[0] ?? '' }}{{ lastName?.[0] ?? '' }}
					</div>

					<span class="truncate">
						{{ customer().firstName }}
					</span>

				</div>

			}
			@case (customerTypeEnum.anonymous) {

				<div class="flex gap-2 items-center">
					<div
						class="rounded-full bg-gradient-to-r from-neutral-100 to-neutral-200 min-h-8 min-w-8 flex justify-center items-center font-bold text-neutral-700">
						<i class="bi bi-person"></i>
					</div>

					<span class="truncate">
						{{ 'keyword.capitalize.anonymous' | translate }}
					</span>

				</div>

			}

		}

	`
})
export class CustomerChip {

	public readonly customer = input.required<ICustomer.EntityRaw | ECustomer>();

	public openCustomerDetails($event: MouseEvent) {
		$event.stopPropagation();
		this.dispatchCustomerDetails();
	}

	@Dispatch()
	public dispatchCustomerDetails() {
		const customer = this.customer();
		return new CustomerPresentationActions.OpenDetails(customer);
	}

	protected readonly customerTypeEnum = CustomerTypeEnum;
}
