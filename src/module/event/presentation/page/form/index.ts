import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DeleteButtonComponent} from '@utility/presentation/component/button/delete.button.component';
import {ActivatedRoute, Router} from '@angular/router';
import {BackLinkComponent} from '@utility/presentation/component/link/back.link.component';
import {EventForm} from '@event/presentation/form/event.form';
import {AttendeesComponent} from '@event/presentation/component/form/attendees/attendees.component';
import {IEvent} from "@event/domain";
import {TranslateModule} from "@ngx-translate/core";
import {filter, firstValueFrom, Observable} from "rxjs";
import {Select, Store} from "@ngxs/store";
import {EventState} from "@event/state/event/event.state";
import {EventActions} from "@event/state/event/event.actions";
import {FormTextareaComponent} from "@utility/presentation/component/input/form.textarea.component";
import {ServicesComponent} from "@event/presentation/component/form/services/services.component";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {environment} from "@environment/environment";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {GeneralDetailsComponent} from "@event/presentation/component/details/general.details.component";
import {BooleanState} from "@utility/domain";
import {NgIf} from "@angular/common";
import {LinkButtonDirective} from "@utility/presentation/directives/button/link.button.directive";
import {NGXLogger} from "ngx-logger";
import {IService} from "@service/domain";
import {
	SelectTimeSlotComponent
} from "@event/presentation/component/form/select-time-slot/index/select-time-slot.component";
import {SlotsService} from "@event/presentation/component/form/select-time-slot/slots.service";
import {Reactive} from "@utility/cdk/reactive";

@Component({
	selector: 'event-form-page',
	templateUrl: './index.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		ReactiveFormsModule,
		DeleteButtonComponent,
		BackLinkComponent,
		FormsModule,
		TranslateModule,
		FormTextareaComponent,
		AttendeesComponent,
		ServicesComponent,
		CardComponent,
		PrimaryButtonDirective,
		GeneralDetailsComponent,
		NgIf,
		LinkButtonDirective,
		SelectTimeSlotComponent,
	],
	standalone: true
})
export default class Index extends Reactive implements OnInit {

	// TODO move functions to store effects/actions

	public isEditMode = false;

	private readonly store = inject(Store);
	public readonly activatedRoute = inject(ActivatedRoute);
	public readonly slotsService = inject(SlotsService);
	public readonly router = inject(Router);
	private readonly logger = inject(NGXLogger);

	public readonly form = new EventForm();

	public readonly preview = new BooleanState(false);

	public specialist = '';

	@Select(EventState.itemData)
	public itemData$!: Observable<IEvent | undefined>;

	public get value(): IEvent {
		return this.form.getRawValue() as IEvent;
	}

	constructor() {
		super();
	}

	public ngOnInit(): void {
		this.detectItem();
		this.form.controls.services.valueChanges.pipe(
			this.takeUntil(),
			filter((services) => !!services?.length)
		).subscribe(([firstService]) => {

			this.setSpecialist(firstService);

			// TODO update slots every changes of services
			this.slotsService.setSpecialist(this.specialist);
			this.slotsService.setEventDurationInSeconds(this.getEventDurationInSeconds(firstService));

		});
	}

	public getEventDurationInSeconds(service: IService): number {
		try {
			const [durationVersion] = service.durationVersions;
			const {durationInSeconds, breakInSeconds} = durationVersion;
			return (durationInSeconds ?? 0) + (breakInSeconds ?? 0);
		} catch (e) {
			return 0;
		}
	}

	private setSpecialist(service: IService): void {

		const [firstSpecialist] = service?.specialists ?? [];

		if (!firstSpecialist) {
			return;
		}

		const {member} = firstSpecialist;

		if (typeof member === 'string') {
			this.specialist = member;
		} else {
			this.specialist = member?._id ?? '';
		}
	}

	public detectItem(): void {

		firstValueFrom(this.activatedRoute.params.pipe(filter(({id}) => id?.length))).then(() => {

			firstValueFrom(this.itemData$).then(async (result) => {

				if (result?._id) {

					const {attendees, ...rest} = result;

					const dataFromRoute: {
						cacheLoaded: boolean;
						repeat: boolean;
						item: any; // This is all ngnx store
					} = this.activatedRoute.snapshot.data as any;

					if (dataFromRoute?.repeat) {

						const {start, end, status, _id, ...initialValue} = rest;

						this.form.patchValue(initialValue);

					} else {

						this.isEditMode = true;
						this.form.patchValue(rest);

					}

					if (attendees?.length) {

						this.form.controls.attendees.removeAt(0);

						attendees.forEach((attendee) => {

							const control = this.form.controls.attendees.pushNewOne(attendee);
							control.disable();

						});

					}

					this.form.updateValueAndValidity();

				}

			});

		});

	}

	public async save(): Promise<void> {

		this.form.updateValueAndValidity();
		this.form.markAllAsTouched();

		if (this.form.valid) {

			this.form.disable();
			this.form.markAsPending();
			const redirectUri = ['../'];
			const value = this.form.getRawValue() as IEvent;

			if (this.isEditMode) {

				await firstValueFrom(this.store.dispatch(new EventActions.UpdateItem(value)));

			} else {

				// Reset redirect uri
				redirectUri.length = 0;
				redirectUri.push('/', 'event');

				await firstValueFrom(this.store.dispatch(new EventActions.CreateItem(value)));
				await firstValueFrom(this.itemData$);

			}

			await this.router.navigate(redirectUri, {
				relativeTo: this.activatedRoute
			});

			// TODO check if customers/attends is exist in db (just check if selected customer has _id field if exist is in db if not then need to make request to create the new customer)

			this.form.enable();
			this.form.updateValueAndValidity();

		} else {
			if (!environment.production) {
				this.logger.error('Event:form', this.form, this.form.getRawValue());
			}
		}
	}

	public goToPreview(): void {
		this.form.updateValueAndValidity();
		this.form.markAllAsTouched();
		if (this.form.valid) {
			this.preview.switchOn();
		}
	}

}
