import {ChangeDetectionStrategy, Component, inject, input, ViewEncapsulation} from "@angular/core";
import {MemberListService} from "@shared/presentation/component/chip/member/list/member.list.service";
import {IMember} from "@tenant/member/member/domain";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {
	MemberPresentationActions
} from "@tenant/member/member/infrastructure/state/presentation/member.presentation.actions";

@Component({
	selector: 'member-list-chip',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	template: `

		@let memberList = members();
		@if (memberList.length) {

			@let member = memberList[0];
			@let data = membersMap()?.get(member._id) ;

			@if (data) {
				<button (click)="openMemberDetails($event, data)"
						class="inline-flex flex-nowrap items-center bg-white border border-neutral-200 hover:bg-neutral-200 transition-all rounded-full p-1 pe-3 dark:bg-neutral-900 dark:border-neutral-700">
					<img class="me-1.5 inline-block size-8 rounded-full object-cover" [src]="data.avatar.url" alt="Avatar">
					<div class="whitespace-nowrap font-medium text-neutral-800 dark:text-white flex flex-col">
						<span>{{ data.firstName }}</span>
					</div>
				</button>
			}

			@if (showRestMembers()) {

				@let restMembersLength = memberList.length - 1 ;
				@if (restMembersLength) {
					<div class="bg-white rounded-full w-[42px] h-[42px] border flex items-center justify-center">
						+{{ restMembersLength }}
					</div>
				}

			}

		}

	`
})
export class MemberListChipComponent {

	public readonly showRestMembers = input<boolean>(false);
	public readonly members = input<IMember.EntityRaw[]>([]);

	private readonly memberListService = inject(MemberListService);

	public readonly membersMap = this.memberListService.membersMap;

	public openMemberDetails($event: MouseEvent, data: IMember.EntityRaw) {
		$event.stopPropagation();
		this.dispatchMemberDetails(data);
	}

	@Dispatch()
	public dispatchMemberDetails(data: IMember.EntityRaw) {
		return new MemberPresentationActions.OpenDetails(data);
	}

}
