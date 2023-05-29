import {Injectable} from "@angular/core";
import {State} from "@ngxs/store";

@State<string[]>({
  name: 'service',
  defaults: []
})
@Injectable()
export class ServiceState {
}
