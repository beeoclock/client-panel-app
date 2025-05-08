import {Injectable} from "@angular/core";
import {BaseRepository} from "@core/system/infrastructure/repository/base.repository";
import EBalance from "@tenant/balance/domain/entity/e.balance";

@Injectable()
export class BalanceRepository extends BaseRepository<EBalance> {

}
