import {ABaseEntity} from "@core/system/abstract/a.base-entity";
import {IPlugin, PluginPriceTypeEnum} from "@tenant/plugin/plugin/domain";
import {IMedia} from "@src/tenant/media/domain/interface/i.media";


export class EPlugin extends ABaseEntity<'PluginDto', IPlugin.DTO, IPlugin.EntityRaw> implements IPlugin.EntityRaw {

	override object = 'PluginDto' as const;

	slug!: string;
	languageVersions!: { object: "LanguageVersionDto"; title: string; description: string; language: string; }[];
	version!: string;
	isUpcoming!: boolean;
	status!: { isEnabled: boolean; isDeprecated: boolean; };
	price!: { isFree: boolean; priceType: PluginPriceTypeEnum; amount: number; currency: string; };
	setup!: { requiresApiKey: boolean; setupSteps: string[]; setupTimeEstimate: string; configurationUrl: string; };
	providerInfo!: {
		name: string;
		version: string;
		documentationUrl: string;
		supportUrl: string;
		contactEmail: string;
	};
	features!: string[];
	limits!: {
		tariffPlanLimits: { tariffPlanType: string; dailyLimit: number; weeklyLimit: number; monthlyLimit: number; }[];
	};
	connectionInfo!: { isConnectable: true; };
	logo!: IMedia;

	public override toDTO(): IPlugin.DTO {
		return EPlugin.toDTO(this);
	}

	public static toDTO(data: IPlugin.EntityRaw): IPlugin.DTO {
		return {
			languageVersions: data.languageVersions,
			connectionInfo: data.connectionInfo,
			providerInfo: data.providerInfo,
			isUpcoming: data.isUpcoming,
			features: data.features,
			version: data.version,
			limits: data.limits,
			status: data.status,
			price: data.price,
			setup: data.setup,
			logo: data.logo,
			slug: data.slug,

			_id: data._id,
			state: data.state,
			object: data.object,
			_version: data._version,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
			stateHistory: data.stateHistory,
		};
	}

	/**
	 * Use it to create new entity, e.g. from API or form
	 * @param data
	 */
	public static fromDTO(data: IPlugin.DTO): EPlugin {
		return new EPlugin(data);
	}

	/**
	 * Use it to create entity from raw data, e.g. from database
	 * @param data
	 */
	public static fromRaw(data: IPlugin.EntityRaw): EPlugin {
		return new EPlugin(data);
	}

}

export default EPlugin;
