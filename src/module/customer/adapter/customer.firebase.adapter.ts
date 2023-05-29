import {Injectable} from '@angular/core';
import * as Customer from '@customer/domain';
import {CloudFunctionFirebaseRepository} from "@utility/repository/cloud-function.firebase.repository";

@Injectable({
  providedIn: 'root'
})
export class CustomerFirebaseAdapter extends CloudFunctionFirebaseRepository<Customer.ICustomer> {

  constructor() {
    super();
    this.initCollectionReference('customer');
  }

}
