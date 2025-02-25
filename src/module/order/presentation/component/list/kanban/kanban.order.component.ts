import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Signal, ViewEncapsulation} from "@angular/core";
import {DATA, KanbanOrderService} from "@order/presentation/component/list/kanban/kanban.order.service";
import {NgClass} from "@angular/common";
import {FilterComponent} from "@order/presentation/component/filter/filter.component";
import {CardItemOrderComponent} from "@order/presentation/component/list/card/item/card.item.order.component";
import {OrderStatusEnum} from "@core/business-logic/order/enum/order.status.enum";
import {
	StatusOrderIconComponent
} from "@page/event/calendar-with-specialists/v2/component/elements-on-calendar/icon/status.order.icon.component";
import {TranslatePipe} from "@ngx-translate/core";
import {FormControl} from "@angular/forms";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {tap} from "rxjs";

@Component({
	selector: 'kanban-order',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	providers: [
		KanbanOrderService,
	],
	imports: [
		FilterComponent,
		CardItemOrderComponent,
		StatusOrderIconComponent,
		NgClass,
		TranslatePipe,
	],
	template: `
		<app-order-filter-component [orderStatusControl]="orderStatusControl" class="sticky left-0"/>
		<div class="flex h-[calc(100%-64px)] divide-x">
			@for (status of orderStatusControl.value; track status) {
				<div class="bg-neutral-100 w-full max-w-xs min-w-[380px] overflow-auto">

					@if (getOrderSignal(status); as ordersSignal) {

						@if (ordersSignal(); as ordersState) {

							<!-- board category header -->
							<div class="flex flex-row justify-between items-center sticky top-0 bg-white px-4 py-2">
								<div class="flex items-center justify-between w-full">
									<div class="flex items-center gap-2">
										<app-status-order-icon-component
											class="flex text-3xl"
											[ngClass]="{
												'text-red-600': status === orderStatusEnum.cancelled,
												'text-blue-600': status === orderStatusEnum.confirmed,
												'text-green-600': status === orderStatusEnum.done,
											  }"
											[status]="status"/>
										{{ ('order.enum.status.singular.' + status) | translate }}
									</div>
									<div class="flex gap-2 items-center">

										<button class="p-2 px-3 rounded-2xl hover:bg-neutral-100 transition-all hover:cursor-pointer" (click)="refresh(status)">
											<div [class.animate-spin]="ordersState.isLoading">
												<i class="bi bi-arrow-clockwise"></i>
											</div>
										</button>

										<p class="text-gray-400 text-sm">
											{{ ordersState.items.length }} /
											{{ ordersState.totalSize }}
										</p>
									</div>
								</div>
							</div>
							<!-- board card -->
							<div class="flex flex-col gap-8 p-4">

								@for (item of ordersState.items; track item._id) {

									<div>
										<div class="flex justify-end pe-4">
											<div class="text-neutral-400 text-sm">#{{ $index + 1 }}</div>
										</div>
										<app-card-item-order-component [orderDto]="item"/>
									</div>

								}

								@if (ordersState.isLoading) {

									<div class="animate-pulse flex flex-col gap-8">

										<div class="w-full h-40 rounded-2xl bg-neutral-200"></div>
										<div class="w-full h-60 rounded-2xl bg-neutral-200"></div>
										<div class="w-full h-20 rounded-2xl bg-neutral-200"></div>

									</div>

								} @else {

									@if (ordersState.page * ordersState.pageSize >= ordersState.totalSize) {

										<div class="text-beeColor-500 text-center w-full">
											{{ 'pagination.message.allDataDownloaded' | translate }}
										</div>

									} @else {

										<button
											(click)="nextPage(status)"
											class="relative inline-flex items-center rounded-md border border-beeColor-300 bg-white px-4 py-2 text-sm font-medium text-beeColor-700 hover:bg-beeColor-100">
											{{ 'keyword.capitalize.downloadMore' | translate }}
										</button>

									}

								}

							</div>
						}
					}
				</div>
			}
		</div>
	`,
	host: {
		class: 'flex flex-col h-full overflow-x-auto'
	}
})
export class KanbanOrderComponent {

	protected readonly kanbanOrderService = inject(KanbanOrderService);
	protected readonly changeDetectorRef = inject(ChangeDetectorRef);

	public readonly orderStatusControl = new FormControl<OrderStatusEnum[]>([], {
		nonNullable: true
	});

	private previousOrderStatus: OrderStatusEnum[] = [];

	private readonly orderStatusSubscription = this.orderStatusControl.valueChanges.pipe(
		takeUntilDestroyed(),
		tap((value) => {
			const newStatus = value.filter(status => !this.previousOrderStatus.includes(status));
			newStatus.forEach(status => this.kanbanOrderService.fetch(status, true));
			this.previousOrderStatus = value;
		})
	).subscribe();

	public constructor() {
		this.orderStatusControl.setValue([
			OrderStatusEnum.confirmed,
			OrderStatusEnum.done,
			OrderStatusEnum.cancelled,
		])
	}

	public getOrderSignal(status: OrderStatusEnum): Signal<DATA> {
		return this.kanbanOrderService.getOrdersByStatusSignal(status) as Signal<DATA>;
	}

	public nextPage(status: OrderStatusEnum): void {
		this.kanbanOrderService.fetch(status).then();
	}

	public refresh(status: OrderStatusEnum): void {
		this.kanbanOrderService.refresh(status).then();
	}

	protected readonly orderStatusEnum = OrderStatusEnum;
}
