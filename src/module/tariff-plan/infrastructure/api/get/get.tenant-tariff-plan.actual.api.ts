import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@core/shared/checker";
import {TariffPlanEndpointEnum} from "@tariffPlan/infrastructure/endpoint/tariff-plan.endpoint";
import {ITariffPlan} from "@core/business-logic/tariif-plan/interface/i.tariff-plan";


@Injectable()
export class GetTenantTariffPlanActualApi extends BaseApiAdapter<ITariffPlan.DTO> {

    @TypeGuard([is.string])
    public override execute$() {
        return this.httpClient.get<ITariffPlan.DTO>(TariffPlanEndpointEnum.GET__TENANT_TARIFF_PLAN__ACTUAL);
    }

}
