import {inject, Injectable} from '@angular/core';
import {DocumentSnapshot} from '@angular/fire/firestore';
import {CustomerFirebasePort} from '@customer/network/port/firebase/customer.firebase.port';
import {QuerySnapshot} from '@angular/fire/compat/firestore';
import {ICustomer} from '@customer/interface/customer.interface';
import {Adapt} from '@utility/netwrok/adapt/adapt';

@Injectable({
  providedIn: 'root'
})
export class CustomerFormAdapt extends Adapt {
  private readonly customerFirebasePort: CustomerFirebasePort = inject(CustomerFirebasePort);

  public override async save(value: any): Promise<void> {
    return await this.customerFirebasePort.save(value);
  }

  public override item(id: string): Promise<DocumentSnapshot<ICustomer>> {
    return this.customerFirebasePort.item(id);
  }

  public override list(): Promise<QuerySnapshot<ICustomer>> {
    return this.customerFirebasePort.list();
  }
}
