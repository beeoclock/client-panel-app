import {Injectable} from '@angular/core';
import {doc, DocumentSnapshot, getDoc} from '@angular/fire/firestore';
import {FirebaseAdapter} from '@utility/adapter/firebase-adapter.service';
import * as Company from '@company/domain'

@Injectable({
  providedIn: 'root'
})
export class SettingsFirebaseAdapter extends FirebaseAdapter<Company.ISettings> {

  constructor() {
    super();
    this.initCollectionReference('company');
  }

  public override save(value: Company.ISettings): Promise<void> {
    return super.save(value, 'settings');
  }

  public get(): Promise<DocumentSnapshot<Company.ISettings>> {
    const documentRef = doc(this.itemsCollection, 'settings');
    return getDoc(documentRef);
  }

}
