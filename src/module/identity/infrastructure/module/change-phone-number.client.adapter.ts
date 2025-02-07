import {inject, Injectable} from "@angular/core";
import {ChangePhoneNumberApiAdapter} from "@identity/infrastructure/api/change-phone-number.api.adapter";

@Injectable({
  providedIn: 'root'
})
export class ChangePhoneNumberClientAdapter {

  public readonly changePhoneNumberApiAdapter = inject(ChangePhoneNumberApiAdapter);

}
