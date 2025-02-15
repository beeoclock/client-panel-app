import {ChangeDetectionStrategy, Component, inject, Input, output, ViewEncapsulation} from "@angular/core";
import {DurationVersionHtmlHelper} from "@utility/helper/duration-version.html.helper";
import {IServiceDto} from "@src/core/business-logic/order/interface/i.service.dto";
import {NgStyle} from "@angular/common";
import {IService} from "@src/core/business-logic/service/interface/i.service";

@Component({
	selector: 'select-service-multiple',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	template: `
		@if (service.presentation?.banners?.[0]?.url?.length) {
			<div class="rounded-2xl flex w-full justify-between items-start">
				<div class="flex grow">
					<img
						class="h-[120px] w-[120px] rounded-2xl"
						[src]="service.presentation?.banners?.[0]?.url"
						alt="Service image"
					/>

					<div class="p-3 flex flex-col flex-1">
						<h3>{{ service.languageVersions[0].title }}</h3>

						<div class="flex gap-3">
							<div
								class="text-md text-start font-semibold leading-tight "
								[innerHTML]="durationVersionHtmlHelper.getPriceValue(service)"
							></div>
							<div
								class="text-start text-base font-normal leading-tight "
								[innerHTML]="durationVersionHtmlHelper.getDurationValue(service)"
							></div>
						</div>

						<div class="flex gap-4 items-center justify-end">
							@if (counter) {
								<button
									class="min-w-[44px] min-h-[44px] max-w-[44px] max-h-[44px] text-xl rounded-full border border-black flex justify-center items-center"
									(click)="decrement()">
									<i class="bi bi-dash-lg"></i>
								</button>
								<div>
									{{ counter }}
								</div>
							}
							<button
								class="min-w-[44px] min-h-[44px] max-w-[44px] max-h-[44px] text-xl rounded-full border border-black flex justify-center items-center"
								(click)="increment()">
								<i class="bi bi-plus-lg"></i>
							</button>
						</div>
					</div>
				</div>

			</div>
		} @else {
			<div class="rounded-2xl p-3 flex w-full justify-between items-start">
				<div>
					<h3>{{ service.languageVersions[0].title }}</h3>

					<div class="flex gap-3">
						<div
							class="text-md text-start font-semibold leading-tight "
							[innerHTML]="durationVersionHtmlHelper.getPriceValue(service)"
						></div>
						<div
							class="text-start text-base font-normal leading-tight "
							[innerHTML]="durationVersionHtmlHelper.getDurationValue(service)"
						></div>
					</div>
				</div>

				<div class="flex gap-4 items-center" [ngStyle]="{color: service.presentation.color}">
					@if (counter) {
						<button
							class="min-w-[44px] min-h-[44px] max-w-[44px] max-h-[44px] text-xl rounded-full border flex justify-center items-center"
							[ngStyle]="{borderColor: service.presentation.color}"
							(click)="decrement()">
							<i class="bi bi-dash-lg"></i>
						</button>
						<div class="text-black">
							{{ counter }}
						</div>
					}
					<button
						class="min-w-[44px] min-h-[44px] max-w-[44px] max-h-[44px] text-xl rounded-full border flex justify-center items-center"
						[ngStyle]="{borderColor: service.presentation.color}"
						(click)="increment()">
						<i class="bi bi-plus-lg"></i>
					</button>
				</div>

			</div>

		}

	`,
	imports: [
		NgStyle
	],
	host: {
		class: 'block w-full'
	}
})
export class SelectServiceMultipleComponent {

	@Input({required: true})
	public service!: IService.DTO;

	public readonly emitSelect = output<IServiceDto>();
	public readonly emitDeselect = output<IServiceDto>();

	public readonly durationVersionHtmlHelper = inject(DurationVersionHtmlHelper);

	public counter = 0;

	public increment() {
		this.counter++;
		this.emitSelect.emit(this.service);
	}

	public decrement() {
		if (this.counter === 0) {
			return;
		}
		this.counter--;
		this.emitDeselect.emit(this.service);
	}

}
