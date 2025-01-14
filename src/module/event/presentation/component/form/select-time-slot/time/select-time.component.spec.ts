// import {ComponentFixture, TestBed} from '@angular/core/testing';
// import {FormControl, ReactiveFormsModule} from '@angular/forms';
// import {DateTime} from 'luxon';
// import {ITimeSlot, SelectTimeComponent} from './select-time.component';
// import {TranslateService} from "@ngx-translate/core";
// import {SlotsService} from "@event/presentation/component/form/select-time-slot/slots.service";
//
// // Create a mock TranslateService
// class MockTranslateService {
//   currentLang = 'en'; // Set the current language to a default value for testing
//
//   // Add any additional methods or properties used by DateSliderSelectComponent
//   // ...
//
//   // Mock the translate method used in the component
//   translate(key: string): string {
//     // Return a mock translation based on the key (if needed)
//     return 'Translated Text';
//   }
// }
//
// describe('SelectTimeComponent', () => {
//   let component: SelectTimeComponent;
//   let fixture: ComponentFixture<SelectTimeComponent>;
//
//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [ReactiveFormsModule],
//       declarations: [], // Remove the component from declarations
//       providers: [
// 				SlotsService,
//         // Provide the mock TranslateService
//         {provide: TranslateService, useClass: MockTranslateService},
//       ],
//     }).compileComponents();
//   });
//
//
//   beforeEach(() => {
//     fixture = TestBed.createComponent(SelectTimeComponent);
//     component = fixture.componentInstance;
//
//     component.control = new FormControl('2023-07-15T12:00:00') as FormControl;
//     component.localDateTimeControl = new FormControl(DateTime.now()) as FormControl;
//
//     fixture.detectChanges();
//   });
//
//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
//
//   it('should initialize with the correct selectedDateTime', () => {
//     const expectedSelectedDateTime = DateTime.now().set({
//       hour: 7,
//       minute: 0,
//       second: 0,
//       millisecond: 0,
//     });
//     expect(component.selectedDateTime.toISO()).toBe(expectedSelectedDateTime.toISO());
//   });
//
//   it('should prepare time slots with correct amount', () => {
//     const expectedTimeSlotCount = 6;
//     expect(component.timeSlotLists.length).toBe(expectedTimeSlotCount);
//   });
//
//   // it('should generate time slots correctly', () => {
//   //   const sourceDatetime = DateTime.fromISO('2023-07-15T00:00:00');
//   //   const timeSlot = component.generateTimeSlot(sourceDatetime, 2);
//   //   const expectedDatetime = sourceDatetime.plus({minutes: 20});
//   //   const expectedTimeSlot: ITimeSlot = {
//   //     isPast: expectedDatetime.startOf('minute').toMillis() < DateTime.now().startOf('minute').toMillis(),
//   //     datetime: expectedDatetime,
//   //   };
//   //   expect(timeSlot).toEqual(expectedTimeSlot);
//   // });
//
//   it('should select a date item', () => {
//     const datetimeToSelect = DateTime.fromISO('2023-07-15T12:34:56');
//     component.selectDateItem(datetimeToSelect);
//     expect(component.selectedDateTime.toISO()).toBe(datetimeToSelect.toISO());
//     expect(component.control.value).toBe(datetimeToSelect.toUTC().toISO());
//   });
//
//   it('should check if a time slot is selected', () => {
//     const selectedDateTime = DateTime.fromISO('2023-07-15T12:30:00');
//     component.selectedDateTime = selectedDateTime;
//     const datetimeToCheck = DateTime.fromISO('2023-07-15T12:30:00');
//     expect(component.isSelected(datetimeToCheck)).toBe(true);
//
//     const otherDatetime = DateTime.fromISO('2023-07-15T12:00:00');
//     expect(component.isSelected(otherDatetime)).toBe(false);
//   });
//
//   it('should navigate to the previous pack of dates', () => {
//     const sourceDatetime = DateTime.fromISO('2023-07-15T12:00:00');
// 		component.timeSlotLists.length = 0;
//     component.timeSlotLists.push([
// 			{isPast: false, datetime: sourceDatetime},
// 			{isPast: false, datetime: sourceDatetime.plus({minutes: 10})},
// 			{isPast: false, datetime: sourceDatetime.plus({minutes: 20})},
// 			// ... add more time slots ...
// 		]);
//     component.prevSlotPack();
//
//     const firstTimeSlotAfterNavigation = component.timeSlotLists[0][0];
//     const expectedDatetime = sourceDatetime.minus({hours: 1});
//
//     expect(firstTimeSlotAfterNavigation.datetime.toISO()).toBe(expectedDatetime.toISO());
//   });
//
//   it('should navigate to the next pack of dates', () => {
//     const sourceDatetime = DateTime.fromISO('2023-07-15T12:00:00');
// 		component.timeSlotLists.length = 0;
//     component.timeSlotLists.push([{isPast: false, datetime: sourceDatetime}]);
//     component.nextSlotPack();
//
// 		const lastPackOfSlots = component.timeSlotLists.at(-1);
//     const lastTimeSlotAfterNavigation = lastPackOfSlots?.at(-1);
//     const expectedDatetime = sourceDatetime.plus({minutes: 50});
//
//     expect(lastTimeSlotAfterNavigation?.datetime.toISO()).toBe(expectedDatetime.toISO());
//   });
// });

describe('SelectTimeComponent', () => {

	it('should be TODO value', () => {

		expect('TODO').toBe('TODO');

	});

})
