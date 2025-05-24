import {inject, Injectable} from '@angular/core';
import {TopUpBalanceDto} from '../dto/top-up-balance.dto';
import {TOP_UP_BALANCE_PORT} from "@tenant/balance/infrastructure/port/out/top-up.port";
import {TopUpBalanceResponse} from "@tenant/balance/application/dto/top-up-balance.response";

@Injectable()
export class TopUpBalanceUseCase {

	private readonly balancePort = inject(TOP_UP_BALANCE_PORT);

	public execute(data: TopUpBalanceDto): Promise<TopUpBalanceResponse> {
		return this.balancePort.executeAsync(data);
	}
}
