import {Directive, HostListener, input, OnInit, output} from '@angular/core';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {Reactive} from "@utility/cdk/reactive";

@Directive({
	selector: '[appDebounceClick]',
	standalone: true
})
export class DebounceClickDirective extends Reactive implements OnInit {

	public readonly enabledDebounceClick = input(true);

	public readonly debounceTime = input(250);

	public readonly debounceClick = output<Event>();

	private readonly clicks = new Subject<Event>();

	public ngOnInit(): void {
		this.clicks
			.pipe(
				debounceTime(this.debounceTime()),
				this.takeUntil(),
			)
			.subscribe({
				next: (event) => {
					this.debounceClick.emit(event)
				},
				error: (error) => {
					console.error(error);
				}
			});
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
