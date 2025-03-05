import {DataProvider} from "@core/system/infrastructure/data-provider/data-provider";
import {inject, Injectable} from "@angular/core";
import {PostApi} from "@member/infrastructure/api/post.api";
import {GetApi} from "@member/infrastructure/api/get.api";
import {PutApi} from "@member/infrastructure/api/put.api";
import {Types} from "@core/shared/types";
import {GetItemApi} from "@member/infrastructure/api/get-item.api";
import {IMember} from "@core/business-logic/member/interface/i.member";

@Injectable()
export class ApiDataProvider extends DataProvider<IMember.DTO> {

	private readonly postApi = inject(PostApi);
	private readonly getApi = inject(GetApi);
	private readonly getItemApi = inject(GetItemApi);
	private readonly putApi = inject(PutApi);

	/**
	 *
	 * @param dto
	 */
	public override create$(dto: IMember.DTO) {
		return this.postApi.execute$(dto);
	}

	/**
	 *
	 * @param options
	 */
	public override find$(options: Types.FindQueryParams) {
		return this.getApi.execute$(options);
	}

	/**
	 *
	 * @param id
	 */
	public override findById$(id: string) {
		return this.getItemApi.execute$(id);
	}

	/**
	 *
	 * @param dto
	 */
	public override update$(dto: IMember.DTO) {
		return this.putApi.execute$(dto);
	}

}
