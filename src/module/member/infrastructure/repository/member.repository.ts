import {Injectable} from "@angular/core";
import {BaseRepository} from "@core/system/infrastructure/repository/base.repository";
import {IMember} from "@core/business-logic/member/interface/i.member";

@Injectable()
export class MemberRepository extends BaseRepository<IMember.Entity> {

}
