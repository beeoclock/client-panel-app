import {Injectable} from '@angular/core';
import {ICustomer} from '@customer/interface/customer.interface';
import {FirebasePort} from '@utility/netwrok/port/firebase.port';

@Injectable({
  providedIn: 'root'
})
export class CustomerFirebasePort extends FirebasePort<ICustomer> {

  constructor() {
    super();
    this.initCollectionReference('customer');
  }

}
