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
export class FirebaseAdapter<ITEM> {

  private readonly firestore: Firestore = inject(Firestore);
  protected itemsCollection!: CollectionReference<ITEM>;
  private path: string | undefined;
  private orderBy: string | undefined;

  public initCollectionReference(path: string, orderBy: string): void {
    if (this.path) {
      return;
    }
    this.path = path;
    this.orderBy = orderBy;
    this.itemsCollection = collection(this.firestore, this.path) as CollectionReference<ITEM>;
  }

  public save(value: ITEM, forceId?: string | undefined | null): Promise<void> {
    const documentRef = doc(this.itemsCollection, forceId ?? doc(this.itemsCollection).id);
    return setDoc(documentRef, value);
  }

  public item(id: string): Promise<DocumentSnapshot<ITEM>> {
    const documentRef = doc(this.itemsCollection, id);
    return getDoc(documentRef);
  }

  public list(): Promise<QuerySnapshot<ITEM>> {
    if (!this.orderBy) {
      throw new Error('OrderBy is empty.')
    }
    const q = query(this.itemsCollection, orderBy(this.orderBy), limit(25));
    return getDocs(q) as unknown as Promise<QuerySnapshot<ITEM>>;
  }

}
