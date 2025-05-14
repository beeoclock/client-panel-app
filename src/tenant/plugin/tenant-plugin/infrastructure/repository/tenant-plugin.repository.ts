import {Injectable} from "@angular/core";
import {BaseRepository} from "@core/system/infrastructure/repository/base.repository";
import ETenantPlugin from "@tenant/plugin/tenant-plugin/domain/entity/e.tenant-plugin";

@Injectable()
export class TenantPluginRepository extends BaseRepository<ETenantPlugin> {

}
