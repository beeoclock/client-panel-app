import {BehaviorSubject} from "rxjs";

export class BooleanStreamState {

  readonly #state$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.state);
  public readonly state$ = this.#state$.asObservable();

  constructor(
    private state: boolean = true,
  ) {
  }

  public get isTrue(): boolean {
    return this.#state$.value;
  }

  public get isFalse(): boolean {
    return !this.isTrue;
  }

  public toggle(force?: boolean): void {
    this.#state$.next(force ?? !this.isTrue);
  }

  public doTrue(): void {
    this.toggle(true);
  }

  public doFalse(): void {
    this.toggle(false);
  }
}
