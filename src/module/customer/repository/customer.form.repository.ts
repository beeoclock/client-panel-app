import {inject, Injectable} from '@angular/core';
import {DocumentSnapshot} from '@angular/fire/firestore';
import {CustomerFirebaseAdapter} from '@customer/adapter/customer.firebase.adapter';
import {QuerySnapshot} from '@angular/fire/compat/firestore';
import * as Customer from '@customer/domain';
import {Repository} from '@utility/repository/repository';

@Injectable({
  providedIn: 'root'
})
export class CustomerFormRepository extends Repository {
  private readonly customerAdapter: CustomerFirebaseAdapter = inject(CustomerFirebaseAdapter);

  public override async save(value: any, forceId?: string | null | undefined): Promise<void> {
    return await this.customerAdapter.save(value, forceId);
  }

  public override item(id: string): Promise<DocumentSnapshot<Customer.Interface.ICustomer>> {
    return this.customerAdapter.item(id);
  }

  public override list(): Promise<QuerySnapshot<Customer.Interface.ICustomer>> {
    return this.customerAdapter.list();
  }
}
