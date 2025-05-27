import {BaseService} from "@core/shared/service/base.service";
import {ITenantPlugin} from "@tenant/plugin/tenant-plugin/domain";

type ENTITY_RAW = ITenantPlugin.EntityRaw;

export class TenantPluginService extends BaseService<ENTITY_RAW> {


}
