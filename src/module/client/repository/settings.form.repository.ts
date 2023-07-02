import {Injectable} from '@angular/core';
import {SettingsApiAdapter} from "@client/adapter/api/settings.api.adapter";

@Injectable({
  providedIn: 'root'
})
export class SettingsFormRepository extends SettingsApiAdapter {
}
