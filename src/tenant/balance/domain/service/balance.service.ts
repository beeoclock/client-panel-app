import {BaseService} from "@core/shared/service/base.service";
import {IBalance} from "@tenant/balance/domain";
import {firstValueFrom, map, Observable} from "rxjs";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";

type ENTITY_RAW = IBalance.EntityRaw;

export class BalanceService extends BaseService<ENTITY_RAW> {

	public getCurrentBalance$(): Observable<ENTITY_RAW> {
		return this.repository.find$({
			page: 1,
			pageSize: 1,
			orderBy: OrderByEnum.CREATED_AT,
			orderDir: OrderDirEnum.DESC,
		}).pipe(
			map(({items: {0: raw}}) => raw),
		);
	}

	public getCurrentBalanceAsync() {
		return firstValueFrom(this.getCurrentBalance$());
	}

}
