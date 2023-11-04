import {Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

@Directive({
  selector: '[appDebounceClick]',
  standalone: true
})
export class DebounceClickDirective implements OnInit, OnDestroy {

  @Input()
  public enabledDebounceClick = true;

  @Input()
  public debounceTime = 250;

  @Output()
  public debounceClick = new EventEmitter();

  private clicks = new Subject();
  private subscription: Subscription | undefined;

  public ngOnInit(): void {
    this.subscription = this.clicks
      .pipe(debounceTime(this.debounceTime))
      .subscribe(e => this.debounceClick.emit(e));
  }

  public ngOnDestroy(): void {
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
    if (this.enabledDebounceClick) {
      this.clicks.next(event);
    } else {
      this.debounceClick.emit(event);
    }
  }

}
