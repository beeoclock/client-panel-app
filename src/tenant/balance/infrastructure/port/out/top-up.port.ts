import {TopUpBalanceDto} from "@tenant/balance/application/dto/top-up-balance.dto";
import {TopUpBalanceResponse} from "@tenant/balance/application/dto/top-up-balance.response";
import {InjectionToken} from "@angular/core";
import {Observable} from "rxjs";

export interface TopUpBalancePort {
	executeAsync(data: TopUpBalanceDto): Promise<TopUpBalanceResponse>;

	execute$(data: TopUpBalanceDto): Observable<TopUpBalanceResponse>;
}

// Token
export const TOP_UP_BALANCE_PORT = new InjectionToken<TopUpBalancePort>('TopUpBalancePort');
