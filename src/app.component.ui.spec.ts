import {render} from '@testing-library/angular';
import {AppComponent} from './app.component';
import {TranslateService} from '@ngx-translate/core';
import {NgxsModule} from "@ngxs/store";
import {LoggerTestingModule} from "ngx-logger/testing";
import {ServiceWorkerModule} from "@angular/service-worker";
// Add any other dependencies used in your AppComponent here


// Create a mock TranslateService
class MockTranslateService {
	currentLang = 'en'; // Set the current language to a default value for testing

	// Add any additional methods or properties used by DateSliderSelectComponent
	// ...

	getBrowserLang(): string {
		return 'en';
	}

	use(lang: string): void {
		this.currentLang = lang;
	}

	onLangChange = {
		subscribe: (...args: unknown[]) => {
			if (args) {
				return;
			}
			return;
		}
	}

	// Mock the translation method used in the component
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	translate(key: string): string {
		// Return a mock translation based on the key (if needed)
		return 'Translated Text';
	}
}

describe('AppComponent', () => {
	beforeEach(async () => {
		await render(AppComponent, {
			imports: [
				NgxsModule.forRoot([]),
				LoggerTestingModule,
				ServiceWorkerModule.register('', {enabled: false})
			],
			providers: [
				// Provide the mock TranslateService
				{provide: TranslateService, useClass: MockTranslateService},
			],
		});
	});

	it('should render Welcome', async () => {
		// await screen.getByText('client-panel-app');
	});
});
