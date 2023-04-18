import {inject, Injectable} from '@angular/core';
import {DocumentSnapshot} from '@angular/fire/firestore';
import {SettingsFirebaseAdapter} from '@src/module/company/adapter/firebase/settings.firebase.adapter';
import * as Utility from '@utility/domain';
import * as Company from '@company/domain';

@Injectable({
  providedIn: 'root'
})
export class SettingsFormRepository extends Utility.Repository {
  private readonly settingsAdapter: SettingsFirebaseAdapter = inject(SettingsFirebaseAdapter);

  public override save(value: any): Promise<void> {
    return this.settingsAdapter.save(value);
  }

  public override item(): Promise<DocumentSnapshot<Company.ISettings>> {
    return this.settingsAdapter.get();
  }
}
