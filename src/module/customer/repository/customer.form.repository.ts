import {inject, Injectable} from '@angular/core';
import {DocumentSnapshot} from '@angular/fire/firestore';
import {CustomerFirebaseAdapter} from '@customer/adapter/customer.firebase.adapter';
import {QuerySnapshot} from '@angular/fire/compat/firestore';
import * as Customer from '@customer/domain';
import * as Utility from '@utility/domain';

@Injectable({
  providedIn: 'root'
})
export class CustomerFormRepository extends Utility.Repository {
  private readonly customerAdapter: CustomerFirebaseAdapter = inject(CustomerFirebaseAdapter);

  public override async save(value: any, forceId?: string | null | undefined): Promise<void> {
    return await this.customerAdapter.save(value, forceId);
  }

  public override item(id: string): Promise<DocumentSnapshot<Customer.ICustomer>> {
    return this.customerAdapter.item(id);
  }

  public override list(): Promise<QuerySnapshot<Customer.ICustomer>> {
    return this.customerAdapter.list();
  }
}
