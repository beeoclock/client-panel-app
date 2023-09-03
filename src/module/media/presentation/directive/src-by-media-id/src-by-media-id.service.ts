import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class SrcByMediaIdService {

  public readonly cache: Map<string, string> = new Map<string, string>();

}
