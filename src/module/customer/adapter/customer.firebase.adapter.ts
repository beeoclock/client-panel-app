import {Injectable} from '@angular/core';
import * as Customer from '@customer/domain';
import {FirebaseAdapter} from '@utility/adapter/firebase-adapter.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerFirebaseAdapter extends FirebaseAdapter<Customer.Interface.ICustomer> {

  constructor() {
    super();
    this.initCollectionReference('customer', 'lastName');
  }

}
