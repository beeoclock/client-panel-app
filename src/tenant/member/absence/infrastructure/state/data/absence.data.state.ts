import {inject, Injectable} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {baseDefaults, IBaseState} from "@shared/state/base/base.state";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {AbsenceDataActions} from "@tenant/member/absence/infrastructure/state/data/absence.data.actions";
import {environment} from "@environment/environment";
import EAbsence from "@tenant/member/absence/domain/entity/e.absence";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {
	AbsencePresentationActions
} from "@tenant/member/absence/infrastructure/state/presentation/absence.presentation.actions";

export type IAbsenceState = IBaseState<EAbsence>;

const defaults = baseDefaults<EAbsence>({
	filters: {},
	orderBy: OrderByEnum.CREATED_AT,
	orderDir: OrderDirEnum.DESC,
	pageSize: environment.config.pagination.pageSize,
});

@State<IAbsenceState>({
	name: 'absenceData',
	defaults,
})
@Injectable()
export class AbsenceDataState {

	private readonly sharedUow = inject(SharedUow);

	// API

	@Action(AbsenceDataActions.CreateItem)
	public async createItem(ctx: StateContext<IAbsenceState>, {payload: entity}: AbsenceDataActions.CreateItem) {
		await this.sharedUow.absence.repository.createAsync(entity);
	}

	@Action(AbsenceDataActions.UpdateItem)
	public async updateItem(ctx: StateContext<IAbsenceState>, {payload: item}: AbsenceDataActions.UpdateItem): Promise<void> {
		const foundItem = await this.sharedUow.absence.repository.findByIdAsync(item._id);
		if (foundItem) {
			const entity = EAbsence.fromRaw({
				...foundItem,
				...item,
			});
			await this.sharedUow.absence.repository.updateAsync(entity);
		}
	}

	@Action(AbsenceDataActions.SetState)
	public async setState(ctx: StateContext<IAbsenceState>, {item, state}: AbsenceDataActions.SetState) {
		const foundItems = await this.sharedUow.absence.repository.findByIdAsync(item._id);
		if (foundItems) {
			const entity = EAbsence.fromRaw(foundItems);
			entity.changeState(state);
			await this.sharedUow.absence.repository.updateAsync(entity);
			ctx.dispatch(new AbsencePresentationActions.UpdateOpenedDetails(entity));
		}
	}

}
