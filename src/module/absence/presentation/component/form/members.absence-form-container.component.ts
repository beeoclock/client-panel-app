import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    Input,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {DatetimeLocalInputComponent} from "@utility/presentation/component/input/datetime-local.input.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {FormTextareaComponent} from "@utility/presentation/component/input/form.textarea.component";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {
    FormBusinessProfileComponent
} from "@client/presentation/component/business-profile/form-business-profile.component";
import {SwitchComponent} from "@utility/presentation/component/switch/switch.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {PushBoxService} from "@utility/presentation/component/push-box/push-box.service";
import {Reactive} from "@utility/cdk/reactive";
import {NgIf} from "@angular/common";
import {BooleanStreamState} from "@utility/domain/boolean-stream.state";

@Component({
    selector: 'app-members-absence-form-container',
    encapsulation: ViewEncapsulation.None,
    imports: [
        FormInputComponent,
        DatetimeLocalInputComponent,
        TranslateModule,
        FormTextareaComponent,
        CardComponent,
        FormBusinessProfileComponent,
        SwitchComponent,
        NgSelectModule,
        ReactiveFormsModule,
        NgIf
    ],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <button *ngIf="visibleState.isTrue" class="border hover:border-blue-700 cursor-pointer flex hover:bg-blue-500 hover:text-white bg-gray-50 justify-between px-3 py-2 rounded-lg transition-all w-full" type="button" (click)="openModalToSelectMember()">
            <span>{{ 'keyword.capitalize.members' | translate }}: {{ memberIds.value.length }}</span>
            <span class="">
                <i class="bi bi-chevron-right"></i>
            </span>
        </button>
    `
})
export class MembersAbsenceFormContainerComponent extends Reactive implements OnInit {

    @Input()
    public entireBusiness!: FormControl<boolean>;

    @Input()
    public memberIds!: FormControl<string[]>;

    private readonly translateService = inject(TranslateService);
    private readonly pushBoxService = inject(PushBoxService);
    private readonly changeDetectorRef = inject(ChangeDetectorRef);

    public readonly visibleState = new BooleanStreamState(false);

    public ngOnInit(): void {
        this.updateIsNotFull();
        this.entireBusiness.valueChanges.pipe(
            this.takeUntil(),
        ).subscribe(() => {
            this.updateIsNotFull();
        });
    }

    public updateIsNotFull(): void {
        this.visibleState.toggle(!this.entireBusiness.value);
        this.changeDetectorRef.detectChanges();
    }

    public async openModalToSelectMember() {

        const {SelectMemberPushBoxComponent} = await import("@member/presentation/push-box/select-member.push-box.component");

        const title = this.translateService.instant('absence.form.membersIds.select.title');

        const pushBoxWrapperComponentRef = await this.pushBoxService.buildItAsync({
            title,
            component: SelectMemberPushBoxComponent,
            componentInputs: {
                selectedMemberList: this.memberIds.value.map((_id) => ({_id}))
            },
            button: {
                close: {
                    text: this.translateService.instant('keyword.capitalize.done'),
                    classList: ['text-blue-500', 'capitalize', 'hover:text-blue-600', 'transition-all']
                }
            }
        });


        const {renderedComponentRef} = pushBoxWrapperComponentRef.instance;

        if (!renderedComponentRef) {
            return;
        }

        try {
            const {instance} = renderedComponentRef;
            if (instance instanceof SelectMemberPushBoxComponent) {
                instance.selectedMembersListener.pipe(this.takeUntil()).subscribe(() => {
                    const {newSelectedMemberList} = instance;
                    const memberIds = newSelectedMemberList.map(({_id}) => _id);
                    this.memberIds.patchValue(memberIds);
                    this.changeDetectorRef.detectChanges();
                    // this.pushBoxService.destroy$.next(SelectMemberPushBoxComponent.name);
                });
            }
        } catch (error) {
            console.error(error);
        }

    }
}
