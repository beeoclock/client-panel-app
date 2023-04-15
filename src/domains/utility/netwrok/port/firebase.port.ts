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

@Injectable({
  providedIn: 'root'
})
export class FirebasePort<ITEM> {

  private readonly firestore: Firestore = inject(Firestore);
  protected itemsCollection!: CollectionReference<ITEM>;
  private path: string | undefined;

  public initCollectionReference(path: string): void {
    if (this.path) {
      return;
    }
    this.path = path;
    this.itemsCollection = collection(this.firestore, this.path) as CollectionReference<ITEM>;
  }

  public save(value: ITEM, forceId?: string | undefined): Promise<void> {
    const documentRef = doc(this.itemsCollection, forceId ?? doc(this.itemsCollection).id);
    return setDoc(documentRef, value);
  }

  public item(id: string): Promise<DocumentSnapshot<ITEM>> {
    const documentRef = doc(this.itemsCollection, id);
    return getDoc(documentRef);
  }

  public list(): Promise<QuerySnapshot<ITEM>> {
    const q = query(this.itemsCollection, orderBy('lastName'), limit(25));
    return getDocs(q) as unknown as Promise<QuerySnapshot<ITEM>>;
  }

}
