import {Injectable} from '@angular/core';
import {ICustomer} from '@customer/interface/customer.interface';
import {FirebaseAdapter} from '@utility/infrastructure/adapt/firebase-adapter.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerFirebaseAdapter extends FirebaseAdapter<ICustomer> {

  constructor() {
    super();
    this.initCollectionReference('customer');
  }

}
