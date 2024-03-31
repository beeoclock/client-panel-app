import {Component, inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {DeleteButtonComponent} from '@utility/presentation/component/button/delete.button.component';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {BackLinkComponent} from '@utility/presentation/component/link/back.link.component';
import {HasErrorDirective} from '@utility/presentation/directives/has-error/has-error.directive';
import {InvalidTooltipDirective} from "@utility/presentation/directives/invalid-tooltip/invalid-tooltip.directive";
import {TranslateModule} from "@ngx-translate/core";
import {Select, Store} from "@ngxs/store";
import {MemberForm} from "@member/presentation/form/member.form";
import {MemberState} from "@member/state/member/member.state";
import {filter, firstValueFrom, Observable} from "rxjs";
import {RIMember} from "@member/domain";
import {MemberActions} from "@member/state/member/member.actions";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {BackButtonComponent} from "@utility/presentation/component/button/back.button.component";
import {DefaultPanelComponent} from "@utility/presentation/component/panel/default.panel.component";
import {SelectRoleComponent} from "@member/presentation/component/form/select-role/select-role.component";
import {
    AvatarContainerComponent
} from "@member/presentation/page/form/component/avatar-container/avatar-container.component";

@Component({
    selector: 'member-form-page',
    templateUrl: './index.html',
    encapsulation: ViewEncapsulation.None,
    imports: [
        ReactiveFormsModule,
        DeleteButtonComponent,
        HasErrorDirective,
        RouterLink,
        BackLinkComponent,
        InvalidTooltipDirective,
        TranslateModule,
        FormInputComponent,
        PrimaryButtonDirective,
        BackButtonComponent,
        DefaultPanelComponent,
        SelectRoleComponent,
        AvatarContainerComponent
    ],
    standalone: true
})
export default class Index implements OnInit {

    // TODO move functions to store effects/actions

    @ViewChild(AvatarContainerComponent)
    public avatarContainerComponent!: AvatarContainerComponent;

    private readonly store = inject(Store);
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);

    public form = new MemberForm();

    @Select(MemberState.itemData)
    public itemData$!: Observable<RIMember | undefined>;
    private isEditMode = false;

    public ngOnInit(): void {
        this.detectItem();
    }

    public detectItem(): void {
        firstValueFrom(this.activatedRoute.params.pipe(filter(({id}) => id?.length))).then(() => {
            firstValueFrom(this.itemData$).then((result) => {
                if (result) {
                    this.isEditMode = true;
                    this.form = MemberForm.create(result);
                    this.form.updateValueAndValidity();
                }
            });
        });
    }

    public async save(): Promise<void> {
        this.form.markAllAsTouched();
        if (this.form.valid) {
            this.form.disable();
            this.form.markAsPending();
            const redirectUri = ['../'];
            const memberBody = this.form.getRawValue() as RIMember;
            let memberId = memberBody._id;
            if (this.isEditMode) {
                await firstValueFrom(this.store.dispatch(new MemberActions.UpdateItem(memberBody)));
            } else {
                await firstValueFrom(this.store.dispatch(new MemberActions.CreateItem(memberBody)));
                const item = await firstValueFrom(this.itemData$);
                memberId = item?._id ?? memberId;
                if (item && item._id) {
                    redirectUri.push(item._id);
                }
            }

            await Promise.all([
                this.avatarContainerComponent.save(memberId)
            ]);

            await this.router.navigate(redirectUri, {
                relativeTo: this.activatedRoute
            });
            this.form.enable();
            this.form.updateValueAndValidity();

        }
    }
}
