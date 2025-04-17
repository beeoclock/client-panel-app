import {Action, Selector, State, StateContext, Store} from '@ngxs/store';
import {inject, Injectable} from '@angular/core';
import {Socket, SocketIoConfig} from 'ngx-socket-io';
import {tap} from 'rxjs/operators';
import {SocketActions} from "@shared/state/socket/socket.actions";
import {IOrder} from "@tenant/order/order/domain/interface/i.order";
import {
	CalendarWithSpecialistsAction
} from "@tenant/event/infrastructure/state/calendar-with-specialists/calendar-with-specialists.action";
import {merge} from "rxjs";
import {BaseSyncManager} from "@core/system/infrastructure/sync-manager/base.sync-manager";
import {
	TariffPlanHistoryStore
} from "@tenant/tariff-plan/tariff-plan-history/infrastructure/store/tariff-plan-history/tariff-plane-history.store";

export interface SocketStateModel {
	connected: boolean;
	messages: SocketMessages
}

export enum SocketEventTypes {
	AbsenceCreated = 'absence-created',
	AbsenceUpdated = 'absence-updated',
	AbsenceDeleted = 'absence-deleted',
	OrderCreated = 'order-created',
	OrderUpdated = 'order-updated',
	OrderCancelled = 'order-cancelled',
	OrderRequested = 'order-requested',
	OrderPaid = 'order-paid',
}

export type SocketMessages = Array<IOrder.DTO>;

@State<SocketStateModel>({
	name: 'socket',
	defaults: {
		connected: false,
		messages: []
	}
})
@Injectable()
export class SocketState {
	private socket: Socket | undefined;
	private readonly store: Store = inject(Store);
	private readonly tariffPlanHistoryStore = inject(TariffPlanHistoryStore);

	private onAny = () => {
		BaseSyncManager.syncAll().then(() => {
			this.tariffPlanHistoryStore.init().then();
		});
	};

	@Selector()
	static isConnected(state: SocketStateModel): boolean {
		return state.connected;
	}

	@Selector()
	static getMessages(state: SocketStateModel): SocketMessages {
		return state.messages;
	}

	@Action(SocketActions.ConnectSocket)
	connectSocket(ctx: StateContext<SocketStateModel>, {payload}: SocketActions.ConnectSocket) {
		const {url, options} = payload;

		if (this.socket) {
			this.socket.disconnect();
		}

		const config: SocketIoConfig = {url, options};
		this.socket = new Socket(config);
		const {socket} = this;

		this.socket.connect();

		this.socket.fromEvent('connect').pipe(
			tap(() => {
				ctx.patchState({connected: true});
			})
		).subscribe();

		const handleEventTypes = [
			SocketEventTypes.OrderCreated,
			SocketEventTypes.OrderUpdated,
			SocketEventTypes.OrderCancelled,
			SocketEventTypes.OrderRequested,
			SocketEventTypes.OrderPaid,

			SocketEventTypes.AbsenceCreated,
			SocketEventTypes.AbsenceUpdated,
			SocketEventTypes.AbsenceDeleted,
		];

		socket.onAny(this.onAny);

		const events$ = handleEventTypes.map(event => socket.fromEvent(event));
		merge(...events$).pipe(tap((message: unknown) => {
			ctx.dispatch(new SocketActions.SocketMessageReceived(message));
			const url = this.store.selectSnapshot<string>((state) => state.router.state.url);
			const isCalendarActive = url.includes('calendar-with-specialists');
			if (isCalendarActive) {
				ctx.dispatch(new CalendarWithSpecialistsAction.GetItems());
				return;
			}
			const isOrderListActive = url.includes('order/list');
			if (isOrderListActive) {
				// ctx.dispatch(new OrderActions.GetList());
				return;
			}
		})).subscribe()

		this.socket.fromEvent('disconnect').pipe(
			tap(() => {
				ctx.patchState({connected: false});
			})
		).subscribe();
	}

	@Action(SocketActions.DisconnectSocket)
	disconnectSocket(ctx: StateContext<SocketStateModel>) {
		if (this.socket) {
			this.socket.disconnect();
			ctx.patchState({connected: false});
		}
	}

	@Action(SocketActions.SendSocketMessage)
	sendMessage(ctx: StateContext<SocketStateModel>, {payload}: SocketActions.SendSocketMessage) {
		if (this.socket) {
			this.socket.emit('message', payload);
		}
	}

	@Action(SocketActions.SocketMessageReceived)
	onMessageReceived(ctx: StateContext<SocketStateModel>, {payload}: SocketActions.SocketMessageReceived) {
		const state = ctx.getState();
		ctx.patchState({
			messages: [...state.messages, payload]
		});
	}
}
