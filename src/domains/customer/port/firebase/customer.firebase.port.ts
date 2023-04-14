import {inject, Injectable} from '@angular/core';
import {
  collection,
  CollectionReference,
  doc,
  DocumentData,
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

@Injectable({
  providedIn: 'root'
})
export class CustomerFirebasePort {

  private readonly firestore: Firestore = inject(Firestore);

  private readonly itemsCollection: CollectionReference<DocumentData>;

  constructor() {
    this.itemsCollection = collection(this.firestore, 'customer');
  }

  public save(value: any): Promise<void> {
    const documentRef = doc(this.itemsCollection, doc(this.itemsCollection).id);
    return setDoc(documentRef, value);
  }

  public item(id: string): Promise<DocumentSnapshot<DocumentData>> {
    const documentRef = doc(this.itemsCollection, id);
    return getDoc(documentRef);
  }

  public list(): Promise<QuerySnapshot<DocumentData>> {
    const q = query(this.itemsCollection, orderBy('lastName'), limit(25));
    return getDocs(q) as any;
  }

}
