import {DataProvider} from "@core/system/infrastructure/data-provider/data-provider";
import {inject, Injectable} from "@angular/core";
import {GetApi} from "@businessProfile/infrastructure/api/get.api";
import {PutApi} from "@businessProfile/infrastructure/api/put.api";
import {Types} from "@core/shared/types";
import {IBusinessProfile} from "@core/business-logic/business-profile/interface/i.business-profile";

@Injectable()
export class ApiDataProvider extends DataProvider<IBusinessProfile.DTO> {

	private readonly getApi = inject(GetApi.Request);
	private readonly putApi = inject(PutApi);

	/**
	 *
	 * @param options
	 */
	public override find$(options: Types.FindQueryParams = {}) {
		return this.getApi.execute$();
	}

	/**
	 *
	 * @param dto
	 */
	public override update$(dto: IBusinessProfile.DTO) {
		return this.putApi.execute$(dto);
	}

}
