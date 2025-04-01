import {inject, Injectable} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";

import {baseDefaults, IBaseState} from "@shared/state/base/base.state";
import {ServiceActions} from "@tenant/service/infrastructure/state/service/service.actions";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {NGXLogger} from "ngx-logger";
import EService from "@tenant/service/domain/entity/e.service";
import {environment} from "@environment/environment";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {Router} from "@angular/router";
import {SecondRouterOutletService} from "@src/second.router-outlet.service";
import ServiceDetails from "@tenant/service/presentation/ui/component/service-details/service-details";
import ServiceContainerFormComponent
	from "@tenant/service/presentation/ui/component/form/service-container–form/service-container–form.component";
import {StateEnum} from "@core/shared/enum/state.enum";

export type IServiceState = IBaseState<EService>

const defaults = baseDefaults<EService>({
	filters: {},
	orderDir: OrderDirEnum.DESC,
	orderBy: OrderByEnum.CREATED_AT,
	pageSize: environment.config.pagination.pageSize
});

@State<IServiceState>({
	name: 'service',
	defaults
})
@Injectable()
export class ServiceState {

	private readonly sharedUow = inject(SharedUow);

	private readonly ngxLogger = inject(NGXLogger);
	private readonly router = inject(Router);
	private readonly secondRouterOutletService = inject(SecondRouterOutletService);

	// Application layer

	@Action(ServiceActions.CloseDetails)
	public async closeDetails() {
		await this.router.navigate([{outlets: {second: null}}]);
	}

	@Action(ServiceActions.CloseForm)
	public async closeForm() {
		await this.router.navigate([{outlets: {second: null}}]);
	}

	@Action(ServiceActions.UpdateOpenedDetails)
	public async updateOpenedDetails(ctx: StateContext<IServiceState>, {payload}: ServiceActions.UpdateOpenedDetails) {

		const activated = this.secondRouterOutletService.activated();

		if (activated) {

			if (activated instanceof ServiceDetails) {

				const {_id} = activated.item() ?? {};

				if (_id === payload._id) {

					await this.router.navigate([{outlets: {second: ['service', payload._id]}}], {
						onSameUrlNavigation: 'reload',
					});

				}

			}

		}

	}

	@Action(ServiceActions.OpenDetails)
	public async openDetailsAction(ctx: StateContext<IServiceState>, {payload}: ServiceActions.OpenDetails) {

		const activated = this.secondRouterOutletService.activated();

		if (activated) {
			if (activated instanceof ServiceDetails) {
				const {_id} = activated.item() ?? {};
				if (_id === payload._id) {
					ctx.dispatch(new ServiceActions.CloseDetails());
					return;
				}
			}
		}

		await this.router.navigate([{outlets: {second: ['service', payload._id]}}]);

	}

	@Action(ServiceActions.OpenDetailsById)
	public async openDetailsById(ctx: StateContext<IServiceState>, {payload: id}: ServiceActions.OpenDetailsById) {

		const item = await this.sharedUow.service.repository.findByIdAsync(id);

		if (!item) {
			this.ngxLogger.error('ServiceState.openDetailsById', 'Item not found');
			return;
		}

		ctx.dispatch(new ServiceActions.OpenDetails(item));

	}

	@Action(ServiceActions.OpenForm)
	public async openForm(ctx: StateContext<IServiceState>, {payload}: ServiceActions.OpenForm): Promise<void> {

		const activated = this.secondRouterOutletService.activated();

		if (activated) {
			if (activated instanceof ServiceContainerFormComponent) {
				const isEditMode = activated.isEditMode();
				if (isEditMode) {
					const {_id} = activated.item() ?? {};
					if (_id === payload?.componentInputs?.item?._id) {
						const action = new ServiceActions.CloseForm();
						ctx.dispatch(action);
						return;
					}
				} else {
					const action = new ServiceActions.CloseForm();
					ctx.dispatch(action);
					return;
				}
			}
		}

		if (payload?.componentInputs?.isEditMode) {
			await this.router.navigate([{outlets: {second: ['service', payload.componentInputs.item?._id, 'form']}}]);
		} else {
			await this.router.navigate([{outlets: {second: ['service', 'form']}}]);
		}

		// const {ServiceContainerFormComponent} = await import("@tenant/service/presentation/ui/component/form/service-container–form/service-container–form.component");
		//
		// const {pushBoxInputs, componentInputs} = payload ?? {};
		//
		// await this.whacAMaleProvider.buildItAsync({
		// 	title: this.translateService.instant('service.form.title.create'),
		// 	...pushBoxInputs,
		// 	component: ServiceContainerFormComponent,
		// 	componentInputs,
		// });

	}

	// API

	@Action(ServiceActions.Init)
	public async init(ctx: StateContext<IServiceState>): Promise<void> {
		ctx.setState(structuredClone(defaults));
	}

	@Action(ServiceActions.CreateItem)
	public async createItem(ctx: StateContext<IServiceState>, action: ServiceActions.CreateItem) {
		await this.sharedUow.service.repository.createAsync(EService.fromDTO(action.payload));
		await this.closeForm();
	}

	@Action(ServiceActions.UpdateItem)
	public async updateItem(ctx: StateContext<IServiceState>, {payload: item}: ServiceActions.UpdateItem): Promise<void> {
		const foundItems = await this.sharedUow.service.repository.findByIdAsync(item._id);
		if (foundItems) {
			const entity = EService.fromRaw({
				...foundItems,
				...item,
			})
			await this.sharedUow.service.repository.updateAsync(entity);
			await this.closeForm();
			await this.updateOpenedDetails(ctx, {payload: item});

		}
	}

	@Action(ServiceActions.SetState)
	public async setState(ctx: StateContext<IServiceState>, {item, state}: ServiceActions.SetState) {
		const foundItems = await this.sharedUow.service.repository.findByIdAsync(item._id);
		if (foundItems) {
			const entity = EService.fromRaw(foundItems);
			entity.changeState(state);
			await this.sharedUow.service.repository.updateAsync(entity);
			let action: unknown = new ServiceActions.UpdateOpenedDetails(entity);
			if (entity.state === StateEnum.deleted) {
				action = new ServiceActions.CloseDetails();
			}
			ctx.dispatch(action)
		}
	}

}
