import {ChangeDetectionStrategy, Component, input, ViewEncapsulation} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {InvalidTooltipDirective} from "@utility/presentation/directives/invalid-tooltip/invalid-tooltip.directive";
import {HasErrorDirective} from "@utility/presentation/directives/has-error/has-error.directive";
import {DefaultLabelDirective} from "@utility/presentation/directives/label/default.label.directive";
import {IonicModule, IonModal} from "@ionic/angular";

@Component({
	selector: 'bee-form-badge-input',
	standalone: true,
	template: `
		<label default [for]="id()">{{ label() }}</label>
		<div class="flex">
<!--
				[dropSpecialCharacters]="false"
				[mask]="mask"-->
			<input
				[id]="id()"
				[formControl]="control()"
				[placeholder]="placeholder()"
				type="time"
				hasError
				invalidTooltip
				class="
          rounded-none
          rounded-l
          border
          text-beeColor-900
          focus:ring-blue-500
          focus:border-blue-500
          block
          flex-1
          min-w-0
          w-full
          text-sm
          border-beeColor-300
          py-2
          px-3
          dark:bg-beeDarkColor-700
          dark:border-beeDarkColor-600
          dark:placeholder-beeDarkColor-400
          dark:text-white
          dark:focus:ring-blue-500
          dark:focus:border-blue-500">
<!--			<ion-datetime-button hidden id="timeSelector" datetime="datetime"></ion-datetime-button>-->
<!--			<ion-modal #modal [initialBreakpoint]="0.25" trigger="openTimeSelector" [keepContentsMounted]="true">-->
<!--				<ng-template>-->
<!--					<ion-datetime presentation="time" id="datetime"></ion-datetime>-->
<!--				</ng-template>-->
<!--			</ion-modal>-->
<!--			<ion-button id="open-modal" expand="block">Open Sheet Modal</ion-button>-->

			<ion-modal #modal trigger="open-modal" [initialBreakpoint]="0.25" [breakpoints]="[0.25]">
				<ng-template>
					<ion-datetime class="self-center w-full" presentation="time" id="datetime"/>
				</ng-template>
			</ion-modal>
			<!--
							(click)="open(modal)"-->
			<button
				id="open-modal"
				class="
					transition-all
          inline-flex
          items-center
          text-sm
          px-3
          text-beeColor-500
          bg-beeColor-100 hover:bg-blue-500
          border
          border-l-0
          border-beeColor-300 hover:border-blue-600
          rounded-r
          dark:bg-beeDarkColor-600
          dark:text-beeDarkColor-400 hover:text-white
          dark:border-beeDarkColor-600">
            {{ badge() }}
        </button>
		</div>
	`,
	encapsulation: ViewEncapsulation.None,
	imports: [
		ReactiveFormsModule,
		InvalidTooltipDirective,
		HasErrorDirective,
		DefaultLabelDirective,
		IonicModule
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputBadgeComponent {

	public readonly placeholder = input('');

	public readonly label = input('');

	public readonly mask = input('');

	public readonly id = input('');

	public readonly badge = input('');

	public readonly control = input(new FormControl());

	public open(modal: IonModal) {
		modal.present();
	}

}
