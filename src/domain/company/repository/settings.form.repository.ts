import {inject, Injectable} from '@angular/core';
import {DocumentSnapshot} from '@angular/fire/firestore';
import {SettingsFirebaseAdapter} from '@src/domain/company/adapter/firebase/settings.firebase.adapter';
import {Repository} from '@src/domain/utility/infrastructure/repository/repository';
import {ISettings} from '@src/domain/company/interface/settings.interface';

@Injectable({
  providedIn: 'root'
})
export class SettingsFormRepository extends Repository {
  private readonly settingsAdapter: SettingsFirebaseAdapter = inject(SettingsFirebaseAdapter);

  public override save(value: any): Promise<void> {
    return this.settingsAdapter.save(value);
  }

  public override item(): Promise<DocumentSnapshot<ISettings>> {
    return this.settingsAdapter.get();
  }
}
