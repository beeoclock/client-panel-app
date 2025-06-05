import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	DestroyRef,
	inject,
	Signal,
	viewChild,
	ViewEncapsulation
} from "@angular/core";
import {DATA, KanbanOrderService} from "@tenant/order/order/presentation/ui/component/list/kanban/kanban.order.service";
import {NgClass} from "@angular/common";
import {FilterComponent} from "@tenant/order/order/presentation/ui/component/filter/filter.component";
import {OrderStatusEnum} from "@tenant/order/order/domain/enum/order.status.enum";
import {
	StatusOrderIconComponent
} from "@tenant/event/presentation/ui/page/calendar-with-specialists/v2/component/elements-on-calendar/icon/status.order.icon.component";
import {TranslatePipe} from "@ngx-translate/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {filter} from "rxjs";
import {Actions} from "@ngxs/store";
import {
	CardItemLightweightOrderComponent
} from "@tenant/order/order/presentation/ui/component/list/card/item-lightweight/card.item.order.component";
import {
	CardItemOrderService
} from "@tenant/order/order/presentation/ui/component/list/card/item-lightweight/card.item.order.service";
import {SyncManager} from "@core/system/infrastructure/sync-manager/sync-manager";
import {explicitEffect} from "ngxtension/explicit-effect";

@Component({
	selector: 'kanban-order',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	providers: [
		KanbanOrderService,
		CardItemOrderService,
	],
	imports: [
		FilterComponent,
		StatusOrderIconComponent,
		NgClass,
		TranslatePipe,
		CardItemLightweightOrderComponent,
	],
	template: `
		<app-order-filter-component #orderFilter class="sticky left-0"/>
		<div class="flex h-[calc(100%-64px)] divide-x">
			@for (status of orderFilter.form.value.orderStatusControl; track status) {
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

										<button
											class="p-2 px-3 rounded-2xl hover:bg-neutral-100 transition-all hover:cursor-pointer"
											(click)="refresh(status)">
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
										<div class="flex justify-between px-4">
											<div class="text-neutral-400 text-sm">{{ $index + 1 }}</div>
											<div class="text-neutral-400 text-sm uppercase">
												#...{{ item._id.slice(-5) }}
											</div>
										</div>
										<app-card-item-lightweight-order-component [orderDto]="item"/>
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
	protected readonly destroyRef = inject(DestroyRef);
	protected readonly actions = inject(Actions);
	private readonly filterComponent = viewChild(FilterComponent);

	private preSyncingValue = false;

	public readonly syncAllSubscription = SyncManager.isSyncing$.pipe(
		takeUntilDestroyed(),
		filter((isSyncing) => {
			if (this.preSyncingValue !== !!isSyncing) {
				this.preSyncingValue = !!isSyncing;
				if (!isSyncing) {
					return true;
				}
			}
			return false;
		})
	).subscribe(() => {
		// Refresh each status
		this.filterComponent()?.form.value.orderStatusControl?.forEach((status) => {
			this.refresh(status)
		});
	});

	private previousOrderStatus: OrderStatusEnum[] = [];

	public constructor() {
		explicitEffect([this.filterComponent], ([filterComponent]) => {
			if (!filterComponent) {
				return;
			}
			filterComponent.form.valueChanges.pipe(
				takeUntilDestroyed(this.destroyRef),
			).subscribe(({phrase, orderStatusControl}) => {

				this.updateKanban(filterComponent);

			});
			this.updateKanban(filterComponent);
		});
	}

	public updateKanban({form}: FilterComponent): void {
		const {orderStatusControl, phrase} = form.value;
		if (!orderStatusControl) {
			return;
		}
		orderStatusControl.forEach(status => this.kanbanOrderService.fetch({
			status,
			reset: true,
			phrase
		}));
	}

	public getOrderSignal(status: OrderStatusEnum): Signal<DATA> {
		return this.kanbanOrderService.getOrdersByStatusSignal(status) as Signal<DATA>;
	}

	public nextPage(status: OrderStatusEnum): void {
		this.kanbanOrderService.fetch({status}).then();
	}

	public refresh(status: OrderStatusEnum): void {
		this.kanbanOrderService.refresh(status).then();
	}

	protected readonly orderStatusEnum = OrderStatusEnum;
}
