import {inject, Injectable, signal} from "@angular/core";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {OrderStatusEnum} from "@core/business-logic/order/enum/order.status.enum";
import {IOrder} from "@core/business-logic/order/interface/i.order";

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

	private readonly _orderSignals = new Map<OrderStatusEnum, ReturnType<typeof signal<DATA>>>();

	public constructor() {
		this.initStatus(OrderStatusEnum.confirmed, 1);
		this.initStatus(OrderStatusEnum.done, 2);
		this.initStatus(OrderStatusEnum.cancelled, 3);
	}

	public getOrdersByStatusSignal(status: OrderStatusEnum) {
		return this._orderSignals.get(status)?.asReadonly();
	}

	public initStatus(status: OrderStatusEnum, position: number) {
		this._orderSignals.set(status, signal({
			page: 1,
			pageSize: 10,
			totalSize: 0,
			position,
			isLoading: false,
			items: [] as IOrder.EntityRaw[],
		}));
	}

	public async fetch(status: OrderStatusEnum, reset = false) {
		const orderSignal = this._orderSignals.get(status);

		if (!orderSignal) {
			return;
		}

		const orderList = orderSignal();

		if (orderList.isLoading) {
			return;
		}

		if (reset) {
			orderList.page = 1;
		}

		if (orderList.totalSize > 0 && orderList.page * orderList.pageSize >= orderList.totalSize) {
			return;
		}

		if (orderList.page * orderList.pageSize === orderList.items.length) {
			return;
		}

		orderSignal.update((orderState) => {
			orderState.isLoading = true;
			return orderState;
		})

		const {items, totalSize} = await this.sharedUow.order.repository.findAsync({
			page: orderList.page,
			pageSize: orderList.pageSize,
			status,
		});

		orderSignal.set({
			...orderList,
			page: orderList.page + 1,
			isLoading: false,
			items: orderList.items.concat(items),
			totalSize,
		});
	}
}
