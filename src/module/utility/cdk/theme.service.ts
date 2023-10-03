import {inject, Injectable} from "@angular/core";
import {DOCUMENT} from "@angular/common";

@Injectable({
  providedIn: "root"
})
export class ThemeService {

  private readonly document = inject(DOCUMENT);

  public initialize(): void {

		const theme = localStorage.getItem('theme') || 'light';
		this.document.documentElement.setAttribute('data-theme', theme);
		this.document.documentElement.classList.add(theme);

  }

}
