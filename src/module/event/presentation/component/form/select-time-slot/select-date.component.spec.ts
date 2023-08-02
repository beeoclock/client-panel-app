import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {DateTime} from 'luxon';
import {generateDayItemList, SelectDateComponent} from './select-date.component';

// Create a mock TranslateService
class MockTranslateService {
  currentLang = 'en'; // Set the current language to a default value for testing

  // Add any additional methods or properties used by SelectDateComponent
  // ...

  // Mock the translate method used in the component
  translate(key: string): string {
    // Return a mock translation based on the key (if needed)
    return 'Translated Text';
  }
}

describe('SelectDateComponent', () => {
  let component: SelectDateComponent;
  let fixture: ComponentFixture<SelectDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [], // Remove the component from declarations
      providers: [
        // Provide the mock TranslateService
        { provide: TranslateService, useClass: MockTranslateService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectDateComponent);
    component = fixture.componentInstance;

    // Input control
    const controlValue = '2023-07-15T12:00:00';
    component.control = new FormControl(controlValue) as FormControl;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with current date', () => {
    const today = DateTime.now().startOf('day');
    expect(component.today.toISODate()).toBe(today.toISODate());
  });

  it('should detect the amount of day slots in container', () => {
    const spyDetectAmountOfDaySlots = jest.spyOn(component, 'detectAmountOfDaySlots');

    // Manually set clientWidth of the daySlotsContainer for testing purpose
    Object.defineProperty(component.daySlotsContainer.nativeElement, 'clientWidth', { value: 360 });

    component.ngAfterViewInit();

    expect(spyDetectAmountOfDaySlots).toHaveBeenCalled();
    expect(component.amountOfDaySlotsInContainer).toBe(5); // Assume each day slot width is 60px + 6px gap
  });

  it('should prepare day slots title', () => {
    const sourceDatetime = DateTime.fromISO('2023-07-15');
    component.amountOfDaySlotsInContainer = 7;
    const expectedTitle = 'July';
    expect(component.prepareDaySlotsTitle(sourceDatetime)).toBe(expectedTitle);
  });

  it('should prepare day item list', () => {
    const sourceDatetime = DateTime.fromISO('2023-07-15');
    component.amountOfDaySlotsInContainer = 7;

    component.prepareDatetimeList(sourceDatetime);

    expect(component.dayItemList.length).toBe(7);
    expect(component.dayItemList[0].datetime.toISODate()).toBe('2023-07-15');
    expect(component.dayItemList[6].datetime.toISODate()).toBe('2023-07-21');
  });

  it('should navigate to the previous pack of dates', () => {
    const sourceDatetime = DateTime.fromISO('2023-07-15');
    component.amountOfDaySlotsInContainer = 7;

    // Manually populate dayItemList with dummy data
    component.dayItemList = generateDayItemList(sourceDatetime, component.amountOfDaySlotsInContainer);

    // Use jest.spyOn instead of spyOn from Jasmine
    const prepareDatetimeListSpy = jest.spyOn(component, 'prepareDatetimeList');

    component.prevPackOfDates();

    expect(prepareDatetimeListSpy).toHaveBeenCalledWith(
      sourceDatetime.minus({ day: component.amountOfDaySlotsInContainer })
    );
  });


  it('should navigate to the next pack of dates', () => {
    const sourceDatetime = DateTime.fromISO('2023-07-15');
    component.amountOfDaySlotsInContainer = 7;

    // Manually populate dayItemList with dummy data starting from '2023-07-15'
    component.dayItemList = generateDayItemList(sourceDatetime, component.amountOfDaySlotsInContainer);

    // Use jest.spyOn instead of spyOn from Jasmine
    const prepareDatetimeListSpy = jest.spyOn(component, 'prepareDatetimeList').mockImplementation(() => {
      // Update dayItemList with the new data for the next pack of dates
      const nextSourceDatetime = sourceDatetime.plus({ day: component.amountOfDaySlotsInContainer });
      component.dayItemList = generateDayItemList(nextSourceDatetime, component.amountOfDaySlotsInContainer);
    });

    component.nextPackOfDates();

    expect(prepareDatetimeListSpy).toHaveBeenCalledWith(sourceDatetime.plus({ day: component.amountOfDaySlotsInContainer }));
  });



  it('should select a date item', () => {
    const datetimeToSelect = DateTime.fromISO('2023-07-15');

    // Create a mock FormControl for localDateTimeControl
    const mockLocalDateTimeControl = new FormControl(datetimeToSelect);

    // Assign the mock FormControl to localDateTimeControl
    component.localDateTimeControl = mockLocalDateTimeControl as FormControl;

    component.selectDateItem(datetimeToSelect);

    // Verify selectedDateTime and localDateTimeControl values
    expect(component.selectedDateTime.toISODate()).toBe('2023-07-15');
    expect(component.localDateTimeControl.value.toISODate()).toBe('2023-07-15');
  });


  it('should check if a date item is selected', () => {
    component.selectedDateTime = DateTime.fromISO('2023-07-15');
    const dateItem = DateTime.fromISO('2023-07-15');
    expect(component.isSelected(dateItem)).toBe(true);

    const otherDateItem = DateTime.fromISO('2023-07-20');
    expect(component.isSelected(otherDateItem)).toBe(false);
  });

  it('should check if a time slot is selected', () => {

    const datetimeToCheck = DateTime.fromISO('2023-07-15T09:30:00');
    expect(component.hasSelectedTimeSlot(datetimeToCheck)).toBe(true);

    const otherDatetime = DateTime.fromISO('2023-07-20T12:00:00');
    expect(component.hasSelectedTimeSlot(otherDatetime)).toBe(false);
  });

  it('should get class list for selected date item', () => {
    expect(component.getClassList(true)).toEqual(['bg-blue-100', 'text-blue-600', 'ring-blue-200']);
  });

  it('should get class list for unselected date item', () => {
    expect(component.getClassList(false)).toEqual([
      'text-gray-500',
      'hover:bg-gray-100',
      'hover:text-black',
      'ring-gray-300',
    ]);
  });
});