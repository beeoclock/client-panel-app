import {Component, ViewEncapsulation} from "@angular/core";

@Component({
  selector: 'utility-notification-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `

    <a aria-expanded="false"
       aria-haspopup="true" class="nav-link notification-indicator notification-indicator-primary px-0"
       data-bs-toggle="dropdown" data-hide-on-body-scroll="data-hide-on-body-scroll"
       id="navbarDropdownNotification" role="button">
      <i class="bi bi-bell-fill h4"></i>
    </a>
    <div
      aria-labelledby="navbarDropdownNotification"
      class="dropdown-menu dropdown-caret dropdown-caret dropdown-menu-end dropdown-menu-card dropdown-menu-notification dropdown-caret-bg">
      <div class="card card-notification shadow-none">
        <div class="card-header">
          <div class="row justify-content-between align-items-center">
            <div class="col-auto">
              <h6 class="card-header-title mb-0">Notifications</h6>
            </div>
            <div class="col-auto ps-0 ps-sm-3"><a class="card-link fw-normal" href="#">Mark all as read</a>
            </div>
          </div>
        </div>
        <div class="list-group list-group-flush fw-normal fs--1">
          <div class="list-group-title border-bottom">NEW</div>
          <div class="list-group-item">
            <a class="notification notification-flush notification-unread" href="#!">
              <div class="notification-avatar">
                <div class="avatar avatar-2xl me-3">
                  <img alt="" class="rounded-circle" src="/assets/img/logo.png"/>

                </div>
              </div>
              <div class="notification-body">
                <p class="mb-1"><strong>Emma Watson</strong> replied to your comment : "Hello world 😍"</p>
                <span class="notification-time"><span aria-label="Emoji" class="me-2"
                                                      role="img">💬</span>Just now</span>

              </div>
            </a>

            </div>
            <div class="list-group-item">
              <a class="notification notification-flush notification-unread" href="#!">
                <div class="notification-avatar">
                  <div class="avatar avatar-2xl me-3">
                    <div class="avatar-name rounded-circle"><span>AB</span></div>
                  </div>
                </div>
                <div class="notification-body">
                  <p class="mb-1"><strong>Albert Brooks</strong> reacted to <strong>Mia Khalifa's</strong>
                    status</p>
                  <span class="notification-time"><span
                    class="me-2 fab fa-gratipay text-danger"></span>9hr</span>

                </div>
              </a>

            </div>
            <div class="list-group-title border-bottom">EARLIER</div>
            <div class="list-group-item">
              <a class="notification notification-flush" href="#!">
                <div class="notification-avatar">
                  <div class="avatar avatar-2xl me-3">
                    <img alt="" class="rounded-circle" src="assets/img/icons/weather-sm.jpg"/>

                  </div>
                </div>
                <div class="notification-body">
                  <p class="mb-1">The forecast today shows a low of 20&#8451; in California. See today's
                    weather.</p>
                  <span class="notification-time"><span aria-label="Emoji" class="me-2"
                                                        role="img">🌤️</span>1d</span>

                </div>
              </a>

            </div>
          <div class="list-group-item">
            <a class="border-bottom-0 notification notification-flush" href="#!">
              <div class="notification-avatar">
                <div class="avatar avatar-xl me-3">
                  <img alt="" class="rounded-circle" src="/assets/img/logo.png"/>

                </div>
              </div>
              <div class="notification-body">
                <p class="mb-1"><strong>James Cameron</strong> invited to join the group: United Nations
                  International Children's Fund</p>
                <span class="notification-time"><span aria-label="Emoji" class="me-2"
                                                      role="img">🙋‍</span>2d</span>

              </div>
              </a>

            </div>
          </div>
        <div class="card-footer text-center border-top"><a class="card-link d-block"
                                                           href="../app/social/notifications.html">View
          all</a></div>
      </div>
    </div>
  `
})
export class NotificationComponent {

}
