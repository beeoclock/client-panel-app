import {inject, Injectable} from "@angular/core";
import {ChangeNameApiAdapter} from "@src/identity/module/identity/infrastructure/api/change-name.api.adapter";

@Injectable({
  providedIn: 'root'
})
export class ChangeNameClientAdapter {

  public readonly changeNameApiAdapter = inject(ChangeNameApiAdapter);

}
