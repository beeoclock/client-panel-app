import {Injectable} from '@angular/core';
import * as Member from '@member/domain';
import {CloudFunctionFirebaseRepository} from "@utility/repository/cloud-function.firebase.repository";

@Injectable({
  providedIn: 'root'
})
export class MemberFirebaseAdapter extends CloudFunctionFirebaseRepository<Member.IMember> {

  constructor() {
    super();
    this.initCollectionReference('member');
  }

}
