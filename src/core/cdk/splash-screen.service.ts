import {inject, Injectable} from "@angular/core";
import {MS_HALF_SECOND} from "@shared/domain/const/c.time";
import {DOCUMENT} from "@angular/common";

@Injectable({
  providedIn: "root"
})
export class SplashScreenService {

  private readonly document = inject(DOCUMENT);
  private isHidden = false;

  public hide(): void {

    if (this.isHidden) {
      return;
    }

    this.isHidden = true;

    setTimeout(() => {
      this.document.body.style.setProperty('--custom-opacity', '0');
      this.document.body.style.setProperty('--custom-visibility', 'hidden');
    }, MS_HALF_SECOND);

  }

}
