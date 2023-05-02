import {Injectable} from '@angular/core';
import {CompanyFirebaseAdapter} from '@company/adapter/firebase/company.firebase.adapter';

@Injectable({
  providedIn: 'root'
})
export class SettingsFormRepository extends CompanyFirebaseAdapter {
}
