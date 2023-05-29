import {Injectable} from "@angular/core";
import {State} from "@ngxs/store";

@State<string[]>({
  name: 'event',
  defaults: []
})
@Injectable()
export class EventState {
}
