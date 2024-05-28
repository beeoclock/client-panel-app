import {ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation} from "@angular/core";
import {RIMember} from "@member/domain";

@Component({
    selector: 'app-selected-member-additional-menu',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    template: `
        <div class="text-beeColor-400 flex justify-between text-sm">
            <div>
                Selected member
            </div>
<!--            <div>-->
<!--                #{{ member._id }}-->
<!--            </div>-->
        </div>
        <div class="text-beeColor-500">{{ member.firstName }}&nbsp;{{ member.lastName }}</div>
    `,
})
export class SelectedMemberAdditionalMenuComponent {

    @Input({required: true})
    public member!: RIMember;

    @HostBinding()
    public get class() {
        return 'bg-white border border-beeColor-300 flex flex-col p-2 rounded-lg';
    }

}
