import {ChangeDetectorRef, Component, inject, input, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {WhacAMoleProvider} from "@utility/presentation/whac-a-mole/whac-a-mole.provider";
import {Reactive} from "@utility/cdk/reactive";
import {BooleanStreamState} from "@utility/domain/boolean-stream.state";
import {IMember} from "@tenant/member/domain/interface/i.member";

@Component({
	selector: 'app-members-absence-form-container',
	encapsulation: ViewEncapsulation.None,
	imports: [
		TranslateModule,
		NgSelectModule,
		ReactiveFormsModule,
	],
	standalone: true,
	template: `
		@if (visibleState.isTrue) {

			<button
				class="border hover:border-blue-700 cursor-pointer flex hover:bg-blue-500 hover:text-white bg-gray-50 justify-between px-3 py-2 rounded-lg transition-all w-full"
				type="button" (click)="openModalToSelectMember()">
				<span>{{ 'keyword.capitalize.members' | translate }}: {{ members().value.length }}</span>
				<span class="">
                <i class="bi bi-chevron-right"></i>
            </span>
			</button>
		}
	`
})
export class MembersAbsenceFormContainerComponent extends Reactive implements OnInit {

	public readonly entireBusiness = input.required<FormControl<boolean>>();

	public readonly members = input.required<FormControl<IMember.DTO[]>>();

	private readonly translateService = inject(TranslateService);
	private readonly whacAMaleProvider = inject(WhacAMoleProvider);
	private readonly changeDetectorRef = inject(ChangeDetectorRef);

	public readonly visibleState = new BooleanStreamState(false);

	public ngOnInit(): void {
		this.updateIsNotFull();
		this.entireBusiness().valueChanges.pipe(
			this.takeUntil(),
		).subscribe(() => {
			this.updateIsNotFull();
		});
	}

	public updateIsNotFull(): void {
		this.visibleState.toggle(!this.entireBusiness().value);
		this.changeDetectorRef.detectChanges();
	}

	public async openModalToSelectMember() {

		const {SelectMemberPushBoxComponent} = await import("@tenant/member/presentation/push-box/select-member.push-box.component");

		const title = this.translateService.instant('absence.form.membersIds.select.title');

		const pushBoxWrapperComponentRef = await this.whacAMaleProvider.buildItAsync({
			title,
			component: SelectMemberPushBoxComponent,
			componentInputs: {
				selectedMemberList: this.members().value
			},
			button: {
				close: {
					text: this.translateService.instant('keyword.capitalize.done'),
					classList: ['text-blue-500', 'capitalize', 'hover:text-blue-600', 'transition-all']
				}
			}
		});

		if (!pushBoxWrapperComponentRef) {
			return;
		}

		const {renderedComponentRef} = pushBoxWrapperComponentRef.instance;

		if (!renderedComponentRef) {
			return;
		}

		try {
			const {instance} = renderedComponentRef;
			if (instance instanceof SelectMemberPushBoxComponent) {
				instance.selectedMembersListener.pipe(this.takeUntil()).subscribe(() => {
					const {newSelectedMemberList} = instance;
					this.members().patchValue(newSelectedMemberList);
					this.changeDetectorRef.detectChanges();
				});
			}
		} catch (error) {
			console.error(error);
		}

	}
}
