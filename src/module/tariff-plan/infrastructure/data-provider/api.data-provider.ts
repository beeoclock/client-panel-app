import {DataProvider} from "@core/system/infrastructure/data-provider/data-provider";
import {inject, Injectable} from "@angular/core";
import {PostStripeWebhookApi} from "@tariffPlan/infrastructure/api/post/post.stripe-webhook.api";
import {GetApi} from "@tariffPlan/infrastructure/api/get/get.api";
import {Types} from "@core/shared/types";
import {GetItemApi} from "@tariffPlan/infrastructure/api/get/get-item.api";
import {ITariffPlan} from "@core/business-logic/tariif-plan/interface/i.tariff-plan";

@Injectable()
export class ApiDataProvider extends DataProvider<ITariffPlan.DTO> {

    private readonly postApi = inject(PostStripeWebhookApi);
    private readonly getApi = inject(GetApi);
    private readonly getItemApi = inject(GetItemApi);

    /**
     *
     * @param dto
     */
    public override create$(dto: ITariffPlan.DTO) {
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

}
