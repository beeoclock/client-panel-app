import {Directive, OnDestroy} from '@angular/core';
import {MonoTypeOperatorFunction, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Directive()
export abstract class Reactive implements OnDestroy {

  private readonly unsubscribe$ = new Subject<void>();

  public ngOnDestroy(): void {
    this.unsubscribe();
  }

  protected unsubscribe(): void {

    if (this.unsubscribe$) {

      this.unsubscribe$.next();
      this.unsubscribe$.complete();
      this.unsubscribe$.unsubscribe();

    }

  }

  protected takeUntil<T>(): MonoTypeOperatorFunction<T> {
    return takeUntil(this.unsubscribe$);
  }

}


