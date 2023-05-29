import {Injectable} from '@angular/core';
import * as Company from '@company/domain'
import {CloudFunctionFirebaseRepository} from "@utility/repository/cloud-function.firebase.repository";

@Injectable({
  providedIn: 'root'
})
export class CompanyFirebaseAdapter extends CloudFunctionFirebaseRepository<Company.ISettings> {

  constructor() {
    super();
    this.initCollectionReference('company');
  }

}
