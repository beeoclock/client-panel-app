import {Injectable} from '@angular/core';
import {MemberApiAdapter} from "@member/adapter/member.api.adapter";

@Injectable({
  providedIn: 'root'
})
export class MemberRepository extends MemberApiAdapter {
}
