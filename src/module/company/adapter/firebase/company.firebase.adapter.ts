import {Injectable} from '@angular/core';
import * as Company from '@company/domain'
import {CloudFunctionFirebaseAdapter} from "@utility/adapter/cloud-function.firebase.adapter";

@Injectable({
  providedIn: 'root'
})
export class CompanyFirebaseAdapter extends CloudFunctionFirebaseAdapter<Company.ISettings> {

  constructor() {
    super();
    this.initCollectionReference('company');
  }

}
