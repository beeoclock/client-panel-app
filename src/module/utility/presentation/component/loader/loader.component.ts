import {Component, ViewEncapsulation, input} from '@angular/core';
import {SpinnerComponent} from "@utility/presentation/component/spinner/spinner.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'utility-loader',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
	imports: [
		SpinnerComponent,
		NgIf
	],
  template: `
    <button
			[disabled]="disabled()"
      type="button"
			[class.mr-2]="mr2()"
			[class.px-5]="px5()"
			[class.py-2.5]="py2_5()"
      class="
        text-sm
        font-medium
        text-beeColor-900
        rounded-lg
        hover:text-blue-700
        focus:z-10
        focus:ring-2
        focus:ring-blue-700
        focus:text-blue-700
        dark:text-beeDarkColor-400
        dark:hover:text-white
        inline-flex
        items-center
        disabled:pointer-events-none">
      <svg aria-hidden="true"
           role="status"
           [class.bg-white]="bg()"
           [class.hover:bg-beeColor-100]="bg()"
           [class.dark:bg-beeDarkColor-800]="bg()"
           [class.dark:hover:bg-beeDarkColor-700]="bg()"
           [class.border]="border()"
           [class.border-beeColor-200]="border()"
           [class.dark:border-beeDarkColor-600]="border()"
           class="inline w-4 h-4 mr-3 text-beeColor-200 animate-spin dark:text-beeDarkColor-600" viewBox="0 0 100 101"
           fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"/>
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="#1C64F2"/>
      </svg>
      <ng-template [ngIf]="showLabel()">{{ label() }}</ng-template>
    </button>
  `
})
export class LoaderComponent {
  public readonly bg = input(false);

  public readonly disabled = input(true);

  public readonly showLabel = input(true);

  public readonly label = input('Loading...');

  public readonly border = input(false);

  public readonly mr2 = input(true);

  public readonly px5 = input(true);

  public readonly py2_5 = input(true);
}
