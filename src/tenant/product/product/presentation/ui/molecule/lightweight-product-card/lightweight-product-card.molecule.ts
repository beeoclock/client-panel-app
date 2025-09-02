import {ChangeDetectionStrategy, Component, inject, input, ViewEncapsulation} from "@angular/core";
import ObjectID from "bson-objectid";
import {NGXLogger} from "ngx-logger";
import {CurrencyPipe} from "@angular/common";
import EProduct from "@tenant/product/product/domain/entity/e.product";

@Component({
	selector: 'lightweight-product-card-molecule',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="justify-between items-start gap-1 flex w-full">
			<div class="justify-start items-start gap-2 flex flex-wrap">
				{{ item()?.price?.value ?? 0 | currency: item()?.price?.currency:'symbol':'1.2-2' }}
			</div>
		</div>
		<div class="justify-start items-start flex">
			<div class="justify-start gap-1.5 flex flex-1 w-full">
				@if ((item()?.images ?? []).length) {
					<div class="sm:gap-4 flex flex-wrap">
						@for (image of item()?.images; track image._id) {
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
					@for (languageVersion of item()?.languageVersions; track languageVersion.language) {

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
		CurrencyPipe
	],
	host: {
		class: 'flex-col justify-start items-start p-3 gap-2 flex w-full'
	}
})
export class LightweightProductCardMolecule {

	public readonly id = input<string>(ObjectID().toHexString());
	public readonly item = input.required<EProduct>();

	private readonly ngxLogger = inject(NGXLogger);


}
