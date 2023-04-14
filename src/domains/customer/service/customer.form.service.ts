import {inject, Injectable} from '@angular/core';
import {DocumentSnapshot} from '@angular/fire/firestore';
import {CustomerFirebasePort} from '@customer/port/firebase/customer.firebase.port';
import {QuerySnapshot} from '@angular/fire/compat/firestore';
import {ICustomer} from '@customer/interface/customer.interface';

@Injectable({
  providedIn: 'root'
})
export class CustomerFormService {
  private readonly customerFirebasePort: CustomerFirebasePort = inject(CustomerFirebasePort);

  public save(value: any): void {
    this.customerFirebasePort.save(value);
  }

  public item(id: string): Promise<DocumentSnapshot<ICustomer>> {
    return this.customerFirebasePort.item(id);
  }

  public list(): Promise<QuerySnapshot<ICustomer>> {
    return this.customerFirebasePort.list();
  }
}
