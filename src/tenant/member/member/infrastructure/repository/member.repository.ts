import {Injectable} from "@angular/core";
import {BaseRepository} from "@core/system/infrastructure/repository/base.repository";
import EMember from "@tenant/member/member/domain/entity/e.member";

@Injectable()
export class MemberRepository extends BaseRepository<EMember> {

}
