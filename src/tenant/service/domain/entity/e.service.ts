import {ABaseEntity} from "@core/system/abstract/a.base-entity";
import {IService} from "../interface/i.service";
import {ISchedule} from "@shared/domain/interface/i.schedule";
import {IConfiguration, ILanguageVersion, IPrepaymentPolicy, IPresentation, RIDurationVersion} from "../interface";


export class EService extends ABaseEntity<'ServiceDto', IService.DTO, IService.EntityRaw> implements IService.EntityRaw {

	override object = 'ServiceDto' as const;

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

	public static toDTO(data: IService.EntityRaw): IService.DTO {
		return {
			durationVersions: data.durationVersions,
			languageVersions: data.languageVersions,
			prepaymentPolicy: data.prepaymentPolicy,
			configuration: data.configuration,
			presentation: data.presentation,
			schedules: data.schedules,
			order: data.order,

			_id: data._id,
			state: data.state,
			object: data.object,
			_version: data._version,
			updatedAt: data.updatedAt,
			createdAt: data.createdAt,
			stateHistory: data.stateHistory,

		}
	}

	/**
	 * Use it to create new entity, e.g. from API or form
	 * @param data
	 */
	public static fromDTO(data: IService.DTO): EService {
		return new EService(data);
	}

	/**
	 * Use it to create entity from raw data, e.g. from database
	 * @param data
	 */
	public static fromRaw(data: IService.EntityRaw): EService {
		return new EService(data);
	}

}

export default EService;
