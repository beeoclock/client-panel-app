import {Injectable} from '@angular/core';
import {doc, DocumentSnapshot, getDoc} from '@angular/fire/firestore';
import {FirebaseAdapter} from '@utility/adapter/firebase-adapter.service';
import * as Company from '@company/domain'

@Injectable({
  providedIn: 'root'
})
export class SettingsFirebaseAdapter extends FirebaseAdapter<Company.Interface.ISettings> {

  constructor() {
    super();
    this.initCollectionReference('company');
  }

  public override save(value: Company.Interface.ISettings): Promise<void> {
    return super.save(value, 'settings');
  }

  public get(): Promise<DocumentSnapshot<Company.Interface.ISettings>> {
    const documentRef = doc(this.itemsCollection, 'settings');
    return getDoc(documentRef);
  }

}
