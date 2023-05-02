import {Injectable} from '@angular/core';
import * as Customer from '@customer/domain';
import {CloudFunctionFirebaseAdapter} from "@utility/adapter/cloud-function.firebase.adapter";

@Injectable({
  providedIn: 'root'
})
export class CustomerFirebaseAdapter extends CloudFunctionFirebaseAdapter<Customer.ICustomer> {

  constructor() {
    super();
    this.initCollectionReference('customer');
  }

}
