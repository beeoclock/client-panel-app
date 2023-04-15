import {inject, Injectable} from '@angular/core';
import {
  collection,
  CollectionReference,
  doc,
  DocumentSnapshot,
  Firestore,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc
} from '@angular/fire/firestore';
import {QuerySnapshot} from '@angular/fire/compat/firestore';
import {ICustomer} from '@customer/interface/customer.interface';

@Injectable({
  providedIn: 'root'
})
export class CustomerFirebasePort {

  private readonly firestore: Firestore = inject(Firestore);

  private readonly itemsCollection: CollectionReference<ICustomer>;

  constructor() {
    this.itemsCollection = collection(this.firestore, 'customer') as CollectionReference<ICustomer>;
  }

  public save(value: any): Promise<void> {
    const documentRef = doc(this.itemsCollection, doc(this.itemsCollection).id);
    return setDoc(documentRef, value);
  }

  public item(id: string): Promise<DocumentSnapshot<ICustomer>> {
    const documentRef = doc(this.itemsCollection, id);
    return getDoc(documentRef);
  }

  public list(): Promise<QuerySnapshot<ICustomer>> {
    const q = query(this.itemsCollection, orderBy('lastName'), limit(2));
    return getDocs(q) as any;
  }

}
