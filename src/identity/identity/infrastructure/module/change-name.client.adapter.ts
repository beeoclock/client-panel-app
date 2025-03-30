import {inject, Injectable} from "@angular/core";
import {ChangeNameApiAdapter} from "@identity/identity/infrastructure/api/change-name.api.adapter";

@Injectable({
  providedIn: 'root'
})
export class ChangeNameClientAdapter {

  public readonly changeNameApiAdapter = inject(ChangeNameApiAdapter);

}
