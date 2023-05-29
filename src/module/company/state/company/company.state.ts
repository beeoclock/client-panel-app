import {Injectable} from "@angular/core";
import {State} from "@ngxs/store";

@State<string[]>({
  name: 'company',
  defaults: []
})
@Injectable()
export class CompanyState {
}
