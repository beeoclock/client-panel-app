import {Injectable} from "@angular/core";
import {State} from "@ngxs/store";

@State<string[]>({
  name: 'employee',
  defaults: []
})
@Injectable()
export class EmployeeState {
}
