import {Directive, HostListener, input, OnDestroy, OnInit, output} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {Reactive} from "@utility/cdk/reactive";

@Directive({
  selector: '[appDebounceClick]',
  standalone: true
})
export class DebounceClickDirective extends Reactive implements OnInit, OnDestroy {

  public readonly enabledDebounceClick = input(true);

  public readonly debounceTime = input(250);

  public readonly debounceClick = output();

  private clicks = new Subject();
  private subscription: Subscription | undefined;

  public ngOnInit(): void {
    this.subscription = this.clicks
      .pipe(
          debounceTime(this.debounceTime()),
          this.takeUntil(),
      )
      .subscribe(e => this.debounceClick.emit(e));
  }

  public override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.subscription?.unsubscribe();
  }

  /**
   *
   * @param event
   * @private
   */
  @HostListener('click', ['$event'])
  private clickEvent(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.enabledDebounceClick()) {
      this.clicks.next(event);
    } else {
      this.debounceClick.emit(event);
    }
  }

}
