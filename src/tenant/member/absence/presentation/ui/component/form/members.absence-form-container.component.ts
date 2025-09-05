import {
	afterNextRender,
	ChangeDetectorRef,
	Component,
	DestroyRef,
	inject,
	input,
	OnInit,
	signal,
	viewChild,
	ViewEncapsulation
} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {IMember} from "@tenant/member/member/domain/interface/i.member";
import {IonSelectMemberComponent} from "@shared/presentation/ui/component/input/ion/ion-select-member.component";
import {explicitEffect} from "ngxtension/explicit-effect";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
	selector: 'app-members-absence-form-container',
	encapsulation: ViewEncapsulation.None,
	imports: [
		TranslateModule,
		NgSelectModule,
		ReactiveFormsModule,
		IonSelectMemberComponent,
	],
	standalone: true,
	template: `
		@if (isNotFull()) {
			<ion-select-member
				class="max-w-full"
				placeholderTranslateKey="member.form.assignments.button.hint.includeIsEmpty"
				[control]="control"/>
		}
	`
})
export class MembersAbsenceFormContainerComponent implements OnInit {

	public readonly control = new FormControl<string[]>([]);

	public readonly entireBusiness = input.required<FormControl<boolean>>();

	public readonly members = input.required<FormControl<IMember.DTO[]>>();

	private readonly changeDetectorRef = inject(ChangeDetectorRef);
	private readonly destroyRef = inject(DestroyRef);

	public readonly isNotFull = signal(false);

	public readonly ionSelectMemberComponent = viewChild(IonSelectMemberComponent);

	public constructor() {

		explicitEffect([this.isNotFull, this.ionSelectMemberComponent], () => {
			const isNotFull = this.isNotFull();
			if (isNotFull) {

				const memberIds = this.members().value.map(({_id}) => _id);
				this.control.setValue(memberIds);

				const ionSelectMemberComponent = this.ionSelectMemberComponent();
				if (ionSelectMemberComponent) {
					const ionSelect = ionSelectMemberComponent.ionSelect();
					if (ionSelect) {
						ionSelect.ionChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
							const {detail: {value}} = event;
							const members = ionSelectMemberComponent.members;
							const controlNewValue = value.map((memberId: string) => {
								const member = members.find((member) => member._id === memberId)
								return member;
							});
							this.members().patchValue(controlNewValue);
						});
					}
				}
			}
		});

		afterNextRender(() => {

			this.members().valueChanges.pipe(
				takeUntilDestroyed(this.destroyRef),
			).subscribe(() => {
				this.updateIsNotFull();
			});

		});

	}

	public ngOnInit(): void {
		this.updateIsNotFull();
		this.entireBusiness().valueChanges.pipe(
			takeUntilDestroyed(this.destroyRef),
		).subscribe(() => {
			this.updateIsNotFull();
		});
	}

	public updateIsNotFull(): void {
		this.isNotFull.set(!this.entireBusiness().value);
		this.changeDetectorRef.detectChanges();
	}

}
