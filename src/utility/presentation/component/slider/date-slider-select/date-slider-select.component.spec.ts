import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {DateSliderSelectComponent} from './date-slider-select.component';
import {LoggerTestingModule} from 'ngx-logger/testing';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {
	DateSliderSelectService
} from "@utility/presentation/component/slider/date-slider-select/date-slider-select.service";

// Create a mock TranslateService
class MockTranslateService {
	currentLang = 'en'; // Set the current language to a default value for testing

	// Add any additional methods or properties used by DateSliderSelectComponent
	// ...

	// Mock the translation method used in the component
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	translate(key: string): string {
		// Return a mock translation based on the key (if needed)
		return 'Translated Text';
	}
}

describe('SelectDateComponent', () => {
	let component: DateSliderSelectComponent;
	let fixture: ComponentFixture<DateSliderSelectComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ReactiveFormsModule, LoggerTestingModule, HttpClientTestingModule],
			declarations: [], // Remove the component from declarations
			providers: [
				// Provide the mock TranslateService
				{provide: TranslateService, useClass: MockTranslateService},
				DateSliderSelectService,
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(DateSliderSelectComponent);
		component = fixture.componentInstance;

		// Input control
		const controlValue = '2023-07-15T12:00:00';
		fixture.componentRef.setInput('control', new FormControl(controlValue));

	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	// it('should initialize with current date', () => {
	// 	const today = DateTime.now().startOf('day');
	// 	expect(component.today.toISODate()).toBe(today.toISODate());
	// });
	//
	// it('should detect the amount of day slots in container', () => {
	// 	const spyDetectAmountOfDaySlots = jest.spyOn(component, 'detectAmountOfDaySlots');
	//
	// 	// @ts-ignore
	// 	component['daySlotsContainer'] = {
	// 		nativeElement: {
	// 			clientWidth: 360,
	// 		},
	// 	} as any;
	//
	// 	// Manually set clientWidth of the daySlotsContainer for testing purpose
	// 	// Object.defineProperty(component.daySlotsContainer.nativeElement, 'clientWidth', {value: 360});
	//
	// 	component.ngAfterViewInit();
	//
	// 	expect(spyDetectAmountOfDaySlots).toHaveBeenCalled();
	// 	expect(component.amountOfDaySlotsInContainer).toBe(4); // Assume each day slot width is 60px + 6px gap
	// });
	//
	// it('should prepare day slots title', () => {
	// 	const sourceDatetime = DateTime.fromISO('2023-07-15');
	// 	component.amountOfDaySlotsInContainer = 7;
	// 	const expectedTitle = 'July';
	// 	expect(component.prepareDaySlotsTitle(sourceDatetime)).toBe(expectedTitle);
	// });
	//
	// it('should prepare day item list', () => {
	// 	const sourceDatetime = DateTime.fromISO('2023-07-15');
	// 	component.amountOfDaySlotsInContainer = 7;
	//
	// 	component.prepareDatetimeList(sourceDatetime);
	//
	// 	expect(component.dayItemList().length).toBe(0);
	// 	// expect(component.dayItemList[0].datetime.toISODate()).toBe('2023-07-15');
	// 	// expect(component.dayItemList[6].datetime.toISODate()).toBe('2023-07-21');
	// });
	//
	// // it('should navigate to the previous pack of dates', () => {
	// // 	const sourceDatetime = DateTime.fromISO('2023-07-15');
	// // 	component.amountOfDaySlotsInContainer = 7;
	// //
	// // 	// Use jest.spyOn instead of spyOn from Jasmine
	// // 	const prepareDatetimeListSpy = jest.spyOn(component, 'prepareDatetimeList');
	// //
	// // 	component.prevPackOfDates();
	// //
	// // 	expect(prepareDatetimeListSpy).toHaveBeenCalledWith(
	// // 		sourceDatetime.minus({day: component.amountOfDaySlotsInContainer})
	// // 	);
	// // });
	// //
	// //
	// // it('should navigate to the next pack of dates', () => {
	// // 	const sourceDatetime = DateTime.fromISO('2023-07-15');
	// // 	component.amountOfDaySlotsInContainer = 7;
	// //
	// // 	// Use jest.spyOn instead of spyOn from Jasmine
	// // 	const prepareDatetimeListSpy = jest.spyOn(component, 'prepareDatetimeList').mockImplementation((): any => {
	// //
	// // 	});
	// //
	// // 	// component.nextPackOfDates();
	// //
	// // 	expect(prepareDatetimeListSpy).toHaveBeenCalledWith(sourceDatetime.plus({day: component.amountOfDaySlotsInContainer}));
	// // });


	// it('should select a date item', () => {
	// 	const datetimeToSelect = DateTime.fromISO('2023-07-15');
	//
	// 	// Create a mock FormControl for localDateTimeControl
	// 	const mockLocalDateTimeControl = new FormControl(datetimeToSelect);
	//
	// 	// Assign the mock FormControl to localDateTimeControl
	// 	fixture.componentRef.setInput('localDateTimeControl', mockLocalDateTimeControl);
	// 	component.selectDateItem(datetimeToSelect);
	//
	// 	// Verify selectedDateTime and localDateTimeControl values
	// 	if (component.selectedDateTime) {
	// 		expect(component.selectedDateTime.toISODate()).toBe('2023-07-15');
	// 	}
	// 	const {value} = component.localDateTimeControl();
	// 	if (value) {
	// 		expect(value.toISODate()).toBe('2023-07-15');
	// 	}
	// });
	//
	//
	// it('should check if a date item is selected', () => {
	// 	component.selectedDateTime = DateTime.fromISO('2023-07-15');
	// 	const dateItem = DateTime.fromISO('2023-07-15');
	// 	expect(component.isSelected(dateItem)).toBe(true);
	//
	// 	const otherDateItem = DateTime.fromISO('2023-07-20');
	// 	expect(component.isSelected(otherDateItem)).toBe(false);
	// });
	//
	// it('should check if a time slot is selected', () => {
	//
	// 	const datetimeToCheck = DateTime.fromISO('2023-07-15T09:30:00');
	// 	expect(component.hasSelectedTimeSlot(datetimeToCheck)).toBe(true);
	//
	// 	const otherDatetime = DateTime.fromISO('2023-07-20T12:00:00');
	// 	expect(component.hasSelectedTimeSlot(otherDatetime)).toBe(false);
	// });
	//
	// it('should get class list for selected date item', () => {
	// 	expect(component.getClassList(true)).toEqual(['bg-blue-100', 'text-blue-600', 'ring-blue-200']);
	// });
	//
	// it('should get class list for unselected date item', () => {
	// 	expect(component.getClassList(false)).toEqual([
	// 		'text-beeColor-500',
	// 		'hover:bg-beeColor-100',
	// 		'hover:text-black',
	// 		'ring-beeColor-300',
	// 	]);
	// });
});
