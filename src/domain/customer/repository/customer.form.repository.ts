import {inject, Injectable} from '@angular/core';
import {DocumentSnapshot} from '@angular/fire/firestore';
import {CustomerFirebaseAdapter} from '@customer/adapter/customer.firebase.adapter';
import {QuerySnapshot} from '@angular/fire/compat/firestore';
import {ICustomer} from '@customer/interface/customer.interface';
import {Repository} from '@utility/infrastructure/repository/repository';

@Injectable({
  providedIn: 'root'
})
export class CustomerFormRepository extends Repository {
  private readonly customerAdapter: CustomerFirebaseAdapter = inject(CustomerFirebaseAdapter);

  public override async save(value: any): Promise<void> {
    return await this.customerAdapter.save(value);
  }

  public override item(id: string): Promise<DocumentSnapshot<ICustomer>> {
    return this.customerAdapter.item(id);
  }

  public override list(): Promise<QuerySnapshot<ICustomer>> {
    return this.customerAdapter.list();
  }
}
