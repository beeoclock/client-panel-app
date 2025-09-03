import {inject, Injectable, signal} from "@angular/core";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {OrderStatusEnum} from "@tenant/order/order/domain/enum/order.status.enum";
import {IOrder} from "@tenant/order/order/domain/interface/i.order";
import {StateEnum} from "@core/shared/enum/state.enum";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {Store} from "@ngxs/store";
import {
	BusinessProfileState
} from "@tenant/business-profile/infrastructure/state/business-profile/business-profile.state";

export type DATA = {
	page: number;
	pageSize: number;
	totalSize: number;
	position: number;
	isLoading: boolean;
	items: IOrder.EntityRaw[];
}

@Injectable()
export class KanbanOrderService {

	private readonly sharedUow = inject(SharedUow);
	private readonly store = inject(Store);
	private readonly businessProfile = this.store.selectSnapshot(BusinessProfileState.item);

	private readonly _orderSignals = new Map<OrderStatusEnum, ReturnType<typeof signal<DATA>>>();

	public constructor() {
		const {autoBookOrder} = this.businessProfile?.bookingSettings || {};
		if (!autoBookOrder) this.initStatus(OrderStatusEnum.requested, 0);
		this.initStatus(OrderStatusEnum.confirmed, 1);
		this.initStatus(OrderStatusEnum.done, 2);
		this.initStatus(OrderStatusEnum.cancelled, 3);
	}

	public getOrdersByStatusSignal(status: OrderStatusEnum) {
		return this._orderSignals.get(status)?.asReadonly();
	}

	public initStatus(status: OrderStatusEnum, position: number) {
		this._orderSignals.set(status, signal({
			page: 0,
			pageSize: 10,
			totalSize: 0,
			position,
			isLoading: false,
			items: [] as IOrder.EntityRaw[],
		}));
	}

	public async refresh(status: OrderStatusEnum) {

		const orderSignal = this._orderSignals.get(status);

		if (!orderSignal) {
			throw new Error('Order signal not found');
		}

		orderSignal.update((orderState) => {
			return {
				...orderState,
				isLoading: true,
			}
		});

		const newItems: IOrder.EntityRaw[] = [];
		const {page, pageSize} = orderSignal();
		const pages = Array.from({length: page}, (_, i) => i + 1);
		let ts = 0;

		for (const page of pages) {
			const {items, totalSize} = await this.sharedUow.order.repository.findAsync({
				page,
				pageSize,
				status,
				state: StateEnum.active,
				orderDir: OrderDirEnum.ASC,
				orderBy: OrderByEnum.CREATED_AT,
			});
			ts = totalSize;
			newItems.push(...items);
		}

		orderSignal.update((orderState) => {
			return {
				...orderState,
				isLoading: false,
				items: newItems,
				totalSize: ts,
			}
		});

	}

	public async fetch(params: {
		status: OrderStatusEnum;
		phrase?: string;
		reset?: boolean;
	}) {
		const {status, phrase = '', reset = false} = params;
		const orderSignal = this._orderSignals.get(status);

		if (!orderSignal) {
			return;
		}

		const orderList = orderSignal();

		if (orderList.isLoading) {
			return;
		}

		if (reset) {

			orderList.items = [];
			orderList.page = 1;

		} else {

			// If all data is downloaded, do not fetch more
			if (orderList.totalSize > 0 && orderList.page * orderList.pageSize >= orderList.totalSize) {
				return;
			}

			orderList.page++;

		}

		orderSignal.update((orderState) => {
			orderState.isLoading = true;
			return orderState;
		});

		const {items, totalSize} = await this.sharedUow.order.repository.findAsync({
			page: orderList.page,
			pageSize: orderList.pageSize,
			status,
			phrase,
			state: StateEnum.active,
			orderDir: OrderDirEnum.ASC,
			orderBy: OrderByEnum.CREATED_AT,
		});

		orderSignal.set({
			...orderList,
			page: orderList.page,
			isLoading: false,
			items: orderList.items.concat(items),
			totalSize,
		});
	}
}
