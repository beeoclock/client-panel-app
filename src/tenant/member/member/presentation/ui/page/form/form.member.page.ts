import {Component, inject, input, OnChanges, OnInit, SimpleChanges, viewChild, ViewEncapsulation} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {Actions, ofActionSuccessful, Store} from "@ngxs/store";
import {MemberForm} from "@tenant/member/member/presentation/form/member.form";
import {firstValueFrom, tap} from "rxjs";
import {FormInputComponent} from "@shared/presentation/ui/component/input/form.input.component";
import {PrimaryButtonDirective} from "@shared/presentation/directives/button/primary.button.directive";
import {SelectRoleComponent} from "@tenant/member/member/presentation/component/form/select-role/select-role.component";
import {
	AvatarContainerComponent
} from "@tenant/member/member/presentation/component/form/avatar-container/avatar-container.component";
import {CardComponent} from "@shared/presentation/ui/component/card/card.component";
import {SwitchComponent} from "@shared/presentation/ui/component/switch/switch.component";
import {CommonModule} from "@angular/common";
import {
	MemberFormAssignmentsComponent
} from "@tenant/member/member/presentation/component/form/assignments/assignments.component";
import {MemberProfileStatusEnum} from "@tenant/member/member/domain/enums/member-profile-status.enum";
import {IMember} from "@tenant/member/member/domain/interface/i.member";
import {RoleEnum} from "@core/shared/enum/role.enum";
import {MemberDataActions} from "@tenant/member/member/infrastructure/state/data/member.data.actions";
import {
	MemberPresentationActions
} from "@tenant/member/member/infrastructure/state/presentation/member.presentation.actions";
import {TelFormInputComponent} from "@shared/presentation/ui/component/tel-form-input/tel.form.input.component";
import {NGXLogger} from "ngx-logger";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
	selector: 'member-form-page',
	templateUrl: './form.member.page.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		CommonModule,
		AvatarContainerComponent,
		PrimaryButtonDirective,
		TranslateModule,
		SelectRoleComponent,
		FormInputComponent,
		CardComponent,
		SwitchComponent,
		MemberFormAssignmentsComponent,
		TelFormInputComponent,
	],
	standalone: true
})
export class FormMemberPage implements OnInit, OnChanges {

	public readonly roleEnum = RoleEnum;

	readonly avatarContainerComponent = viewChild.required(AvatarContainerComponent);

	public form = MemberForm.create();

	public readonly memberProfileStatusEnum = MemberProfileStatusEnum;

	public readonly item = input<IMember.EntityRaw>();

	public readonly isEditMode = input<boolean>(false);

	private readonly store = inject(Store);
	private readonly ngxLogger = inject(NGXLogger);
	private readonly actions = inject(Actions);

	private readonly actionsCreateUpdateSubscription = this.actions.pipe(
		takeUntilDestroyed(),
		ofActionSuccessful(
			MemberDataActions.UpdateItem,
			MemberDataActions.CreateItem,
		),
		tap((payload) => {
			this.ngxLogger.debug('Member form action successful', payload);
			const action = new MemberPresentationActions.CloseForm();
			this.store.dispatch(action);
		})
	).subscribe()

	public ngOnInit(): void {
		this.detectItem();
	}

	public ngOnChanges(changes: SimpleChanges & { item: IMember.EntityRaw | undefined }) {

		const {item} = changes;
		if (item) {
			this.detectItem();
		}

	}

	public detectItem(): void {
		const item = this.item();
		if (this.isEditMode() && item) {
			this.form = MemberForm.create(item);
			this.form.updateValueAndValidity();
		}
	}

	public async save(): Promise<void> {
		this.form.markAllAsTouched();
		if (this.form.valid) {

			this.form.disable();
			this.form.markAsPending();
			const memberBody = this.form.getRawValue();
			let memberId = memberBody._id;
			const actions: any[] = [
				new MemberPresentationActions.CloseForm(),
			];
			if (this.isEditMode()) {
				actions.unshift(new MemberDataActions.UpdateItem(memberBody));
			} else {
				actions.unshift(new MemberDataActions.CreateItem(memberBody));
			}
			const action$ = this.store.dispatch(actions);
			await firstValueFrom(action$);
			if (!this.isEditMode()) {
				memberId = this.item()?._id ?? memberId;
			}

			await Promise.all([
				this.avatarContainerComponent().save(memberId)
			]);
			this.form.enable();
			this.form.updateValueAndValidity();

		}
	}
}

export default FormMemberPage;
