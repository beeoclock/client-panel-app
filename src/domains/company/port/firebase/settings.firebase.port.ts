import {inject, Injectable} from '@angular/core';
import {
  collection,
  CollectionReference,
  doc,
  DocumentData,
  DocumentSnapshot,
  Firestore,
  getDoc,
  setDoc
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SettingsFirebasePort {

  private readonly firestore: Firestore = inject(Firestore);

  private readonly itemsCollection: CollectionReference<DocumentData>;

  constructor() {
    this.itemsCollection = collection(this.firestore, 'company');
  }

  public save(value: any): Promise<void> {
    const documentRef = doc(this.itemsCollection, 'settings');
    return setDoc(documentRef, value);
  }

  public get(): Promise<DocumentSnapshot<DocumentData>> {
    const documentRef = doc(this.itemsCollection, 'settings');
    return getDoc(documentRef);
  }

}
