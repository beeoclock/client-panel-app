import {createPropertySelectors, Selector} from "@ngxs/store";
import {IMemberState, MemberState} from "@member/state/member/member.state";

export class MemberSelector {

	static readonly state = createPropertySelectors<IMemberState>(MemberState);

	@Selector([MemberSelector.state.tableState])
	static tableState(tableState: IMemberState['tableState']) {
		return tableState;
	}

	@Selector([MemberSelector.state.item])
	static item(item: IMemberState['item']) {
		return item;
	}

	@Selector([MemberSelector.state.lastTableHashSum])
	static lastTableHashSum(lastTableHashSum: IMemberState['lastTableHashSum']) {
		return lastTableHashSum;
	}

}
