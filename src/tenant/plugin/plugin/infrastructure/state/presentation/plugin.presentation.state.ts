import {inject, Injectable} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {Router} from "@angular/router";
import {SecondRouterOutletService} from "@src/second.router-outlet.service";
import {
	PluginPresentationActions
} from "@tenant/plugin/plugin/infrastructure/state/presentation/plugin.presentation.actions";

export type IPluginPresentationState = object;

@State<IPluginPresentationState>({
	name: 'pluginPresentation',
	defaults: {},
})
@Injectable()
export class PluginPresentationState {

	private readonly secondRouterOutletService = inject(SecondRouterOutletService);
	private readonly router = inject(Router);


	@Action(PluginPresentationActions.CloseDetails)
	public async closeDetails() {
		await this.router.navigate([{outlets: {second: null}}]);
	}

	@Action(PluginPresentationActions.CloseForm)
	public async closeForm() {
		await this.router.navigate([{outlets: {second: null}}]);
	}

	@Action(PluginPresentationActions.UpdateOpenedDetails)
	public async updateOpenedDetails(ctx: StateContext<IPluginPresentationState>, {payload}: PluginPresentationActions.UpdateOpenedDetails) {

		const activated = this.secondRouterOutletService.activated();

		if (activated) {

			// if (activated instanceof PluginDetailsContainerComponent) {
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

	@Action(PluginPresentationActions.OpenDetails)
	public async openDetailsAction(ctx: StateContext<IPluginPresentationState>, {payload}: PluginPresentationActions.OpenDetails) {

		const activated = this.secondRouterOutletService.activated();

		if (activated) {
			// if (activated instanceof PluginDetailsContainerComponent) {
			// 	const {_id} = activated.item() ?? {};
			// 	if (_id === payload._id) {
			// 		const action = new PluginPresentationActions.CloseDetails();
			// 		ctx.dispatch(action);
			// 		return;
			// 	}
			// }
		}

		await this.router.navigate([{outlets: {second: ['plugin', payload._id]}}]);

	}

	@Action(PluginPresentationActions.OpenForm)
	public async openForm(ctx: StateContext<IPluginPresentationState>, {payload}: PluginPresentationActions.OpenForm): Promise<void> {

		const activated = this.secondRouterOutletService.activated();

		if (activated) {
			// if (activated instanceof PluginFormContainerComponent) {
			// 	const isEditMode = activated.isEditMode();
			// 	if (isEditMode) {
			// 		const {_id} = activated.item() ?? {};
			// 		if (_id === payload?.componentInputs?.item?._id) {
			// 			const action = new PluginPresentationActions.CloseForm();
			// 			ctx.dispatch(action);
			// 			return;
			// 		}
			// 	} else {
			// 		const action = new PluginPresentationActions.CloseForm();
			// 		ctx.dispatch(action);
			// 		return;
			// 	}
			// }
		}

		if (payload?.componentInputs?.isEditMode) {
			await this.router.navigate([{outlets: {second: ['plugin', payload.componentInputs.item?._id, 'form']}}]);
		} else {
			await this.router.navigate([{outlets: {second: ['plugin', 'form']}}]);
		}

	}

}
