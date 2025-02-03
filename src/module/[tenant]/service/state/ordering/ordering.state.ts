import {Action, State, StateContext} from "@ngxs/store";
import {inject, Injectable} from "@angular/core";
import {OrderingActions} from "@service/state/ordering/ordering.actions";
import {ListServiceApiAdapter} from "@service/adapter/external/api/list.service.api.adapter";

export interface IOrderingState  {

}

@State<IOrderingState>({
	name: 'ordering',
	defaults: {

	}
})
@Injectable()
export class OrderingState {

	private readonly listServiceApiAdapter = inject(ListServiceApiAdapter);

	@Action(OrderingActions.Init)
	public async init({setState}: StateContext<IOrderingState>) {

	}

}
