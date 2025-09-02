import {ABaseEntity} from "@core/system/abstract/a.base-entity";
import {IPlugin, PluginPriceTypeEnum} from "@tenant/plugin/plugin/domain";
import {ITenantPlugin, TenantPluginStatusEnum} from "@tenant/plugin/tenant-plugin/domain";
import ObjectID from "bson-objectid";


export class ETenantPlugin extends ABaseEntity<'TenantPluginDto', ITenantPlugin.DTO, ITenantPlugin.EntityRaw> implements ITenantPlugin.EntityRaw {

	override object = 'TenantPluginDto' as const;

	plugin!: IPlugin.DTO;
	config!: object;
	status!: TenantPluginStatusEnum;

	public override toDTO(): ITenantPlugin.DTO {
		return ETenantPlugin.toDTO(this);
	}

	public static toDTO(data: ITenantPlugin.EntityRaw): ITenantPlugin.DTO {
		return {
			plugin: data.plugin,
			config: data.config,
			status: data.status,

			_id: data._id,
			state: data.state,
			object: data.object,
			_version: data._version,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
			stateHistory: data.stateHistory,
		};
	}

	public getLanguageVersionByCode(code: string): {
		object: 'LanguageVersionDto';
		title: string;
		description: string;
		language: string;
	} | undefined {
		return this.plugin.languageVersions.find(({language}) => language === code);
	}

	public isFree() {
		return this.plugin.price.isFree;
	}

	public isPriceTypePayAsYouGo() {
		return this.plugin.price.priceType === PluginPriceTypeEnum.payAsYouGo;
	}

	public isPriceTypeTariffPlan() {
		return this.plugin.price.priceType === PluginPriceTypeEnum.tariffPlan;
	}

	public isAttached(): boolean {
		return this.status === TenantPluginStatusEnum.connected;
	}

	public isOnboardingPending(): boolean {
		return this.status === TenantPluginStatusEnum.onboardingPending;
	}

	public isDetached(): boolean {
		return this.status === TenantPluginStatusEnum.disconnected;
	}

	public isInTrialPeriod(): boolean {
		return this.status === TenantPluginStatusEnum.inTrialPeriod;
	}

	public tenantDoesNotHavePlugin(): boolean {
		return this.status === TenantPluginStatusEnum.disconnected && this.syncedAt === undefined;
	}

	public attach(): void {
		this.status = TenantPluginStatusEnum.connected;
		this.refreshUpdatedAt();
	}

	public detach(): void {
		this.status = TenantPluginStatusEnum.disconnected;
		this.refreshUpdatedAt();
	}

	public trial(): void {
		this.status = TenantPluginStatusEnum.inTrialPeriod;
		this.refreshUpdatedAt();
	}

	public isUpcoming(): boolean {
		return this.plugin.isUpcoming;
	}

	/**
	 * Use it to create new entity, e.g. from API or form
	 * @param data
	 */
	public static fromDTO(data: ITenantPlugin.DTO): ETenantPlugin {
		return new ETenantPlugin(data);
	}

	/**
	 * Use it to create entity from raw data, e.g. from database
	 * @param data
	 */
	public static fromRaw(data: ITenantPlugin.EntityRaw): ETenantPlugin {
		return new ETenantPlugin(data);
	}

	public static createStoreItem(initials: Partial<ITenantPlugin.DTO> = {}) {

		const item = new ETenantPlugin({
			_id: new ObjectID().toHexString(),
			stateHistory: [],
			status: TenantPluginStatusEnum.disconnected,
			...initials,
		});

		return item;
	}

}

export default ETenantPlugin;
