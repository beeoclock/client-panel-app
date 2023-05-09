import {Component, OnDestroy} from '@angular/core';
import {MonoTypeOperatorFunction, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  template: ``
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export abstract class Reactive implements OnDestroy {

  private readonly unsubscribe$ = new Subject<void>();

  public ngOnDestroy(): void {
    this.unsubscribe();
  }

  protected unsubscribe(): void {

    if (this.unsubscribe$) {

      if (this.unsubscribe$.isStopped) {
        return;
      }

      this.unsubscribe$.next();
      this.unsubscribe$.complete();

    }
  }

  protected takeUntil<T>(): MonoTypeOperatorFunction<T> {
    return takeUntil(this.unsubscribe$);
  }

}
