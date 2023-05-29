import {Injectable} from "@angular/core";
import {State} from "@ngxs/store";

@State<string[]>({
  name: 'customer',
  defaults: []
})
@Injectable()
export class CustomerState {
}
