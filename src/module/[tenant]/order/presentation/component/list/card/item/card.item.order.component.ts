import {ChangeDetectionStrategy, Component, HostBinding, Input, input, OnInit, ViewEncapsulation} from "@angular/core";
import {CurrencyPipe} from "@angular/common";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {NoDataPipe} from "@utility/presentation/pipes/no-data.pipe";
import {RowActionButtonComponent} from "@order/presentation/component/row-action-button/row-action-button.component";
import {TranslateModule} from "@ngx-translate/core";
import {debounce} from "typescript-debounce-decorator";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";
import {OrderActions} from "@order/state/order/order.actions";
import {IOrderServiceDto} from "@order/external/interface/i.order-service.dto";
import {DurationVersionHtmlHelper} from "@utility/helper/duration-version.html.helper";
import {
	ListServiceFormCardOrderComponent
} from "@order/presentation/component/list/card/item/services/list.service.form.card.order.component";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {CurrencyCodeEnum} from "@utility/domain/enum";

@Component({
	selector: 'app-card-item-order-component',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		CardComponent,
		NoDataPipe,
		RowActionButtonComponent,
		TranslateModule,
		CurrencyPipe,
		ListServiceFormCardOrderComponent,
	],
	providers: [
		DurationVersionHtmlHelper
	],
	template: `
		<bee-card padding="p-0" class="text-sm border-2 border-transparent hover:border-blue-500"
				  [class.!border-green-500]="selectedIds().includes(orderDto._id)">
			<div class="flex flex-col gap-2">
				<div class="p-2 flex flex-wrap justify-between items-center gap-8">

					<div (click)="singleClick()" class="flex justify-between cursor-pointer">
						<div class="flex-1 flex text-beeColor-500">

							<div class="font-bold">
								{{ ('order.enum.status.singular.' + orderDto.status) | translate }}
							</div>
						</div>
					</div>

					<div class="flex items-center gap-2">
						@if (baseCurrency) {
							<div
								class="py-1 px-1.5 inline-flex items-center gap-x-1 bg-gray-100 text-gray-800 rounded-md dark:bg-neutral-500/20 dark:text-neutral-400">
								💰{{ totalAmount | currency: baseCurrency : 'symbol-narrow' }}
							</div>
						}
						@if (showAction()) {

							<app-order-row-action-button-component
								[item]="orderDto"
								[id]="orderDto._id"/>
						}
					</div>

					@if (showSelectedStatus()) {
						<div (click)="singleClick()" class=" cursor-pointer">
							@if (selectedIds().includes(orderDto._id)) {
								<div
									class="w-full border border-green-200 bg-green-50 text-green-600 px-2 py-1 rounded-2xl">
									{{ 'keyword.capitalize.selected' | translate }}
								</div>
							} @else {
								<div
									class="w-full border border-blue-200 bg-blue-50 text-blue-600 px-2 py-1 rounded-2xl">
									{{ 'keyword.capitalize.select' | translate }}
								</div>
							}
						</div>
					}
				</div>
				<div class="flex flex-col gap-2 cursor-pointer">
					<app-list-service-form-card-order-component
						[order]="orderDto"/>
					@if (orderDto.businessNote?.length) {
						<div class="flex justify-between px-2 pb-2">
							<div class="flex-1">
								<div>
									{{ 'keyword.capitalize.businessNote' | translate }}
								</div>
								<div>
									{{ orderDto.businessNote | noData }}
								</div>
							</div>
						</div>
					}
				</div>
			</div>
		</bee-card>`
})
export class CardItemOrderComponent implements OnInit {

	public readonly selectedIds = input.required<string[]>();

	@Input({required: true})
	public orderDto!: IOrderDto;

	readonly showAction = input.required<boolean>();

	readonly showSelectedStatus = input.required<boolean>();

	@HostBinding()
	public id!: string;

	@HostBinding()
	public class = 'min-w-[340px] w-[340px]';

	public baseCurrency!: CurrencyCodeEnum;

	public totalAmount: number = 0;

	@debounce(300)
	public singleClick() {
		this.open();
	}

	@Dispatch()
	public open() {
		return new OrderActions.OpenDetails(this.orderDto);
	}

	public ngOnInit() {
		this.id = this.orderDto._id;
		this.totalAmount = this.amount(this.orderDto.services);
		this.baseCurrency = this.orderDto.services[0].serviceSnapshot?.durationVersions?.[0]?.prices?.[0]?.currency ?? CurrencyCodeEnum.USD;
	}

	public amount(services: IOrderServiceDto[]): number {

		return services.reduce((acc, service) => {
			return acc + (service.serviceSnapshot?.durationVersions?.[0]?.prices?.[0]?.price ?? 0);
		}, 0);

	}

}
