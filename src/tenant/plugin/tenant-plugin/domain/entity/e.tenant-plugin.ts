import {ABaseEntity} from "@core/system/abstract/a.base-entity";
import {IPlugin} from "@tenant/plugin/plugin/domain";
import {ITenantPlugin} from "@tenant/plugin/tenant-plugin/domain";


export class ETenantPlugin extends ABaseEntity<'TenantPluginDto', ITenantPlugin.DTO, ITenantPlugin.EntityRaw> implements ITenantPlugin.EntityRaw {

	override object = 'TenantPluginDto' as const;

	plugin!: IPlugin.DTO;
	config!: object;
	status!: string;

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
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
			stateHistory: data.stateHistory,
		};
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

}

export default ETenantPlugin;
