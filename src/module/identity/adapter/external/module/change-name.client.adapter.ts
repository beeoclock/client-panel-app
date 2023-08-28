import {inject, Injectable} from "@angular/core";
import {ChangeNameApiAdapter} from "@identity/adapter/external/api/change-name.api.adapter";

@Injectable({
  providedIn: 'root'
})
export class ChangeNameClientAdapter {

  public readonly changeNameApiAdapter = inject(ChangeNameApiAdapter);

}
