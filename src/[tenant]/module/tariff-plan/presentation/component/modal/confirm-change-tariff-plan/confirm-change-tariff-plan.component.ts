import {
	ChangeDetectionStrategy,
	Component,
	inject,
	input,
	resource,
	ResourceRef,
	ViewEncapsulation
} from "@angular/core";
import {ITariffPlan} from "@core/business-logic/tariif-plan/interface/i.tariff-plan";
import {
	PostTenantTariffPlanChangeAmountApi
} from "@tariffPlan/infrastructure/api/post/post.tenant-tariff-plan.change-amount.api";
import {KeyValuePipe} from "@angular/common";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	selector: 'app-confirm-change-tariff-plan-component',
	standalone: true,
	template: `
		@if (resource.isLoading()) {

			@if (resource.value(); as changes) {
				<!-- List Group -->
				<ul class="mt-3 flex flex-col">

					@for (item of (changes | keyvalue); track $index) {

						<li class="inline-flex items-center gap-x-2 py-3 px-4 text-sm border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg">
							<div class="flex items-center justify-between w-full">
								<span>{{ item.key }}</span>
								<span>{{ item.value }}</span>
							</div>
						</li>

					}

					<li class="inline-flex items-center gap-x-2 py-3 px-4 text-sm font-semibold bg-gray-50 border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg">
						<div class="flex items-center justify-between w-full">
							<span>Amount paid</span>
							<span>$316.8</span>
						</div>
					</li>
				</ul>
				<!-- End List Group -->
			} @else {

			}

		} @else {

		}
	`,
	imports: [
		KeyValuePipe
	],
	providers: [
		PostTenantTariffPlanChangeAmountApi.Request
	]
})
export class ConfirmChangeTariffPlanComponent {

	public readonly tariffPlan = input.required<ITariffPlan.DTO>();

	private readonly PostTenantTariffPlanChangeAmountApiRequest = inject(PostTenantTariffPlanChangeAmountApi.Request);

	public readonly resource: ResourceRef<PostTenantTariffPlanChangeAmountApi.RESPONSE | undefined> = resource({
		request: () => ({
			tariffPlan: this.tariffPlan(),
		}),
		loader: async ({request: {tariffPlan}}) => {
			const result = await this.PostTenantTariffPlanChangeAmountApiRequest.executeAsync(tariffPlan);
			console.log({result})
			return result;
		}
	})

}
