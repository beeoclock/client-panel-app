import {Injectable} from '@angular/core';
import {CustomerApiAdapter} from "@customer/adapter/customer.api.adapter";

@Injectable({
  providedIn: 'root'
})
export class CustomerRepository extends CustomerApiAdapter {

}
