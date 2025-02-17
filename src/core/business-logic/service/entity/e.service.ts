import {ABaseEntity} from "@core/system/abstract/a.base-entity";
import {IService} from "../interface/i.service";
import {ISchedule} from "@utility/domain/interface/i.schedule";
import {IConfiguration, ILanguageVersion, IPrepaymentPolicy, IPresentation, RIDurationVersion} from "../interface";


export class EService extends ABaseEntity<'ServiceDto', IService.DTO> implements IService.Entity {

	configuration!: Required<IConfiguration>;
	presentation!: IPresentation;
	prepaymentPolicy!: Required<IPrepaymentPolicy>;
	languageVersions!: Required<ILanguageVersion>[];
	durationVersions!: RIDurationVersion[];
	schedules!: Required<ISchedule>[];
	order!: number;


	public override toDTO(): IService.DTO {
		return EService.toDTO(this);
	}

	public static toDTO(data: IService.Entity): IService.DTO {
		return {
			_id: data._id,
			configuration: data.configuration,
			createdAt: data.createdAt,
			durationVersions: data.durationVersions,
			languageVersions: data.languageVersions,
			object: data.object,
			order: data.order,
			prepaymentPolicy: data.prepaymentPolicy,
			presentation: data.presentation,
			schedules: data.schedules,
			state: data.state,
			stateHistory: data.stateHistory,
			updatedAt: data.updatedAt,

		}
	}

	/**
	 * Use it to create new entity, e.g. from API or form
	 * @param data
	 */
	public static create(data: IService.DTO): IService.Entity {
		return new EService(data);
	}

}

export default EService;
