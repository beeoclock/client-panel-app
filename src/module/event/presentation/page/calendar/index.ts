import {ChangeDetectorRef, Component, inject, ViewChild, ViewEncapsulation} from '@angular/core';
import {FullCalendarComponent, FullCalendarModule} from '@fullcalendar/angular';
import {CalendarOptions, DateSelectArg, EventApi, EventClickArg} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import {CardComponent} from '@utility/presentation/component/card/card.component';
import {BodyCardComponent} from '@utility/presentation/component/card/body.card.component';
import {HeaderCardComponent} from '@utility/presentation/component/card/header.card.component';
import {EventRepository} from "@event/repository/event.repository";
import {IEvent} from "@event/domain";

@Component({
  selector: 'event-calendar-page',
  templateUrl: 'index.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    FullCalendarModule,
    AsyncPipe,
    NgForOf,
    NgIf,
    CardComponent,
    BodyCardComponent,
    HeaderCardComponent
  ]
})
export default class Index {

  public readonly repository = inject(EventRepository);
  private readonly changeDetector = inject(ChangeDetectorRef);

  public events: IEvent[] = [];

  calendarOptions: CalendarOptions = {
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    // initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    datesSet: (event) => {
      const {startStr, endStr} = event;
      this.repository.calendar(startStr, endStr).then((result: any) => {
        this.events = result.data.items;
        this.calendarOptions.events = this.events;
      });
    },
    // events: (a) => {
    //   console.log(a);
    // }
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  };
  currentEvents: EventApi[] = [];

  @ViewChild(FullCalendarComponent)
  public fullCalendarComponent: FullCalendarComponent | undefined;

  constructor() {
    setTimeout(function () {
      window.dispatchEvent(new Event('resize'))
    }, 1)
  }

  handleWeekendsToggle() {
    const {calendarOptions} = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      // calendarApi.addEvent({
      //   id: createEventId(),
      //   title,
      //   start: selectInfo.startStr,
      //   end: selectInfo.endStr,
      //   allDay: selectInfo.allDay
      // });
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    // this.modalService.create([{
    //   component: EventShortDetailsComponent,
    //   data: {
    //     event: this.events.find(({_id}) => _id === clickInfo.event.extendedProps['_id']),
    //   }
    // }], {
    //   buttons: [],
    //   fixHeight: false,
    //   title: 'Event'
    // }).then((modal) => {
    //   return modal;
    // });

    // clickInfo.event.remove();

  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }

}
