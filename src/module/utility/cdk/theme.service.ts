import {inject, Injectable} from "@angular/core";
import {DOCUMENT} from "@angular/common";

@Injectable({
  providedIn: "root"
})
export class ThemeService {

  private readonly document = inject(DOCUMENT);

  public initialize(): void {

    if (localStorage.getItem('theme') === 'dark') {
      this.document.documentElement.classList.add('dark');
      this.document.documentElement.setAttribute('data-bs-theme', 'dark');
    }

  }

}
