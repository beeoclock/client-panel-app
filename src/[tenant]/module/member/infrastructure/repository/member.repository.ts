import {Injectable} from "@angular/core";
import {BaseRepository} from "@core/system/infrastructure/repository/base.repository";
import EMember from "@core/business-logic/member/entity/e.member";

@Injectable()
export class MemberRepository extends BaseRepository<EMember> {

}
