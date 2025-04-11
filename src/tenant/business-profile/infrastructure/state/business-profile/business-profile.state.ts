import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {INotificationsSettings} from "@tenant/business-profile/domain";
import {RISchedule} from "@shared/domain/interface/i.schedule";
import {CurrencyCodeEnum, LanguageCodeEnum, OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {BASE_CURRENCY} from "@src/token";
import EBusinessProfile from "@tenant/business-profile/domain/entity/e.business-profile";
import {
	BusinessProfileActions
} from "@tenant/business-profile/infrastructure/state/business-profile/business-profile.actions";
import {IBusinessProfile} from "@tenant/business-profile/domain/interface/i.business-profile";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {CountryCodeEnum} from "@core/shared/enum/country-code.enum";
import {RIMedia} from "@tenant/media/domain/interface/i.media";

interface IBusinessProfileState {
	item: IBusinessProfile.EntityRaw | undefined;
}

@State<IBusinessProfileState>({
	name: 'businessProfile',
	defaults: {
		item: undefined
	}
})
@Injectable()
export class BusinessProfileState {

	private readonly BASE_CURRENCY = inject(BASE_CURRENCY);
	private readonly sharedUow = inject(SharedUow);

	@Action(BusinessProfileActions.Init)
	public async init(ctx: StateContext<IBusinessProfileState>): Promise<void> {

		const {items} = await this.sharedUow.businessProfile.repository.findAsync({
			page: 1,
			pageSize: 1,
			orderBy: OrderByEnum.UPDATED_AT,
			orderDir: OrderDirEnum.DESC,
		});

		const {0: item} = items;

		ctx.patchState({
			item
		});

		if (item) {
			this.BASE_CURRENCY.next(item.businessSettings.baseCurrency ?? null);
		}

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
	public static item(state: IBusinessProfileState): IBusinessProfile.EntityRaw | undefined {
		return state.item;
	}

	@Selector()
	public static logo(state: IBusinessProfileState): RIMedia | undefined | null {
		return state.item?.logo;
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
	public static country(state: IBusinessProfileState): CountryCodeEnum | undefined {
		return state.item?.addresses?.[0]?.country;
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
