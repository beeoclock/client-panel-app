import {DataProvider} from "@core/system/infrastructure/data-provider/data-provider";
import {inject, Injectable} from "@angular/core";
import {Types} from "@core/shared/types";
import {IExpenseCategory} from "@tenant/expense/expense-category/domain";
import {PostApi} from "@tenant/expense/expense-category/infrastructure/data-source/api/post.api";
import {GetApi} from "@tenant/expense/expense-category/infrastructure/data-source/api/get.api";

@Injectable()
export class ApiDataProvider extends DataProvider<IExpenseCategory.DTO> {

	private readonly postApi = inject(PostApi);
	private readonly getApi = inject(GetApi);

	/**
	 *
	 * @param dto
	 */
	public override create$(dto: IExpenseCategory.DTO) {
		return this.postApi.execute$(dto);
	}

	/**
	 *
	 * @param options
	 */
	public override find$(options: Types.FindQueryParams) {
		return this.getApi.execute$(options);
	}

}
