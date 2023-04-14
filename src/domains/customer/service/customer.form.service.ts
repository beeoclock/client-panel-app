import {inject, Injectable} from '@angular/core';
import {DocumentData} from '@angular/fire/firestore';
import {CustomerFirebasePort} from '@customer/port/firebase/customer.firebase.port';
import {QuerySnapshot} from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class CustomerFormService {
  private readonly customerFirebasePort: CustomerFirebasePort = inject(CustomerFirebasePort);

  public save(value: any): void {
    this.customerFirebasePort.save(value);
  }

  public list(): Promise<QuerySnapshot<DocumentData>> {
    return this.customerFirebasePort.list();
  }
}
