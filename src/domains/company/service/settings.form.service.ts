import {inject, Injectable} from '@angular/core';
import {DocumentData, DocumentSnapshot} from '@angular/fire/firestore';
import {SettingsFirebasePort} from '@company/port/settings.firebase.port';

@Injectable({
  providedIn: 'root'
})
export class SettingsFormService {
  private readonly settingsFirebasePort: SettingsFirebasePort = inject(SettingsFirebasePort);

  public save(value: any): void {
    this.settingsFirebasePort.save(value);
  }

  public get(): Promise<DocumentSnapshot<DocumentData>> {
    return this.settingsFirebasePort.get();
  }
}
