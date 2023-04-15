import {Injectable} from '@angular/core';
import {doc, DocumentSnapshot, getDoc} from '@angular/fire/firestore';
import {FirebaseAdapter} from '@utility/infrastructure/adapt/firebase-adapter.service';
import {ISettings} from '@src/domain/company/interface/settings.interface';

@Injectable({
  providedIn: 'root'
})
export class SettingsFirebaseAdapter extends FirebaseAdapter<ISettings> {

  constructor() {
    super();
    this.initCollectionReference('company');
  }

  public override save(value: ISettings): Promise<void> {
    return super.save(value, 'settings');
  }

  public get(): Promise<DocumentSnapshot<ISettings>> {
    const documentRef = doc(this.itemsCollection, 'settings');
    return getDoc(documentRef);
  }

}
