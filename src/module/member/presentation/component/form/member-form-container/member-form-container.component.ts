import {Component, inject, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {Store} from "@ngxs/store";
import {MemberForm} from "@member/presentation/form/member.form";
import {firstValueFrom} from "rxjs";
import {RIMember} from "@member/domain";
import {MemberActions} from "@member/state/member/member.actions";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {SelectRoleComponent} from "@member/presentation/component/form/select-role/select-role.component";
import {
	AvatarContainerComponent
} from "@member/presentation/component/form/avatar-container/avatar-container.component";

@Component({
	selector: 'member-form-page',
	templateUrl: './member-form-container.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		AvatarContainerComponent,
		PrimaryButtonDirective,
		TranslateModule,
		SelectRoleComponent,
		FormInputComponent,
	],
	standalone: true
})
export class MemberFormContainerComponent implements OnInit {

	// TODO move functions to store effects/actions

	@ViewChild(AvatarContainerComponent)
	public avatarContainerComponent!: AvatarContainerComponent;

	private readonly store = inject(Store);

	public form = new MemberForm();

	@Input()
	public item: RIMember | undefined;

	@Input()
	public isEditMode = false;

	public ngOnInit(): void {
		this.detectItem();
	}

	public detectItem(): void {
		if (this.isEditMode && this.item) {
			this.isEditMode = true;
			this.form = MemberForm.create(this.item);
			this.form.updateValueAndValidity();
		}
	}

	public async save(): Promise<void> {
		this.form.markAllAsTouched();
		if (this.form.valid) {
			this.form.disable();
			this.form.markAsPending();
			const memberBody = this.form.getRawValue() as RIMember;
			let memberId = memberBody._id;
			if (this.isEditMode) {
				await firstValueFrom(this.store.dispatch(new MemberActions.UpdateItem(memberBody)));
			} else {
				await firstValueFrom(this.store.dispatch(new MemberActions.CreateItem(memberBody)));
				memberId = this.item?._id ?? memberId;
			}

			await Promise.all([
				this.avatarContainerComponent.save(memberId)
			]);
			this.form.enable();
			this.form.updateValueAndValidity();

		}
	}
}
