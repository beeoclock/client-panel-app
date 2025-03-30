import {
	Component,
	inject,
	Input,
	input,
	OnChanges,
	OnInit,
	SimpleChanges,
	viewChild,
	ViewEncapsulation
} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {Store} from "@ngxs/store";
import {MemberForm} from "@tenant/member/presentation/form/member.form";
import {firstValueFrom} from "rxjs";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {SelectRoleComponent} from "@tenant/member/presentation/component/form/select-role/select-role.component";
import {
	AvatarContainerComponent
} from "@tenant/member/presentation/component/form/avatar-container/avatar-container.component";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {SwitchComponent} from "@utility/presentation/component/switch/switch.component";
import {CommonModule} from "@angular/common";
import {
	MemberFormAssignmentsComponent
} from "@tenant/member/presentation/component/form/assignments/assignments.component";
import {MemberProfileStatusEnum} from "@tenant/member/domain/enums/member-profile-status.enum";
import {IMember} from "@tenant/member/domain/interface/i.member";
import {RoleEnum} from "@core/shared/enum/role.enum";
import {MemberDataActions} from "@tenant/member/infrastructure/state/data/member.data.actions";

@Component({
	selector: 'member-form-page',
	templateUrl: './member-form-container.component.html',
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
	],
	standalone: true
})
export class MemberFormContainerComponent implements OnInit, OnChanges {

	public readonly roleEnum = RoleEnum;

	readonly avatarContainerComponent = viewChild.required(AvatarContainerComponent);

	private readonly store = inject(Store);

	public form = new MemberForm();

	public readonly memberProfileStatusEnum = MemberProfileStatusEnum;

	public readonly item = input<IMember.EntityRaw>();

	@Input()
	public isEditMode = false;

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
		if (this.isEditMode && item) {
			this.isEditMode = true;
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
			if (this.isEditMode) {
				await firstValueFrom(this.store.dispatch(new MemberDataActions.UpdateItem(memberBody)));
			} else {
				await firstValueFrom(this.store.dispatch(new MemberDataActions.CreateItem(memberBody)));
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
