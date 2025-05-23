import {Injectable} from "@angular/core";
import {BaseRepository} from "@core/system/infrastructure/repository/base.repository";
import ERole from "@tenant/member/roles/domain/entity/e.role";

@Injectable()
export class RoleRepository extends BaseRepository<ERole> {

}
