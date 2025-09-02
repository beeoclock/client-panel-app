import {ChangeDetectionStrategy, Component, input, viewChild, ViewEncapsulation} from "@angular/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {IonLabel, IonSelect, IonSelectOption} from "@ionic/angular/standalone";
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";
import {MemberDataState} from "@tenant/member/member/infrastructure/state/data/member.data.state";
import {IMember} from "@tenant/member/member/domain";

@Component({
	selector: 'ion-select-member',
	standalone: true,
	template: `
		<ion-select
			[formControl]="control()"
			[multiple]="multiple()"
			[placeholder]="placeholderTranslateKey() | translate"
			class="!min-h-0 px-4 py-3 border border-beeColor-300 rounded-2xl h-full"
			fill="solid"
			interface="popover">
			@for (member of members; track member._id) {
				<ion-select-option [value]="member._id">
					<!--					<div-->
					<!--						slot="start"-->
					<!--						class="rounded-full bg-beeColor-400 min-h-7 min-w-7 max-h-7 max-w-7 h-7 w-7 flex justify-center items-center">-->
					<!--						@if (member.avatar?.url) {-->
					<!--							<img [src]="member?.avatar?.url"-->
					<!--								 class="min-h-7 min-w-7 max-h-7 max-w-7 h-7 w-7 rounded-full object-cover"-->
					<!--								 alt="">-->
					<!--						} @else {-->

					<!--							<div class="text-white text-xs font-bold">{{ member.firstName?.[0] ?? '' }}-->
					<!--							</div>-->
					<!--							<div class="text-white text-xs font-bold">{{ member.lastName?.[0] ?? '' }}-->
					<!--							</div>-->
					<!--						}-->
					<!--					</div>-->
					<ion-label>{{ member.firstName }}</ion-label>
				</ion-select-option>
			}
		</ion-select>
	`,
	encapsulation: ViewEncapsulation.None,
	imports: [
		NgSelectModule,
		ReactiveFormsModule,
		TranslateModule,
		IonSelect,
		IonSelectOption,
		IonLabel,
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class IonSelectMemberComponent {

	public readonly ionSelect = viewChild(IonSelect);

	public readonly placeholderTranslateKey = input('keyword.capitalize.allSpecialists');

	public readonly multiple = input(true);

	public readonly id = input('');

	public readonly control = input.required<FormControl>();

	@SelectSnapshot(MemberDataState.activeMembers)
	public readonly members!: IMember.EntityRaw[];

}
