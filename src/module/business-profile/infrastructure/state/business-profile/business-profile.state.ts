import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {INotificationsSettings} from "@core/business-logic/business-profile";
import {AppActions} from "@utility/state/app/app.actions";
import {RISchedule} from "@utility/domain/interface/i.schedule";
import {CurrencyCodeEnum, LanguageCodeEnum, OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {BASE_CURRENCY} from "@src/token";
import EBusinessProfile from "@core/business-logic/business-profile/entity/e.business-profile";
import {BusinessProfileActions} from "@businessProfile/infrastructure/state/business-profile/business-profile.actions";
import {IBusinessProfile} from "@core/business-logic/business-profile/interface/i.business-profile";
import {SharedUow} from "@core/shared/uow/shared.uow";

interface IBusinessProfileState {
	item: IBusinessProfile.EntityRaw | null;
}

@State<IBusinessProfileState>({
	name: 'businessProfile',
	defaults: {
		item: null,
	}
})
@Injectable()
export class BusinessProfileState {

	private readonly BASE_CURRENCY = inject(BASE_CURRENCY);
	private readonly sharedUow = inject(SharedUow);

	@Action(BusinessProfileActions.Init)
	public async getItem(ctx: StateContext<IBusinessProfileState>): Promise<void> {

		ctx.dispatch(new AppActions.PageLoading(true));

		const {items} = await this.sharedUow.businessProfile.repository.findAsync({
			page: 1,
			pageSize: 1,
			orderBy: OrderByEnum.UPDATED_AT,
			orderDir: OrderDirEnum.DESC,
		});

		const {0: item} = items;

		ctx.patchState({
			item: item ?? null,
		});

		if (item) {
			this.BASE_CURRENCY.next(item.businessSettings.baseCurrency ?? null);
		}

		ctx.dispatch(new AppActions.PageLoading(false));

	}

	@Action(BusinessProfileActions.Update)
	public async updateItem(ctx: StateContext<IBusinessProfileState>, {item}: BusinessProfileActions.Update): Promise<void> {

		const {item: fromState} = ctx.getState();

		const entity = EBusinessProfile.fromDTO({
			...fromState,
			...item
		});

		await this.sharedUow.businessProfile.repository.updateAsync(entity);

		this.BASE_CURRENCY.next(item.businessSettings.baseCurrency ?? null);

	}

	@Selector()
	public static item(state: IBusinessProfileState): IBusinessProfile.EntityRaw | null {
		return state.item;
	}

	@Selector()
	public static notificationSettings(state: IBusinessProfileState): INotificationsSettings | undefined {
		return state.item?.notificationSettings;
	}

	@Selector()
	public static availableLanguages(state: IBusinessProfileState): LanguageCodeEnum[] | undefined {
		return state.item?.businessSettings?.availableLanguages;
	}

	@Selector()
	public static baseLanguage(state: IBusinessProfileState): LanguageCodeEnum | undefined {
		return state.item?.businessSettings?.baseLanguage;
	}

	@Selector()
	public static currencies(state: IBusinessProfileState): CurrencyCodeEnum[] | undefined {
		return state.item?.businessSettings?.currencies;
	}

	@Selector()
	public static baseCurrency(state: IBusinessProfileState): CurrencyCodeEnum | undefined {
		return state.item?.businessSettings?.baseCurrency;
	}

	@Selector()
	public static username(state: IBusinessProfileState): string | undefined | null {
		return state.item?.username;
	}

	@Selector()
	public static schedules(state: IBusinessProfileState): RISchedule[] | undefined {
		return state.item?.schedules;
	}

	@Selector()
	public static businessName(state: IBusinessProfileState): string {
		return state.item?.name ?? '';
	}

	@Selector()
	public static earliestScheduleAndLatestSchedule(state: IBusinessProfileState): {
		earliestSchedule: RISchedule,
		latestSchedule: RISchedule,
	} | null {

		if (!state.item) {
			return null;
		}

		const item = state.item;

		// Find earliest schedule and latest schedule
		const {earliestSchedule, latestSchedule} = item.schedules
			.reduce(({earliestSchedule, latestSchedule}, schedule) => {
				return {
					earliestSchedule: earliestSchedule.startInSeconds < schedule.startInSeconds ? earliestSchedule : schedule,
					latestSchedule: latestSchedule.endInSeconds > schedule.endInSeconds ? latestSchedule : schedule
				};
			}, {earliestSchedule: item.schedules[0], latestSchedule: item.schedules[0]});

		return {
			earliestSchedule,
			latestSchedule
		};

	}


}
