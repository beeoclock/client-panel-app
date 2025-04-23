import {inject, Injectable} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {Router} from "@angular/router";
import {SecondRouterOutletService} from "@src/second.router-outlet.service";
import {
	TenantPluginPresentationActions
} from "@tenant/plugin/tenant-plugin/infrastructure/state/presentation/tenant-plugin.presentation.actions";

export type ITenantPluginPresentationState = object;

@State<ITenantPluginPresentationState>({
	name: 'tenantPluginPresentation',
	defaults: {},
})
@Injectable()
export class TenantPluginPresentationState {

	private readonly secondRouterOutletService = inject(SecondRouterOutletService);
	private readonly router = inject(Router);


	@Action(TenantPluginPresentationActions.CloseDetails)
	public async closeDetails() {
		await this.router.navigate([{outlets: {second: null}}]);
	}

	@Action(TenantPluginPresentationActions.CloseForm)
	public async closeForm() {
		await this.router.navigate([{outlets: {second: null}}]);
	}

	@Action(TenantPluginPresentationActions.UpdateOpenedDetails)
	public async updateOpenedDetails(ctx: StateContext<ITenantPluginPresentationState>, {payload}: TenantPluginPresentationActions.UpdateOpenedDetails) {

		const activated = this.secondRouterOutletService.activated();

		if (activated) {

			// if (activated instanceof TenantPluginDetailsContainerComponent) {
			//
			// 	const {_id} = activated.item() ?? {};
			//
			// 	if (_id === payload._id) {
			//
			//
			// 		await this.router.navigate([{outlets: {second: ['customer', payload._id]}}], {
			// 			onSameUrlNavigation: 'reload',
			// 		});
			//
			// 	}
			//
			// }

		}

	}

	@Action(TenantPluginPresentationActions.OpenDetails)
	public async openDetailsAction(ctx: StateContext<ITenantPluginPresentationState>, {payload}: TenantPluginPresentationActions.OpenDetails) {

		const activated = this.secondRouterOutletService.activated();

		if (activated) {
			// if (activated instanceof TenantPluginDetailsContainerComponent) {
			// 	const {_id} = activated.item() ?? {};
			// 	if (_id === payload._id) {
			// 		const action = new TenantPluginPresentationActions.CloseDetails();
			// 		ctx.dispatch(action);
			// 		return;
			// 	}
			// }
		}

		await this.router.navigate([{outlets: {second: ['customer', payload._id]}}]);

	}

	@Action(TenantPluginPresentationActions.OpenForm)
	public async openForm(ctx: StateContext<ITenantPluginPresentationState>, {payload}: TenantPluginPresentationActions.OpenForm): Promise<void> {

		const activated = this.secondRouterOutletService.activated();

		if (activated) {
			// if (activated instanceof TenantPluginFormContainerComponent) {
			// 	const isEditMode = activated.isEditMode();
			// 	if (isEditMode) {
			// 		const {_id} = activated.item() ?? {};
			// 		if (_id === payload?.componentInputs?.item?._id) {
			// 			const action = new TenantPluginPresentationActions.CloseForm();
			// 			ctx.dispatch(action);
			// 			return;
			// 		}
			// 	} else {
			// 		const action = new TenantPluginPresentationActions.CloseForm();
			// 		ctx.dispatch(action);
			// 		return;
			// 	}
			// }
		}

		if (payload?.componentInputs?.isEditMode) {
			await this.router.navigate([{outlets: {second: ['tenant-plugin', payload.componentInputs.item?._id, 'form']}}]);
		} else {
			await this.router.navigate([{outlets: {second: ['tenant-plugin', 'form']}}]);
		}

	}

}
