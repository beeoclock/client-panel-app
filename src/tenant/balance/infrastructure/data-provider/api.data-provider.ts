import { DataProvider } from '@core/system/infrastructure/data-provider/data-provider';
import { inject, Injectable } from '@angular/core';
import { GetApi } from '@tenant/balance/infrastructure/data-source/api/get.api';
import { Types } from '@core/shared/types';
import { IBalance } from '@tenant/balance/domain';
import { of } from 'rxjs';

@Injectable()
export class ApiDataProvider extends DataProvider<IBalance.DTO> {
	private readonly getApi = inject(GetApi);

	/**
	 *
	 * @param options
	 */
	public override find$(options: Types.FindQueryParams) {
		return this.getApi.execute$(options);
	}

	public override create$(data: IBalance.DTO) {
		return of(data);
	}

	public override update$(data: IBalance.DTO) {
		return of(data);
	}
}
