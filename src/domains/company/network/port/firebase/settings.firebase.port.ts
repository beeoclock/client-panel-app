import {Injectable} from '@angular/core';
import {doc, DocumentSnapshot, getDoc} from '@angular/fire/firestore';
import {FirebasePort} from '@utility/netwrok/port/firebase.port';
import {ISettings} from '@company/infrastructure/settings.interface';

@Injectable({
  providedIn: 'root'
})
export class SettingsFirebasePort extends FirebasePort<ISettings> {

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
