import {
	afterNextRender,
	ChangeDetectorRef,
	Component,
	DestroyRef,
	inject,
	Input,
	OnInit,
	signal,
	viewChild,
	ViewEncapsulation
} from "@angular/core";
import {CardComponent} from "@shared/presentation/ui/component/card/card.component";
import {TranslateModule} from "@ngx-translate/core";
import {AssignmentsForm} from "@tenant/member/member/presentation/form/member.form";
import {SwitchComponent} from "@shared/presentation/ui/component/switch/switch.component";
import {IonSelectServiceComponent} from "@shared/presentation/ui/component/input/ion/ion-select-service.component";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {explicitEffect} from "ngxtension/explicit-effect";
import {FormControl} from "@angular/forms";

@Component({
	selector: 'member-form-assignments',
	standalone: true,
	templateUrl: './assignments.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		CardComponent,
		TranslateModule,
		SwitchComponent,
		IonSelectServiceComponent
	]
})
export class MemberFormAssignmentsComponent implements OnInit {

	@Input({required: true})
	public form!: AssignmentsForm;

	public readonly control = new FormControl<string[]>([]);

	public readonly ionSelectServiceComponent = viewChild(IonSelectServiceComponent);

	private readonly changeDetectorRef = inject(ChangeDetectorRef);
	private readonly destroyRef = inject(DestroyRef);

	public readonly isNotFull = signal(false);

	public constructor() {

		explicitEffect([this.isNotFull, this.ionSelectServiceComponent], () => {
			const isNotFull = this.isNotFull();
			if (isNotFull) {

				this.control.setValue(this.form.controls.service.controls.include.value.map(({service: {_id}}) => _id));

				const ionSelectServiceComponent = this.ionSelectServiceComponent();
				if (ionSelectServiceComponent) {
					const ionSelect = ionSelectServiceComponent.ionSelect();
					if (ionSelect) {
						ionSelect.ionChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
							const {detail: {value}} = event;
							const services = ionSelectServiceComponent.services();
							const controlNewValue = value.map((serviceId: string) => {
								const service = services.find((service) => service._id === serviceId)
								return {
									service,
								};
							});
							this.form.controls.service.controls.include.patchValue(controlNewValue);
						});
					}
				}
			}

		});

		afterNextRender(() => {

			this.form.controls.service.controls.full.valueChanges.pipe(
				takeUntilDestroyed(this.destroyRef),
			).subscribe(() => {
				this.updateIsNotFull();
			});

		});

	}

	public ngOnInit(): void {
		this.updateIsNotFull();
	}

	public updateIsNotFull(): void {
		this.isNotFull.set(this.form.controls.service.isNotFull);
		this.changeDetectorRef.detectChanges();
	}

}
