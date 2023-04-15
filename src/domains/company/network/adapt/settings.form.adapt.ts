import {inject, Injectable} from '@angular/core';
import {DocumentSnapshot} from '@angular/fire/firestore';
import {SettingsFirebasePort} from '@company/network/port/firebase/settings.firebase.port';
import {Adapt} from '@utility/netwrok/adapt/adapt';
import {ISettings} from '@company/infrastructure/settings.interface';

@Injectable({
  providedIn: 'root'
})
export class SettingsFormAdapt extends Adapt {
  private readonly settingsFirebasePort: SettingsFirebasePort = inject(SettingsFirebasePort);

  public override save(value: any): void {
    this.settingsFirebasePort.save(value);
  }

  public override item(): Promise<DocumentSnapshot<ISettings>> {
    return this.settingsFirebasePort.get();
  }
}
