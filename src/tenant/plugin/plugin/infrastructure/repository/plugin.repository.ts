import {Injectable} from "@angular/core";
import {BaseRepository} from "@core/system/infrastructure/repository/base.repository";
import EPlugin from "@tenant/plugin/plugin/domain/entity/e.plugin-store";

@Injectable()
export class PluginRepository extends BaseRepository<EPlugin> {

}
