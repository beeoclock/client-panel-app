import {inject, Injectable} from "@angular/core";
import {DOCUMENT} from "@angular/common";

@Injectable({
  providedIn: "root"
})
export class SidebarService {

  public readonly document = inject(DOCUMENT);

  public toggleSidebar(force?: boolean): void {
    this.document.getElementById('main-sidebar')?.classList?.toggle('translate-x-0', force);
  }

}
