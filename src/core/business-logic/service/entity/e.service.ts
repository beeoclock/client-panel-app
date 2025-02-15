import {ABaseItem} from "../../../system/abstract/a.base-item";
import {IService} from "../interface/i.service";
import {ISchedule} from "@utility/domain/interface/i.schedule";
import {IConfiguration, ILanguageVersion, IPrepaymentPolicy, IPresentation, RIDurationVersion} from "../interface";


export class EService extends ABaseItem<'ServiceDto', IService.DTO> implements IService.Entity {

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
		const {id, ...rest} = data;
		return rest;
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
