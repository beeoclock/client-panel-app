import {inject, Injectable} from "@angular/core";
import {BaseSyncManager} from "@core/system/infrastructure/sync-manager/base.sync-manager";
import {IAbsence} from "@core/business-logic/absence/interface/i.absence";
import {ApiDataProvider} from "@absence/infrastructure/data-provider/api.data-provider";
import {AbsenceRepository} from "@absence/infrastructure/repository/absence.repository";
import EAbsence from "@core/business-logic/absence/entity/e.absence";

@Injectable()
export class SyncManager extends BaseSyncManager<IAbsence.DTO, IAbsence.Entity> {

	protected readonly apiDataProvider = inject(ApiDataProvider);
	protected readonly repository = inject(AbsenceRepository);
	protected readonly toEntity = EAbsence.create;

	public constructor() {
		super('absence');
	}

}
