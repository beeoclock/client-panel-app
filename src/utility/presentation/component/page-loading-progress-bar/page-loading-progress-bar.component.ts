import {Component, HostBinding} from "@angular/core";
import {Select} from "@ngxs/store";
import {AppState} from "@utility/state/app/app.state";
import {Observable} from "rxjs";

@Component({
  selector: 'utility-page-loading-progress-bar',
  standalone: true,
  template: `
    <div
      class="bg-beeColor-400 h-1.5 dark:bg-beeDarkColor-500 w-full transform-origin-0-50 animate-indeterminateAnimation"></div>
  `
})
export class PageLoadingProgressBarComponent {
  @HostBinding('class.hidden')
  public hidden = false;

  @HostBinding()
  public class = 'fixed w-full bg-beeColor-200 h-1.5 dark:bg-beeDarkColor-700 z-30';

  @Select(AppState.pageLoading)
  public readonly pageLoading!: Observable<boolean>;

  constructor() {
    this.pageLoading.subscribe((result) => {
      this.hidden = !result;
    });
  }

}
