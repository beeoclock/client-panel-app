import {DataProvider} from "@core/system/infrastructure/data-provider/data-provider";
import {inject, Injectable} from "@angular/core";
import {GetApi} from "@tenant/business-profile/infrastructure/data-source/api/get.api";
import {PutApi} from "@tenant/business-profile/infrastructure/data-source/api/put.api";
import {Types} from "@core/shared/types";
import {IBusinessProfile} from "@tenant/business-profile/domain/interface/i.business-profile";
import {map} from "rxjs";

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

	public override findById$(id: string) {
		return this.getApi.execute$().pipe(
			map((data) => data.items.find((item) => item._id === id))
		);
	}

	/**
	 *
	 * @param dto
	 */
	public override update$(dto: IBusinessProfile.DTO) {
		return this.putApi.execute$(dto);
	}

}
