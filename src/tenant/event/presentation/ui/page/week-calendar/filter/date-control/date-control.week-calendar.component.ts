import { afterNextRender, Component, DestroyRef, inject, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { Reactive } from '@core/cdk/reactive';
import { Store } from '@ngxs/store';
import { IntervalTypeEnum } from '@src/tenant/analytic/domain/enum/interval.enum';
import { DateSliderControlComponent } from '@src/tenant/analytic/presentation/component/control/date-slider/date-slider.control.component';
import { CalendarWithSpecialistsAction } from '@src/tenant/event/infrastructure/state/calendar-with-specialists/calendar-with-specialists.action';
import { switchMap } from 'rxjs';

@Component({
	selector: 'event-date-control-week-calendar-component',
	template: `
		<app-date-slider-control-component [form]="form" [onlyWeek]="true" />
	`,
	standalone: true,
	imports: [
		DateSliderControlComponent,
	],
	encapsulation: ViewEncapsulation.None,
})
export class DateControlWeekCalendarComponent {
	
	public readonly dateControl: FormControl<string> = new FormControl(new Date().toISOString(), {
		nonNullable: true,
	});

	public readonly form = new FormGroup<{
		interval: FormControl<IntervalTypeEnum>;
		selectedDate: FormControl<string>;
	}>({
		interval: new FormControl<IntervalTypeEnum>(IntervalTypeEnum.week, {
			nonNullable: true,
		}),
		selectedDate: new FormControl<string>((new Date()).toISOString(), {
			nonNullable: true,
		}),
	});

	private readonly store = inject(Store);
	private readonly destroyRef = inject(DestroyRef);

	public constructor() {
		afterNextRender(() => {
			this.form.valueChanges.pipe(
				takeUntilDestroyed(this.destroyRef),
				switchMap(() => {
					// Get start and end of the week based on selected date and interval
					const formValue = this.form.getRawValue();
					const { selectedDate } = formValue;
					
					const date = new Date(selectedDate);
					const dayOfWeek = date.getDay();
					const startOfWeek = new Date(date);
					startOfWeek.setDate(date.getDate() - dayOfWeek);
					
					const endOfWeek = new Date(startOfWeek);
					endOfWeek.setDate(startOfWeek.getDate() + 6);
					endOfWeek.setHours(23, 59, 59, 999);
					
					return this.store.dispatch(new CalendarWithSpecialistsAction.SetDate({
						start: startOfWeek.toISOString(),
						end: endOfWeek.toISOString()
					}));
				}),
				switchMap(() => {
					return this.store.dispatch(new CalendarWithSpecialistsAction.GetItems());
				})
			).subscribe();
		});
	}
}
