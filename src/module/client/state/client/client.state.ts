import {Injectable} from "@angular/core";
import {State} from "@ngxs/store";

@State<string[]>({
  name: 'client',
  defaults: []
})
@Injectable()
export class ClientState {
}
