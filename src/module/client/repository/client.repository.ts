import {Injectable} from '@angular/core';
import {ClientApiAdapter} from "@client/adapter/api/client.api.adapter";

@Injectable({
  providedIn: 'root'
})
export class ClientRepository extends ClientApiAdapter {
}
