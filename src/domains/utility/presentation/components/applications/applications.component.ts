import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  standalone: true,
  selector: 'utility-applications-component',
  encapsulation: ViewEncapsulation.None,
  template: `

    <a aria-expanded="false" aria-haspopup="true" class="nav-link nine-dots p-1"
       data-bs-toggle="dropdown" data-hide-on-body-scroll="data-hide-on-body-scroll" id="navbarDropdownMenu"
       role="button">
      <svg fill="none" height="43" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
        <circle cx="2" cy="2" fill="#6C6E71" r="2"></circle>
        <circle cx="2" cy="8" fill="#6C6E71" r="2"></circle>
        <circle cx="2" cy="14" fill="#6C6E71" r="2"></circle>
        <circle cx="8" cy="8" fill="#6C6E71" r="2"></circle>
        <circle cx="8" cy="14" fill="#6C6E71" r="2"></circle>
        <circle cx="14" cy="8" fill="#6C6E71" r="2"></circle>
        <circle cx="14" cy="14" fill="#6C6E71" r="2"></circle>
        <circle cx="8" cy="2" fill="#6C6E71" r="2"></circle>
        <circle cx="14" cy="2" fill="#6C6E71" r="2"></circle>
      </svg>
    </a>
    <div
      aria-labelledby="navbarDropdownMenu"
      class="dropdown-menu dropdown-caret dropdown-caret dropdown-menu-end dropdown-menu-card dropdown-caret-bg">
      <div class="card shadow-none">
        <!--        scrollbar-overlay-->
        <div class="nine-dots-dropdown overflow-auto">
          <div class="card-body px-3">
            <div class="row text-center gx-0 gy-0">
              <div class="col-4"><a
                class="d-block hover-bg-200 px-2 py-3 rounded-3 text-center text-decoration-none"
                href="../pages/user/profile.html" target="_blank">
                <div class="avatar avatar-2xl"><img alt="" class="rounded-circle"
                                                    src="assets/img/team/3.jpg"/></div>
                <p class="mb-0 fw-medium text-800 text-truncate fs--2">Account</p>
              </a></div>
              <div class="col-4"><a
                class="d-block hover-bg-200 px-2 py-3 rounded-3 text-center text-decoration-none"
                href="https://themewagon.com/" target="_blank"><img alt=""
                                                                    class="rounded"
                                                                    height="40"
                                                                    src="assets/img/nav-icons/themewagon.png"
                                                                    width="40"/>
                <p class="mb-0 fw-medium text-800 text-truncate fs--2 pt-1">Themewagon</p>
              </a></div>
              <div class="col-4"><a
                class="d-block hover-bg-200 px-2 py-3 rounded-3 text-center text-decoration-none"
                href="https://mailbluster.com/" target="_blank"><img alt=""
                                                                     class="rounded"
                                                                     height="40"
                                                                     src="assets/img/nav-icons/mailbluster.png"
                                                                     width="40"/>
                <p class="mb-0 fw-medium text-800 text-truncate fs--2 pt-1">Mailbluster</p>
              </a></div>
              <div class="col-4"><a
                class="d-block hover-bg-200 px-2 py-3 rounded-3 text-center text-decoration-none" href="#!"
                target="_blank"><img alt="" class="rounded" height="40"
                                     src="assets/img/nav-icons/google.png" width="40"/>
                <p class="mb-0 fw-medium text-800 text-truncate fs--2 pt-1">Google</p>
              </a></div>
              <div class="col-4"><a
                class="d-block hover-bg-200 px-2 py-3 rounded-3 text-center text-decoration-none" href="#!"
                target="_blank"><img alt="" class="rounded" height="40"
                                     src="assets/img/nav-icons/spotify.png" width="40"/>
                <p class="mb-0 fw-medium text-800 text-truncate fs--2 pt-1">Spotify</p>
              </a></div>
              <div class="col-4"><a
                class="d-block hover-bg-200 px-2 py-3 rounded-3 text-center text-decoration-none" href="#!"
                target="_blank"><img alt="" class="rounded" height="40"
                                     src="assets/img/nav-icons/steam.png" width="40"/>
                <p class="mb-0 fw-medium text-800 text-truncate fs--2 pt-1">Steam</p>
              </a></div>
              <div class="col-4"><a
                class="d-block hover-bg-200 px-2 py-3 rounded-3 text-center text-decoration-none" href="#!"
                target="_blank"><img alt="" class="rounded" height="40"
                                     src="assets/img/nav-icons/github-light.png" width="40"/>
                <p class="mb-0 fw-medium text-800 text-truncate fs--2 pt-1">Github</p>
              </a></div>
              <div class="col-4"><a
                class="d-block hover-bg-200 px-2 py-3 rounded-3 text-center text-decoration-none" href="#!"
                target="_blank"><img alt="" class="rounded" height="40"
                                     src="assets/img/nav-icons/discord.png" width="40"/>
                <p class="mb-0 fw-medium text-800 text-truncate fs--2 pt-1">Discord</p>
              </a></div>
              <div class="col-4"><a
                class="d-block hover-bg-200 px-2 py-3 rounded-3 text-center text-decoration-none" href="#!"
                target="_blank"><img alt="" class="rounded" height="40"
                                     src="assets/img/nav-icons/xbox.png" width="40"/>
                <p class="mb-0 fw-medium text-800 text-truncate fs--2 pt-1">xbox</p>
              </a></div>
              <div class="col-4"><a
                class="d-block hover-bg-200 px-2 py-3 rounded-3 text-center text-decoration-none" href="#!"
                target="_blank"><img alt="" class="rounded" height="40"
                                     src="assets/img/nav-icons/trello.png" width="40"/>
                <p class="mb-0 fw-medium text-800 text-truncate fs--2 pt-1">Kanban</p>
              </a></div>
              <div class="col-4"><a
                class="d-block hover-bg-200 px-2 py-3 rounded-3 text-center text-decoration-none" href="#!"
                target="_blank"><img alt="" class="rounded" height="40" src="assets/img/nav-icons/hp.png"
                                     width="40"/>
                <p class="mb-0 fw-medium text-800 text-truncate fs--2 pt-1">Hp</p>
              </a></div>
              <div class="col-12">
                <hr class="my-3 mx-n3 bg-200"/>
              </div>
              <div class="col-4"><a
                class="d-block hover-bg-200 px-2 py-3 rounded-3 text-center text-decoration-none" href="#!"
                target="_blank"><img alt="" class="rounded" height="40"
                                     src="assets/img/nav-icons/linkedin.png" width="40"/>
                <p class="mb-0 fw-medium text-800 text-truncate fs--2 pt-1">Linkedin</p>
              </a></div>
              <div class="col-4"><a
                class="d-block hover-bg-200 px-2 py-3 rounded-3 text-center text-decoration-none" href="#!"
                target="_blank"><img alt="" class="rounded" height="40"
                                     src="assets/img/nav-icons/twitter.png" width="40"/>
                <p class="mb-0 fw-medium text-800 text-truncate fs--2 pt-1">Twitter</p>
              </a></div>
              <div class="col-4"><a
                class="d-block hover-bg-200 px-2 py-3 rounded-3 text-center text-decoration-none" href="#!"
                target="_blank"><img alt="" class="rounded" height="40"
                                     src="assets/img/nav-icons/facebook.png" width="40"/>
                <p class="mb-0 fw-medium text-800 text-truncate fs--2 pt-1">Facebook</p>
              </a></div>
              <div class="col-4"><a
                class="d-block hover-bg-200 px-2 py-3 rounded-3 text-center text-decoration-none" href="#!"
                target="_blank"><img alt="" class="rounded" height="40"
                                     src="assets/img/nav-icons/instagram.png" width="40"/>
                <p class="mb-0 fw-medium text-800 text-truncate fs--2 pt-1">Instagram</p>
              </a></div>
              <div class="col-4"><a
                class="d-block hover-bg-200 px-2 py-3 rounded-3 text-center text-decoration-none" href="#!"
                target="_blank"><img alt="" class="rounded" height="40"
                                     src="assets/img/nav-icons/pinterest.png" width="40"/>
                <p class="mb-0 fw-medium text-800 text-truncate fs--2 pt-1">Pinterest</p>
              </a></div>
              <div class="col-4"><a
                class="d-block hover-bg-200 px-2 py-3 rounded-3 text-center text-decoration-none" href="#!"
                target="_blank"><img alt="" class="rounded" height="40"
                                     src="assets/img/nav-icons/slack.png" width="40"/>
                <p class="mb-0 fw-medium text-800 text-truncate fs--2 pt-1">Slack</p>
              </a></div>
              <div class="col-4"><a
                class="d-block hover-bg-200 px-2 py-3 rounded-3 text-center text-decoration-none" href="#!"
                target="_blank"><img alt="" class="rounded" height="40"
                                     src="assets/img/nav-icons/deviantart.png" width="40"/>
                <p class="mb-0 fw-medium text-800 text-truncate fs--2 pt-1">Deviantart</p>
              </a></div>
              <div class="col-4"><a
                class="d-block hover-bg-200 px-2 py-3 rounded-3 text-center text-decoration-none"
                href="../app/events/event-detail.html" target="_blank">
                <div class="avatar avatar-2xl">
                  <div class="avatar-name rounded-circle bg-primary-subtle text-primary"><span
                    class="fs-2">E</span>
                  </div>
                </div>
                <p class="mb-0 fw-medium text-800 text-truncate fs--2">Events</p>
              </a></div>
              <div class="col-12"><a class="btn btn-outline-primary btn-sm mt-4" href="#!">Show more</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ApplicationsComponent {

}
