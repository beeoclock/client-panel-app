import {Injectable} from '@angular/core';
import {CustomerFirebaseAdapter} from '@customer/adapter/customer.firebase.adapter';

@Injectable({
  providedIn: 'root'
})
export class CustomerRepository extends CustomerFirebaseAdapter {

}
