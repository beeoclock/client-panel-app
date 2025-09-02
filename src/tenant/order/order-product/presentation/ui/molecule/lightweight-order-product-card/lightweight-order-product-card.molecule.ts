import {ChangeDetectionStrategy, Component, inject, input, ViewEncapsulation} from "@angular/core";
import {PrimaryLinkButtonDirective} from "@shared/presentation/directives/button/primary.link.button.directive";
import {
	PriceChipComponent
} from "@shared/presentation/ui/component/smart/order/form/service/list/item/chip/price.chip.component";
import ObjectID from "bson-objectid";
import {NGXLogger} from "ngx-logger";
import {
	QuantityChip
} from "@shared/presentation/ui/component/smart/order/form/product/list/item/chip/quantity/quantity.chip";
import {CurrencyPipe} from "@angular/common";
import {IOrderProductDto} from "@tenant/order/order/domain/interface/i.order-product.dto";

@Component({
	selector: 'lightweight-order-product-card-molecule',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		@let product = item()?.productSnapshot ;
		<div class="justify-between items-start gap-1 flex w-full">
			<div class="justify-start items-start gap-2 flex flex-wrap">
				{{ product?.price?.value ?? 0 | currency: product?.price?.currency:'symbol':'1.2-2' }}
				x {{ item()?.quantity ?? 0 }}
				= {{ (product?.price?.value ?? 0) * (item()?.quantity ?? 0) | currency: product?.price?.currency:'symbol':'1.2-2' }}
			</div>
		</div>
		<div class="justify-start items-start flex">
			<div class="justify-start gap-1.5 flex flex-1 w-full">
				@if ((product?.images ?? []).length) {
					<div class="sm:gap-4 flex flex-wrap">
						@for (image of product?.images; track image._id) {
							<div>
								<div class="rounded-2xl bg-beeColor-400">
									@if (image) {
										<img
											[src]="image.url"
											class="max-w-20 object-cover aspect-1 rounded-2xl"
											alt="Uploaded Image"/>
									}
								</div>
							</div>
						}
					</div>
				}

				<div class="flex flex-col divide-y w-full rounded-lg border text-sm">
					@for (languageVersion of product?.languageVersions; track languageVersion.language) {

						<div
							class="relative text-wrap flex gap-2 items-start p-2 font-sans text-neutral-900">
							<label
								class="relative font-bold uppercase flex items-center justify-center p-0 cursor-pointer border-2 border-neutral-200 px-1 rounded-lg">
								{{ languageVersion.language }}
							</label>
							<div class="flex flex-col gap-1">
								<div class="font-bold">{{ languageVersion.title }}</div>
								<div>{{ languageVersion.description }}</div>
							</div>
						</div>

					}
				</div>
			</div>
		</div>

	`,
	imports: [
		PrimaryLinkButtonDirective,
		PriceChipComponent,
		QuantityChip,
		CurrencyPipe
	],
	host: {
		class: 'flex-col justify-start items-start p-3 gap-2 flex w-full'
	}
})
export class LightweightOrderProductCardMolecule {

	public readonly id = input<string>(ObjectID().toHexString());
	public readonly item = input.required<IOrderProductDto>();

	private readonly ngxLogger = inject(NGXLogger);


}
