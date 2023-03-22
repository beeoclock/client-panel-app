import {AfterViewInit, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `
    <router-outlet></router-outlet>
    <!-- ===============================================-->
    <!--    Main Content-->
    <!-- ===============================================-->
    <main class="main" id="top">
      <div class="container" data-layout="container">
        <script>
          var isFluid = JSON.parse(localStorage.getItem('isFluid'));
          if (isFluid) {
            var container = document.querySelector('[data-layout]');
            container.classList.remove('container');
            container.classList.add('container-fluid');
          }
        </script>
        <nav class="navbar navbar-light navbar-vertical navbar-expand-xl">

          <div class="d-flex align-items-center">
            <div class="toggle-icon-wrapper">

              <button class="btn navbar-toggler-humburger-icon navbar-vertical-toggle" data-bs-toggle="tooltip"
                      data-bs-placement="left" title="Toggle Navigation"><span class="navbar-toggle-icon"><span
                class="toggle-line"></span></span></button>

            </div>
            <a class="navbar-brand" href="../index.html">
              <div class="d-flex align-items-center py-3"><img class="me-2"
                                                               src="../assets/img/icons/spot-illustrations/falcon.png"
                                                               alt="" width="40"/><span
                class="font-sans-serif">falcon</span>
              </div>
            </a>
          </div>
          <div class="collapse navbar-collapse" id="navbarVerticalCollapse">
            <div class="navbar-vertical-content scrollbar">
              <ul class="navbar-nav flex-column mb-3" id="navbarVerticalNav">
                <li class="nav-item">
                  <!-- parent pages--><a class="nav-link dropdown-indicator" href="#dashboard" role="button"
                                         data-bs-toggle="collapse" aria-expanded="true" aria-controls="dashboard">
                  <div class="d-flex align-items-center"><span class="nav-link-icon"><span
                    class="fas fa-chart-pie"></span></span><span class="nav-link-text ps-1">Dashboard</span>
                  </div>
                </a>
                  <ul class="nav collapse show" id="dashboard">
                    <li class="nav-item"><a class="nav-link" href="../index.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Default</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../dashboard/analytics.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Analytics</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../dashboard/crm.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">CRM</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../dashboard/e-commerce.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">E commerce</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../dashboard/lms.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">LMS</span><span
                        class="badge rounded-pill ms-2 badge-subtle-success">New</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../dashboard/project-management.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Management</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link active" href="../dashboard/saas.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">SaaS</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../dashboard/support-desk.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Support desk</span><span
                        class="badge rounded-pill ms-2 badge-subtle-success">New</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                  </ul>
                </li>
                <li class="nav-item">
                  <!-- label-->
                  <div class="row navbar-vertical-label-wrapper mt-3 mb-2">
                    <div class="col-auto navbar-vertical-label">App
                    </div>
                    <div class="col ps-0">
                      <hr class="mb-0 navbar-vertical-divider"/>
                    </div>
                  </div>
                  <!-- parent pages--><a class="nav-link" href="../app/calendar.html" role="button">
                  <div class="d-flex align-items-center"><span class="nav-link-icon"><span
                    class="fas fa-calendar-alt"></span></span><span class="nav-link-text ps-1">Calendar</span>
                  </div>
                </a>
                  <!-- parent pages--><a class="nav-link" href="../app/chat.html" role="button">
                  <div class="d-flex align-items-center"><span class="nav-link-icon"><span
                    class="fas fa-comments"></span></span><span class="nav-link-text ps-1">Chat</span>
                  </div>
                </a>
                  <!-- parent pages--><a class="nav-link dropdown-indicator" href="#email" role="button"
                                         data-bs-toggle="collapse" aria-expanded="false" aria-controls="email">
                  <div class="d-flex align-items-center"><span class="nav-link-icon"><span
                    class="fas fa-envelope-open"></span></span><span class="nav-link-text ps-1">Email</span>
                  </div>
                </a>
                  <ul class="nav collapse" id="email">
                    <li class="nav-item"><a class="nav-link" href="../app/email/inbox.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Inbox</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../app/email/email-detail.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Email detail</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../app/email/compose.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Compose</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                  </ul>
                  <!-- parent pages--><a class="nav-link dropdown-indicator" href="#events" role="button"
                                         data-bs-toggle="collapse" aria-expanded="false" aria-controls="events">
                  <div class="d-flex align-items-center"><span class="nav-link-icon"><span
                    class="fas fa-calendar-day"></span></span><span class="nav-link-text ps-1">Events</span>
                  </div>
                </a>
                  <ul class="nav collapse" id="events">
                    <li class="nav-item"><a class="nav-link" href="../app/events/create-an-event.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Create an event</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../app/events/event-detail.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Event detail</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../app/events/event-list.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Event list</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                  </ul>
                  <!-- parent pages--><a class="nav-link dropdown-indicator" href="#e-commerce" role="button"
                                         data-bs-toggle="collapse" aria-expanded="false" aria-controls="e-commerce">
                  <div class="d-flex align-items-center"><span class="nav-link-icon"><span
                    class="fas fa-shopping-cart"></span></span><span class="nav-link-text ps-1">E commerce</span>
                  </div>
                </a>
                  <ul class="nav collapse" id="e-commerce">
                    <li class="nav-item"><a class="nav-link dropdown-indicator" href="#product"
                                            data-bs-toggle="collapse" aria-expanded="false" aria-controls="e-commerce">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Product</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                      <ul class="nav collapse" id="product">
                        <li class="nav-item"><a class="nav-link" href="../app/e-commerce/product/product-list.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Product list</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link" href="../app/e-commerce/product/product-grid.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Product grid</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link" href="../app/e-commerce/product/product-details.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Product details</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                      </ul>
                    </li>
                    <li class="nav-item"><a class="nav-link dropdown-indicator" href="#orders" data-bs-toggle="collapse"
                                            aria-expanded="false" aria-controls="e-commerce">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Orders</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                      <ul class="nav collapse" id="orders">
                        <li class="nav-item"><a class="nav-link" href="../app/e-commerce/orders/order-list.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Order list</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link" href="../app/e-commerce/orders/order-details.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Order details</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                      </ul>
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../app/e-commerce/customers.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Customers</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../app/e-commerce/customer-details.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Customer details</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../app/e-commerce/shopping-cart.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Shopping cart</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../app/e-commerce/checkout.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Checkout</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../app/e-commerce/billing.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Billing</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../app/e-commerce/invoice.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Invoice</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                  </ul>
                  <!-- parent pages--><a class="nav-link dropdown-indicator" href="#e-learning" role="button"
                                         data-bs-toggle="collapse" aria-expanded="false" aria-controls="e-learning">
                  <div class="d-flex align-items-center"><span class="nav-link-icon"><span
                    class="fas fa-graduation-cap"></span></span><span class="nav-link-text ps-1">E learning</span><span
                    class="badge rounded-pill ms-2 badge-subtle-success">New</span>
                  </div>
                </a>
                  <ul class="nav collapse" id="e-learning">
                    <li class="nav-item"><a class="nav-link dropdown-indicator" href="#course" data-bs-toggle="collapse"
                                            aria-expanded="false" aria-controls="e-learning">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Course</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                      <ul class="nav collapse" id="course">
                        <li class="nav-item"><a class="nav-link" href="../app/e-learning/course/course-list.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Course list</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link" href="../app/e-learning/course/course-grid.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Course grid</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link" href="../app/e-learning/course/course-details.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Course details</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link" href="../app/e-learning/course/create-a-course.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Create a course</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                      </ul>
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../app/e-learning/student-overview.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Student overview</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../app/e-learning/trainer-profile.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Trainer profile</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                  </ul>
                  <!-- parent pages--><a class="nav-link" href="../app/kanban.html" role="button">
                  <div class="d-flex align-items-center"><span class="nav-link-icon"><span class="fab fa-trello"></span></span><span
                    class="nav-link-text ps-1">Kanban</span>
                  </div>
                </a>
                  <!-- parent pages--><a class="nav-link dropdown-indicator" href="#social" role="button"
                                         data-bs-toggle="collapse" aria-expanded="false" aria-controls="social">
                  <div class="d-flex align-items-center"><span class="nav-link-icon"><span
                    class="fas fa-share-alt"></span></span><span class="nav-link-text ps-1">Social</span>
                  </div>
                </a>
                  <ul class="nav collapse" id="social">
                    <li class="nav-item"><a class="nav-link" href="../app/social/feed.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Feed</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../app/social/activity-log.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Activity log</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../app/social/notifications.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Notifications</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../app/social/followers.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Followers</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                  </ul>
                  <!-- parent pages--><a class="nav-link dropdown-indicator" href="#support-desk" role="button"
                                         data-bs-toggle="collapse" aria-expanded="false" aria-controls="support-desk">
                  <div class="d-flex align-items-center"><span class="nav-link-icon"><span
                    class="fas fa-ticket-alt"></span></span><span class="nav-link-text ps-1">Support desk</span>
                  </div>
                </a>
                  <ul class="nav collapse" id="support-desk">
                    <li class="nav-item"><a class="nav-link" href="../app/support-desk/table-view.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Table view</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../app/support-desk/card-view.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Card view</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../app/support-desk/contacts.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Contacts</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../app/support-desk/contact-details.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Contact details</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../app/support-desk/tickets-preview.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Tickets preview</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../app/support-desk/quick-links.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Quick links</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../app/support-desk/reports.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Reports</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                  </ul>
                </li>
                <li class="nav-item">
                  <!-- label-->
                  <div class="row navbar-vertical-label-wrapper mt-3 mb-2">
                    <div class="col-auto navbar-vertical-label">Pages
                    </div>
                    <div class="col ps-0">
                      <hr class="mb-0 navbar-vertical-divider"/>
                    </div>
                  </div>
                  <!-- parent pages--><a class="nav-link" href="../pages/starter.html" role="button">
                  <div class="d-flex align-items-center"><span class="nav-link-icon"><span
                    class="fas fa-flag"></span></span><span class="nav-link-text ps-1">Starter</span>
                  </div>
                </a>
                  <!-- parent pages--><a class="nav-link" href="../pages/landing.html" role="button">
                  <div class="d-flex align-items-center"><span class="nav-link-icon"><span class="fas fa-globe"></span></span><span
                    class="nav-link-text ps-1">Landing</span>
                  </div>
                </a>
                  <!-- parent pages--><a class="nav-link dropdown-indicator" href="#authentication" role="button"
                                         data-bs-toggle="collapse" aria-expanded="false" aria-controls="authentication">
                  <div class="d-flex align-items-center"><span class="nav-link-icon"><span
                    class="fas fa-lock"></span></span><span class="nav-link-text ps-1">Authentication</span>
                  </div>
                </a>
                  <ul class="nav collapse" id="authentication">
                    <li class="nav-item"><a class="nav-link dropdown-indicator" href="#simple" data-bs-toggle="collapse"
                                            aria-expanded="false" aria-controls="authentication">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Simple</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                      <ul class="nav collapse" id="simple">
                        <li class="nav-item"><a class="nav-link" href="../pages/authentication/simple/login.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Login</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link" href="../pages/authentication/simple/logout.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Logout</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link" href="../pages/authentication/simple/register.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Register</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link"
                                                href="../pages/authentication/simple/forgot-password.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Forgot password</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link"
                                                href="../pages/authentication/simple/confirm-mail.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Confirm mail</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link"
                                                href="../pages/authentication/simple/reset-password.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Reset password</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link" href="../pages/authentication/simple/lock-screen.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Lock screen</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                      </ul>
                    </li>
                    <li class="nav-item"><a class="nav-link dropdown-indicator" href="#card" data-bs-toggle="collapse"
                                            aria-expanded="false" aria-controls="authentication">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Card</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                      <ul class="nav collapse" id="card">
                        <li class="nav-item"><a class="nav-link" href="../pages/authentication/card/login.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Login</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link" href="../pages/authentication/card/logout.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Logout</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link" href="../pages/authentication/card/register.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Register</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link"
                                                href="../pages/authentication/card/forgot-password.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Forgot password</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link" href="../pages/authentication/card/confirm-mail.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Confirm mail</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link"
                                                href="../pages/authentication/card/reset-password.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Reset password</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link" href="../pages/authentication/card/lock-screen.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Lock screen</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                      </ul>
                    </li>
                    <li class="nav-item"><a class="nav-link dropdown-indicator" href="#split" data-bs-toggle="collapse"
                                            aria-expanded="false" aria-controls="authentication">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Split</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                      <ul class="nav collapse" id="split">
                        <li class="nav-item"><a class="nav-link" href="../pages/authentication/split/login.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Login</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link" href="../pages/authentication/split/logout.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Logout</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link" href="../pages/authentication/split/register.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Register</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link"
                                                href="../pages/authentication/split/forgot-password.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Forgot password</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link" href="../pages/authentication/split/confirm-mail.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Confirm mail</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link"
                                                href="../pages/authentication/split/reset-password.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Reset password</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link" href="../pages/authentication/split/lock-screen.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Lock screen</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                      </ul>
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../pages/authentication/wizard.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Wizard</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../#authentication-modal" data-bs-toggle="modal">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Modal</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                  </ul>
                  <!-- parent pages--><a class="nav-link dropdown-indicator" href="#user" role="button"
                                         data-bs-toggle="collapse" aria-expanded="false" aria-controls="user">
                  <div class="d-flex align-items-center"><span class="nav-link-icon"><span
                    class="fas fa-user"></span></span><span class="nav-link-text ps-1">User</span>
                  </div>
                </a>
                  <ul class="nav collapse" id="user">
                    <li class="nav-item"><a class="nav-link" href="../pages/user/profile.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Profile</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../pages/user/settings.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Settings</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                  </ul>
                  <!-- parent pages--><a class="nav-link dropdown-indicator" href="#pricing" role="button"
                                         data-bs-toggle="collapse" aria-expanded="false" aria-controls="pricing">
                  <div class="d-flex align-items-center"><span class="nav-link-icon"><span
                    class="fas fa-tags"></span></span><span class="nav-link-text ps-1">Pricing</span>
                  </div>
                </a>
                  <ul class="nav collapse" id="pricing">
                    <li class="nav-item"><a class="nav-link" href="../pages/pricing/pricing-default.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Pricing default</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../pages/pricing/pricing-alt.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Pricing alt</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                  </ul>
                  <!-- parent pages--><a class="nav-link dropdown-indicator" href="#faq" role="button"
                                         data-bs-toggle="collapse" aria-expanded="false" aria-controls="faq">
                  <div class="d-flex align-items-center"><span class="nav-link-icon"><span
                    class="fas fa-question-circle"></span></span><span class="nav-link-text ps-1">Faq</span>
                  </div>
                </a>
                  <ul class="nav collapse" id="faq">
                    <li class="nav-item"><a class="nav-link" href="../pages/faq/faq-basic.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Faq basic</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../pages/faq/faq-alt.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Faq alt</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../pages/faq/faq-accordion.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Faq accordion</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                  </ul>
                  <!-- parent pages--><a class="nav-link dropdown-indicator" href="#errors" role="button"
                                         data-bs-toggle="collapse" aria-expanded="false" aria-controls="errors">
                  <div class="d-flex align-items-center"><span class="nav-link-icon"><span
                    class="fas fa-exclamation-triangle"></span></span><span class="nav-link-text ps-1">Errors</span>
                  </div>
                </a>
                  <ul class="nav collapse" id="errors">
                    <li class="nav-item"><a class="nav-link" href="../pages/errors/404.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">404</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../pages/errors/500.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">500</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                  </ul>
                  <!-- parent pages--><a class="nav-link dropdown-indicator" href="#miscellaneous" role="button"
                                         data-bs-toggle="collapse" aria-expanded="false" aria-controls="miscellaneous">
                  <div class="d-flex align-items-center"><span class="nav-link-icon"><span
                    class="fas fa-thumbtack"></span></span><span class="nav-link-text ps-1">Miscellaneous</span>
                  </div>
                </a>
                  <ul class="nav collapse" id="miscellaneous">
                    <li class="nav-item"><a class="nav-link" href="../pages/miscellaneous/associations.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Associations</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../pages/miscellaneous/invite-people.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Invite people</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../pages/miscellaneous/privacy-policy.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Privacy policy</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                  </ul>
                  <!-- parent pages--><a class="nav-link dropdown-indicator" href="#Layouts" role="button"
                                         data-bs-toggle="collapse" aria-expanded="false" aria-controls="Layouts">
                  <div class="d-flex align-items-center"><span class="nav-link-icon"><span
                    class="far fa-window-restore"></span></span><span class="nav-link-text ps-1">Layouts</span>
                  </div>
                </a>
                  <ul class="nav collapse" id="Layouts">
                    <li class="nav-item"><a class="nav-link" href="../demo/navbar-vertical.html" target="_blank">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Navbar vertical</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../demo/navbar-top.html" target="_blank">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Top nav</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../demo/navbar-double-top.html" target="_blank">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Double top</span><span
                        class="badge rounded-pill ms-2 badge-subtle-success">New</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../demo/combo-nav.html" target="_blank">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Combo nav</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                  </ul>
                </li>
                <li class="nav-item">
                  <!-- label-->
                  <div class="row navbar-vertical-label-wrapper mt-3 mb-2">
                    <div class="col-auto navbar-vertical-label">Modules
                    </div>
                    <div class="col ps-0">
                      <hr class="mb-0 navbar-vertical-divider"/>
                    </div>
                  </div>
                  <!-- parent pages--><a class="nav-link dropdown-indicator" href="#forms" role="button"
                                         data-bs-toggle="collapse" aria-expanded="false" aria-controls="forms">
                  <div class="d-flex align-items-center"><span class="nav-link-icon"><span
                    class="fas fa-file-alt"></span></span><span class="nav-link-text ps-1">Forms</span>
                  </div>
                </a>
                  <ul class="nav collapse" id="forms">
                    <li class="nav-item"><a class="nav-link dropdown-indicator" href="#basic" data-bs-toggle="collapse"
                                            aria-expanded="false" aria-controls="forms">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Basic</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                      <ul class="nav collapse" id="basic">
                        <li class="nav-item"><a class="nav-link" href="../modules/forms/basic/form-control.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Form control</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link" href="../modules/forms/basic/input-group.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Input group</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link" href="../modules/forms/basic/select.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Select</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link" href="../modules/forms/basic/checks.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Checks</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link" href="../modules/forms/basic/range.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Range</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link" href="../modules/forms/basic/layout.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Layout</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                      </ul>
                    </li>
                    <li class="nav-item"><a class="nav-link dropdown-indicator" href="#advance"
                                            data-bs-toggle="collapse" aria-expanded="false" aria-controls="forms">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Advance</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                      <ul class="nav collapse" id="advance">
                        <li class="nav-item"><a class="nav-link" href="../modules/forms/advance/advance-select.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Advance select</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link" href="../modules/forms/advance/date-picker.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Date picker</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link" href="../modules/forms/advance/editor.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Editor</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link" href="../modules/forms/advance/emoji-button.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Emoji button</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link" href="../modules/forms/advance/file-uploader.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">File uploader</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link" href="../modules/forms/advance/input-mask.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Input mask</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link" href="../modules/forms/advance/range-slider.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Range slider</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link" href="../modules/forms/advance/rating.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Rating</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                      </ul>
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/forms/floating-labels.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Floating labels</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/forms/wizard.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Wizard</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/forms/validation.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Validation</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                  </ul>
                  <!-- parent pages--><a class="nav-link dropdown-indicator" href="#tables" role="button"
                                         data-bs-toggle="collapse" aria-expanded="false" aria-controls="tables">
                  <div class="d-flex align-items-center"><span class="nav-link-icon"><span class="fas fa-table"></span></span><span
                    class="nav-link-text ps-1">Tables</span>
                  </div>
                </a>
                  <ul class="nav collapse" id="tables">
                    <li class="nav-item"><a class="nav-link" href="../modules/tables/basic-tables.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Basic tables</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/tables/advance-tables.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Advance tables</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/tables/bulk-select.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Bulk select</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                  </ul>
                  <!-- parent pages--><a class="nav-link dropdown-indicator" href="#charts" role="button"
                                         data-bs-toggle="collapse" aria-expanded="false" aria-controls="charts">
                  <div class="d-flex align-items-center"><span class="nav-link-icon"><span
                    class="fas fa-chart-line"></span></span><span class="nav-link-text ps-1">Charts</span>
                  </div>
                </a>
                  <ul class="nav collapse" id="charts">
                    <li class="nav-item"><a class="nav-link" href="../modules/charts/chartjs.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Chartjs</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/charts/d3js.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">D3js</span><span
                        class="badge rounded-pill ms-2 badge-subtle-success">New</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link dropdown-indicator" href="#eCharts"
                                            data-bs-toggle="collapse" aria-expanded="false" aria-controls="charts">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">ECharts</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                      <ul class="nav collapse" id="eCharts">
                        <li class="nav-item"><a class="nav-link" href="../modules/charts/echarts/line-charts.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Line charts</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link" href="../modules/charts/echarts/bar-charts.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Bar charts</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link"
                                                href="../modules/charts/echarts/candlestick-charts.html">
                          <div class="d-flex align-items-center"><span
                            class="nav-link-text ps-1">Candlestick charts</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link" href="../modules/charts/echarts/geo-map.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Geo map</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link" href="../modules/charts/echarts/scatter-charts.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Scatter charts</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link" href="../modules/charts/echarts/pie-charts.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Pie charts</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link" href="../modules/charts/echarts/gauge-charts.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Gauge charts</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link" href="../modules/charts/echarts/radar-charts.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Radar charts</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link" href="../modules/charts/echarts/heatmap-charts.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Heatmap charts</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link" href="../modules/charts/echarts/how-to-use.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">How to use</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                      </ul>
                    </li>
                  </ul>
                  <!-- parent pages--><a class="nav-link dropdown-indicator" href="#icons" role="button"
                                         data-bs-toggle="collapse" aria-expanded="false" aria-controls="icons">
                  <div class="d-flex align-items-center"><span class="nav-link-icon"><span class="fas fa-shapes"></span></span><span
                    class="nav-link-text ps-1">Icons</span>
                  </div>
                </a>
                  <ul class="nav collapse" id="icons">
                    <li class="nav-item"><a class="nav-link" href="../modules/icons/font-awesome.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Font awesome</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/icons/bootstrap-icons.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Bootstrap icons</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/icons/feather.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Feather</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/icons/material-icons.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Material icons</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                  </ul>
                  <!-- parent pages--><a class="nav-link dropdown-indicator" href="#maps" role="button"
                                         data-bs-toggle="collapse" aria-expanded="false" aria-controls="maps">
                  <div class="d-flex align-items-center"><span class="nav-link-icon"><span
                    class="fas fa-map"></span></span><span class="nav-link-text ps-1">Maps</span>
                  </div>
                </a>
                  <ul class="nav collapse" id="maps">
                    <li class="nav-item"><a class="nav-link" href="../modules/maps/google-map.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Google map</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/maps/leaflet-map.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Leaflet map</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                  </ul>
                  <!-- parent pages--><a class="nav-link dropdown-indicator" href="#components" role="button"
                                         data-bs-toggle="collapse" aria-expanded="false" aria-controls="components">
                  <div class="d-flex align-items-center"><span class="nav-link-icon"><span
                    class="fas fa-puzzle-piece"></span></span><span class="nav-link-text ps-1">Components</span>
                  </div>
                </a>
                  <ul class="nav collapse" id="components">
                    <li class="nav-item"><a class="nav-link" href="../modules/components/accordion.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Accordion</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/components/alerts.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Alerts</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/components/anchor.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Anchor</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/components/animated-icons.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Animated icons</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/components/background.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Background</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/components/badges.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Badges</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/components/bottom-bar.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Bottom bar</span><span
                        class="badge rounded-pill ms-2 badge-subtle-success">New</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/components/breadcrumbs.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Breadcrumbs</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/components/buttons.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Buttons</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/components/calendar.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Calendar</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/components/cards.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Cards</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link dropdown-indicator" href="#carousel"
                                            data-bs-toggle="collapse" aria-expanded="false" aria-controls="components">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Carousel</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                      <ul class="nav collapse" id="carousel">
                        <li class="nav-item"><a class="nav-link" href="../modules/components/carousel/bootstrap.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Bootstrap</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link" href="../modules/components/carousel/swiper.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Swiper</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                      </ul>
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/components/collapse.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Collapse</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/components/cookie-notice.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Cookie notice</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/components/countup.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Countup</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/components/draggable.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Draggable</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/components/dropdowns.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Dropdowns</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/components/jquery-components.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Jquery</span><span
                        class="badge rounded-pill ms-2 badge-subtle-success">New</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/components/list-group.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">List group</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/components/modals.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Modals</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link dropdown-indicator" href="#navs-_and_-Tabs"
                                            data-bs-toggle="collapse" aria-expanded="false" aria-controls="components">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Navs &amp; Tabs</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                      <ul class="nav collapse" id="navs-_and_-Tabs">
                        <li class="nav-item"><a class="nav-link" href="../modules/components/navs-and-tabs/navs.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Navs</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link" href="../modules/components/navs-and-tabs/navbar.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Navbar</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link"
                                                href="../modules/components/navs-and-tabs/vertical-navbar.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Navbar vertical</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link"
                                                href="../modules/components/navs-and-tabs/top-navbar.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Top nav</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link"
                                                href="../modules/components/navs-and-tabs/double-top-navbar.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Double top</span><span
                            class="badge rounded-pill ms-2 badge-subtle-success">New</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link"
                                                href="../modules/components/navs-and-tabs/combo-navbar.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Combo nav</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link" href="../modules/components/navs-and-tabs/tabs.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Tabs</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                      </ul>
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/components/offcanvas.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Offcanvas</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link dropdown-indicator" href="#pictures"
                                            data-bs-toggle="collapse" aria-expanded="false" aria-controls="components">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Pictures</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                      <ul class="nav collapse" id="pictures">
                        <li class="nav-item"><a class="nav-link" href="../modules/components/pictures/avatar.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Avatar</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link" href="../modules/components/pictures/images.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Images</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link" href="../modules/components/pictures/figures.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Figures</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link" href="../modules/components/pictures/hoverbox.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Hoverbox</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link" href="../modules/components/pictures/lightbox.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Lightbox</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                      </ul>
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/components/progress-bar.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Progress bar</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/components/placeholder.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Placeholder</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/components/pagination.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Pagination</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/components/popovers.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Popovers</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/components/scrollspy.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Scrollspy</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/components/search.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Search</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/components/spinners.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Spinners</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/components/timeline.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Timeline</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/components/toasts.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Toasts</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/components/tooltips.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Tooltips</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/components/treeview.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Treeview</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/components/typed-text.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Typed text</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link dropdown-indicator" href="#videos" data-bs-toggle="collapse"
                                            aria-expanded="false" aria-controls="components">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Videos</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                      <ul class="nav collapse" id="videos">
                        <li class="nav-item"><a class="nav-link" href="../modules/components/videos/embed.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Embed</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link" href="../modules/components/videos/plyr.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Plyr</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                      </ul>
                    </li>
                  </ul>
                  <!-- parent pages--><a class="nav-link dropdown-indicator" href="#utilities" role="button"
                                         data-bs-toggle="collapse" aria-expanded="false" aria-controls="utilities">
                  <div class="d-flex align-items-center"><span class="nav-link-icon"><span
                    class="fas fa-fire"></span></span><span class="nav-link-text ps-1">Utilities</span>
                  </div>
                </a>
                  <ul class="nav collapse" id="utilities">
                    <li class="nav-item"><a class="nav-link" href="../modules/utilities/borders.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Borders</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/utilities/clearfix.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Clearfix</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/utilities/colors.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Colors</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/utilities/colored-links.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Colored links</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/utilities/display.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Display</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/utilities/flex.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Flex</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/utilities/float.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Float</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/utilities/grid.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Grid</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/utilities/overlayscrollbar.html">
                      <div class="d-flex align-items-center"><span
                        class="nav-link-text ps-1">Overlay scrollbar</span><span
                        class="badge rounded-pill ms-2 badge-subtle-success">New</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/utilities/position.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Position</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/utilities/spacing.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Spacing</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/utilities/sizing.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Sizing</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/utilities/stretched-link.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Stretched link</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/utilities/text-truncation.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Text truncation</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/utilities/typography.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Typography</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/utilities/vertical-align.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Vertical align</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../modules/utilities/visibility.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Visibility</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                  </ul>
                  <!-- parent pages--><a class="nav-link" href="../widgets.html" role="button">
                  <div class="d-flex align-items-center"><span class="nav-link-icon"><span
                    class="fas fa-poll"></span></span><span class="nav-link-text ps-1">Widgets</span>
                  </div>
                </a>
                  <!-- parent pages--><a class="nav-link dropdown-indicator" href="#multi-level" role="button"
                                         data-bs-toggle="collapse" aria-expanded="false" aria-controls="multi-level">
                  <div class="d-flex align-items-center"><span class="nav-link-icon"><span
                    class="fas fa-layer-group"></span></span><span class="nav-link-text ps-1">Multi level</span>
                  </div>
                </a>
                  <ul class="nav collapse" id="multi-level">
                    <li class="nav-item"><a class="nav-link dropdown-indicator" href="#level-two"
                                            data-bs-toggle="collapse" aria-expanded="false" aria-controls="multi-level">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Level two</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                      <ul class="nav collapse" id="level-two">
                        <li class="nav-item"><a class="nav-link" href="../#!.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Item 1</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link" href="../#!.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Item 2</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                      </ul>
                    </li>
                    <li class="nav-item"><a class="nav-link dropdown-indicator" href="#level-three"
                                            data-bs-toggle="collapse" aria-expanded="false" aria-controls="multi-level">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Level three</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                      <ul class="nav collapse" id="level-three">
                        <li class="nav-item"><a class="nav-link" href="../#!.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Item 3</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link dropdown-indicator" href="#item-4"
                                                data-bs-toggle="collapse" aria-expanded="false"
                                                aria-controls="level-three">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Item 4</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                          <ul class="nav collapse" id="item-4">
                            <li class="nav-item"><a class="nav-link" href="../#!.html">
                              <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Item 5</span>
                              </div>
                            </a>
                              <!-- more inner pages-->
                            </li>
                            <li class="nav-item"><a class="nav-link" href="../#!.html">
                              <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Item 6</span>
                              </div>
                            </a>
                              <!-- more inner pages-->
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                    <li class="nav-item"><a class="nav-link dropdown-indicator" href="#level-four"
                                            data-bs-toggle="collapse" aria-expanded="false" aria-controls="multi-level">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Level four</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                      <ul class="nav collapse" id="level-four">
                        <li class="nav-item"><a class="nav-link" href="../#!.html">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Item 6</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                        </li>
                        <li class="nav-item"><a class="nav-link dropdown-indicator" href="#item-7"
                                                data-bs-toggle="collapse" aria-expanded="false"
                                                aria-controls="level-four">
                          <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Item 7</span>
                          </div>
                        </a>
                          <!-- more inner pages-->
                          <ul class="nav collapse" id="item-7">
                            <li class="nav-item"><a class="nav-link" href="../#!.html">
                              <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Item 8</span>
                              </div>
                            </a>
                              <!-- more inner pages-->
                            </li>
                            <li class="nav-item"><a class="nav-link dropdown-indicator" href="#item-9"
                                                    data-bs-toggle="collapse" aria-expanded="false"
                                                    aria-controls="item-7">
                              <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Item 9</span>
                              </div>
                            </a>
                              <!-- more inner pages-->
                              <ul class="nav collapse" id="item-9">
                                <li class="nav-item"><a class="nav-link" href="../#!.html">
                                  <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Item 10</span>
                                  </div>
                                </a>
                                  <!-- more inner pages-->
                                </li>
                                <li class="nav-item"><a class="nav-link" href="../#!.html">
                                  <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Item 11</span>
                                  </div>
                                </a>
                                  <!-- more inner pages-->
                                </li>
                              </ul>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
                <li class="nav-item">
                  <!-- label-->
                  <div class="row navbar-vertical-label-wrapper mt-3 mb-2">
                    <div class="col-auto navbar-vertical-label">Documentation
                    </div>
                    <div class="col ps-0">
                      <hr class="mb-0 navbar-vertical-divider"/>
                    </div>
                  </div>
                  <!-- parent pages--><a class="nav-link" href="../documentation/getting-started.html" role="button">
                  <div class="d-flex align-items-center"><span class="nav-link-icon"><span class="fas fa-rocket"></span></span><span
                    class="nav-link-text ps-1">Getting started</span>
                  </div>
                </a>
                  <!-- parent pages--><a class="nav-link dropdown-indicator" href="#customization" role="button"
                                         data-bs-toggle="collapse" aria-expanded="false" aria-controls="customization">
                  <div class="d-flex align-items-center"><span class="nav-link-icon"><span class="fas fa-wrench"></span></span><span
                    class="nav-link-text ps-1">Customization</span>
                  </div>
                </a>
                  <ul class="nav collapse" id="customization">
                    <li class="nav-item"><a class="nav-link" href="../documentation/customization/configuration.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Configuration</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../documentation/customization/styling.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Styling</span><span
                        class="badge rounded-pill ms-2 badge-subtle-success">Updated</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../documentation/customization/dark-mode.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Dark mode</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                    <li class="nav-item"><a class="nav-link" href="../documentation/customization/plugin.html">
                      <div class="d-flex align-items-center"><span class="nav-link-text ps-1">Plugin</span>
                      </div>
                    </a>
                      <!-- more inner pages-->
                    </li>
                  </ul>
                  <!-- parent pages--><a class="nav-link" href="../documentation/faq.html" role="button">
                  <div class="d-flex align-items-center"><span class="nav-link-icon"><span
                    class="fas fa-question-circle"></span></span><span class="nav-link-text ps-1">Faq</span>
                  </div>
                </a>
                  <!-- parent pages--><a class="nav-link" href="../documentation/gulp.html" role="button">
                  <div class="d-flex align-items-center"><span class="nav-link-icon"><span
                    class="fab fa-gulp"></span></span><span class="nav-link-text ps-1">Gulp</span>
                  </div>
                </a>
                  <!-- parent pages--><a class="nav-link" href="../documentation/design-file.html" role="button">
                  <div class="d-flex align-items-center"><span class="nav-link-icon"><span
                    class="fas fa-palette"></span></span><span class="nav-link-text ps-1">Design file</span>
                  </div>
                </a>
                  <!-- parent pages--><a class="nav-link" href="../changelog.html" role="button">
                  <div class="d-flex align-items-center"><span class="nav-link-icon"><span
                    class="fas fa-code-branch"></span></span><span class="nav-link-text ps-1">Changelog</span>
                  </div>
                </a>
                </li>
              </ul>
              <div class="settings mb-3">
                <div class="card shadow-none">
                  <div class="card-body alert mb-0" role="alert">
                    <div class="btn-close-falcon-container">
                      <button class="btn btn-link btn-close-falcon p-0" aria-label="Close"
                              data-bs-dismiss="alert"></button>
                    </div>
                    <div class="text-center"><img src="../assets/img/icons/spot-illustrations/navbar-vertical.png"
                                                  alt="" width="80"/>
                      <p class="fs--2 mt-2">Loving what you see? <br/>Get your copy of <a href="#!">Falcon</a></p>
                      <div class="d-grid"><a class="btn btn-sm btn-purchase"
                                             href="https://themes.getbootstrap.com/product/falcon-admin-dashboard-webapp-template/"
                                             target="_blank">Purchase</a></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <div class="content">
          <nav class="navbar navbar-light navbar-glass navbar-top navbar-expand">

            <button class="btn navbar-toggler-humburger-icon navbar-toggler me-1 me-sm-3" type="button"
                    data-bs-toggle="collapse" data-bs-target="#navbarVerticalCollapse"
                    aria-controls="navbarVerticalCollapse" aria-expanded="false" aria-label="Toggle Navigation"><span
              class="navbar-toggle-icon"><span class="toggle-line"></span></span></button>
            <a class="navbar-brand me-1 me-sm-3" href="../index.html">
              <div class="d-flex align-items-center"><img class="me-2"
                                                          src="../assets/img/icons/spot-illustrations/falcon.png" alt=""
                                                          width="40"/><span class="font-sans-serif">falcon</span>
              </div>
            </a>
            <ul class="navbar-nav align-items-center d-none d-lg-block">
              <li class="nav-item">
                <div class="search-box" data-list='{"valueNames":["title"]}'>
                  <form class="position-relative" data-bs-toggle="search" data-bs-display="static">
                    <input class="form-control search-input fuzzy-search" type="search" placeholder="Search..."
                           aria-label="Search"/>
                    <span class="fas fa-search search-box-icon"></span>

                  </form>
                  <div class="btn-close-falcon-container position-absolute end-0 top-50 translate-middle shadow-none"
                       data-bs-dismiss="search">
                    <button class="btn btn-link btn-close-falcon p-0" aria-label="Close"></button>
                  </div>
                  <div class="dropdown-menu border font-base start-0 mt-2 py-0 overflow-hidden w-100">
                    <div class="scrollbar list py-3" style="max-height: 24rem;">
                      <h6 class="dropdown-header fw-medium text-uppercase px-x1 fs--2 pt-0 pb-2">Recently Browsed</h6><a
                      class="dropdown-item fs--1 px-x1 py-1 hover-primary" href="../app/events/event-detail.html">
                      <div class="d-flex align-items-center">
                        <span class="fas fa-circle me-2 text-300 fs--2"></span>

                        <div class="fw-normal title">Pages <span class="fas fa-chevron-right mx-1 text-500 fs--2"
                                                                 data-fa-transform="shrink-2"></span> Events
                        </div>
                      </div>
                    </a>
                      <a class="dropdown-item fs--1 px-x1 py-1 hover-primary" href="../app/e-commerce/customers.html">
                        <div class="d-flex align-items-center">
                          <span class="fas fa-circle me-2 text-300 fs--2"></span>

                          <div class="fw-normal title">E-commerce <span class="fas fa-chevron-right mx-1 text-500 fs--2"
                                                                        data-fa-transform="shrink-2"></span> Customers
                          </div>
                        </div>
                      </a>

                      <hr class="text-200 dark__text-900"/>
                      <h6 class="dropdown-header fw-medium text-uppercase px-x1 fs--2 pt-0 pb-2">Suggested Filter</h6><a
                      class="dropdown-item px-x1 py-1 fs-0" href="../app/e-commerce/customers.html">
                      <div class="d-flex align-items-center"><span
                        class="badge fw-medium text-decoration-none me-2 badge-subtle-warning">customers:</span>
                        <div class="flex-1 fs--1 title">All customers list</div>
                      </div>
                    </a>
                      <a class="dropdown-item px-x1 py-1 fs-0" href="../app/events/event-detail.html">
                        <div class="d-flex align-items-center"><span
                          class="badge fw-medium text-decoration-none me-2 badge-subtle-success">events:</span>
                          <div class="flex-1 fs--1 title">Latest events in current month</div>
                        </div>
                      </a>
                      <a class="dropdown-item px-x1 py-1 fs-0" href="../app/e-commerce/product/product-grid.html">
                        <div class="d-flex align-items-center"><span
                          class="badge fw-medium text-decoration-none me-2 badge-subtle-info">products:</span>
                          <div class="flex-1 fs--1 title">Most popular products</div>
                        </div>
                      </a>

                      <hr class="text-200 dark__text-900"/>
                      <h6 class="dropdown-header fw-medium text-uppercase px-x1 fs--2 pt-0 pb-2">Files</h6><a
                      class="dropdown-item px-x1 py-2" href="#!">
                      <div class="d-flex align-items-center">
                        <div class="file-thumbnail me-2"><img class="border h-100 w-100 object-fit-cover rounded-3"
                                                              src="../assets/img/products/3-thumb.png" alt=""/></div>
                        <div class="flex-1">
                          <h6 class="mb-0 title">iPhone</h6>
                          <p class="fs--2 mb-0 d-flex"><span class="fw-semi-bold">Antony</span><span
                            class="fw-medium text-600 ms-2">27 Sep at 10:30 AM</span></p>
                        </div>
                      </div>
                    </a>
                      <a class="dropdown-item px-x1 py-2" href="#!">
                        <div class="d-flex align-items-center">
                          <div class="file-thumbnail me-2"><img class="img-fluid" src="../assets/img/icons/zip.png"
                                                                alt=""/></div>
                          <div class="flex-1">
                            <h6 class="mb-0 title">Falcon v1.8.2</h6>
                            <p class="fs--2 mb-0 d-flex"><span class="fw-semi-bold">John</span><span
                              class="fw-medium text-600 ms-2">30 Sep at 12:30 PM</span></p>
                          </div>
                        </div>
                      </a>

                      <hr class="text-200 dark__text-900"/>
                      <h6 class="dropdown-header fw-medium text-uppercase px-x1 fs--2 pt-0 pb-2">Members</h6><a
                      class="dropdown-item px-x1 py-2" href="../pages/user/profile.html">
                      <div class="d-flex align-items-center">
                        <div class="avatar avatar-l status-online me-2">
                          <img class="rounded-circle" src="../assets/img/team/1.jpg" alt=""/>

                        </div>
                        <div class="flex-1">
                          <h6 class="mb-0 title">Anna Karinina</h6>
                          <p class="fs--2 mb-0 d-flex">Technext Limited</p>
                        </div>
                      </div>
                    </a>
                      <a class="dropdown-item px-x1 py-2" href="../pages/user/profile.html">
                        <div class="d-flex align-items-center">
                          <div class="avatar avatar-l me-2">
                            <img class="rounded-circle" src="../assets/img/team/2.jpg" alt=""/>

                          </div>
                          <div class="flex-1">
                            <h6 class="mb-0 title">Antony Hopkins</h6>
                            <p class="fs--2 mb-0 d-flex">Brain Trust</p>
                          </div>
                        </div>
                      </a>
                      <a class="dropdown-item px-x1 py-2" href="../pages/user/profile.html">
                        <div class="d-flex align-items-center">
                          <div class="avatar avatar-l me-2">
                            <img class="rounded-circle" src="../assets/img/team/3.jpg" alt=""/>

                          </div>
                          <div class="flex-1">
                            <h6 class="mb-0 title">Emma Watson</h6>
                            <p class="fs--2 mb-0 d-flex">Google</p>
                          </div>
                        </div>
                      </a>

                    </div>
                    <div class="text-center mt-n3">
                      <p class="fallback fw-bold fs-1 d-none">No Result Found.</p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
            <ul class="navbar-nav navbar-nav-icons ms-auto flex-row align-items-center">
              <li class="nav-item px-2">
                <div class="theme-control-toggle fa-icon-wait">
                  <input class="form-check-input ms-0 theme-control-toggle-input" id="themeControlToggle"
                         type="checkbox" data-theme-control="theme" value="dark"/>
                  <label class="mb-0 theme-control-toggle-label theme-control-toggle-light" for="themeControlToggle"
                         data-bs-toggle="tooltip" data-bs-placement="left" title="Switch to light theme"><span
                    class="fas fa-sun fs-0"></span></label>
                  <label class="mb-0 theme-control-toggle-label theme-control-toggle-dark" for="themeControlToggle"
                         data-bs-toggle="tooltip" data-bs-placement="left" title="Switch to dark theme"><span
                    class="fas fa-moon fs-0"></span></label>
                </div>
              </li>
              <li class="nav-item d-none d-sm-block">
                <a
                  class="nav-link px-0 notification-indicator notification-indicator-warning notification-indicator-fill fa-icon-wait"
                  href="../app/e-commerce/shopping-cart.html"><span class="fas fa-shopping-cart"
                                                                    data-fa-transform="shrink-7"
                                                                    style="font-size: 33px;"></span><span
                  class="notification-indicator-number">1</span></a>

              </li>
              <li class="nav-item dropdown">
                <a class="nav-link notification-indicator notification-indicator-primary px-0 fa-icon-wait"
                   id="navbarDropdownNotification" role="button" data-bs-toggle="dropdown" aria-haspopup="true"
                   aria-expanded="false" data-hide-on-body-scroll="data-hide-on-body-scroll"><span class="fas fa-bell"
                                                                                                   data-fa-transform="shrink-6"
                                                                                                   style="font-size: 33px;"></span></a>
                <div
                  class="dropdown-menu dropdown-caret dropdown-caret dropdown-menu-end dropdown-menu-card dropdown-menu-notification dropdown-caret-bg"
                  aria-labelledby="navbarDropdownNotification">
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
                    <div class="scrollbar-overlay" style="max-height:19rem">
                      <div class="list-group list-group-flush fw-normal fs--1">
                        <div class="list-group-title border-bottom">NEW</div>
                        <div class="list-group-item">
                          <a class="notification notification-flush notification-unread" href="#!">
                            <div class="notification-avatar">
                              <div class="avatar avatar-2xl me-3">
                                <img class="rounded-circle" src="../assets/img/team/1-thumb.png" alt=""/>

                              </div>
                            </div>
                            <div class="notification-body">
                              <p class="mb-1"><strong>Emma Watson</strong> replied to your comment : "Hello world 😍"</p>
                              <span class="notification-time"><span class="me-2" role="img" aria-label="Emoji">💬</span>Just now</span>

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
                              <span class="notification-time"><span class="me-2 fab fa-gratipay text-danger"></span>9hr</span>

                            </div>
                          </a>

                        </div>
                        <div class="list-group-title border-bottom">EARLIER</div>
                        <div class="list-group-item">
                          <a class="notification notification-flush" href="#!">
                            <div class="notification-avatar">
                              <div class="avatar avatar-2xl me-3">
                                <img class="rounded-circle" src="../assets/img/icons/weather-sm.jpg" alt=""/>

                              </div>
                            </div>
                            <div class="notification-body">
                              <p class="mb-1">The forecast today shows a low of 20&#8451; in California. See today's
                                weather.</p>
                              <span class="notification-time"><span class="me-2" role="img" aria-label="Emoji">🌤️</span>1d</span>

                            </div>
                          </a>

                        </div>
                        <div class="list-group-item">
                          <a class="border-bottom-0 notification-unread  notification notification-flush" href="#!">
                            <div class="notification-avatar">
                              <div class="avatar avatar-xl me-3">
                                <img class="rounded-circle" src="../assets/img/logos/oxford.png" alt=""/>

                              </div>
                            </div>
                            <div class="notification-body">
                              <p class="mb-1"><strong>University of Oxford</strong> created an event : "Causal Inference
                                Hilary 2019"</p>
                              <span class="notification-time"><span class="me-2" role="img" aria-label="Emoji">✌️</span>1w</span>

                            </div>
                          </a>

                        </div>
                        <div class="list-group-item">
                          <a class="border-bottom-0 notification notification-flush" href="#!">
                            <div class="notification-avatar">
                              <div class="avatar avatar-xl me-3">
                                <img class="rounded-circle" src="../assets/img/team/10.jpg" alt=""/>

                              </div>
                            </div>
                            <div class="notification-body">
                              <p class="mb-1"><strong>James Cameron</strong> invited to join the group: United Nations
                                International Children's Fund</p>
                              <span class="notification-time"><span class="me-2" role="img" aria-label="Emoji">🙋‍</span>2d</span>

                            </div>
                          </a>

                        </div>
                      </div>
                    </div>
                    <div class="card-footer text-center border-top"><a class="card-link d-block"
                                                                       href="../app/social/notifications.html">View
                      all</a></div>
                  </div>
                </div>

              </li>
              <li class="nav-item dropdown px-1">
                <a class="nav-link fa-icon-wait nine-dots p-1" id="navbarDropdownMenu" role="button"
                   data-hide-on-body-scroll="data-hide-on-body-scroll" data-bs-toggle="dropdown" aria-haspopup="true"
                   aria-expanded="false">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="43" viewBox="0 0 16 16" fill="none">
                    <circle cx="2" cy="2" r="2" fill="#6C6E71"></circle>
                    <circle cx="2" cy="8" r="2" fill="#6C6E71"></circle>
                    <circle cx="2" cy="14" r="2" fill="#6C6E71"></circle>
                    <circle cx="8" cy="8" r="2" fill="#6C6E71"></circle>
                    <circle cx="8" cy="14" r="2" fill="#6C6E71"></circle>
                    <circle cx="14" cy="8" r="2" fill="#6C6E71"></circle>
                    <circle cx="14" cy="14" r="2" fill="#6C6E71"></circle>
                    <circle cx="8" cy="2" r="2" fill="#6C6E71"></circle>
                    <circle cx="14" cy="2" r="2" fill="#6C6E71"></circle>
                  </svg>
                </a>
                <div
                  class="dropdown-menu dropdown-caret dropdown-caret dropdown-menu-end dropdown-menu-card dropdown-caret-bg"
                  aria-labelledby="navbarDropdownMenu">
                  <div class="card shadow-none">
                    <div class="scrollbar-overlay nine-dots-dropdown">
                      <div class="card-body px-3">
                        <div class="row text-center gx-0 gy-0">
                          <div class="col-4"><a
                            class="d-block hover-bg-200 px-2 py-3 rounded-3 text-center text-decoration-none"
                            href="../pages/user/profile.html" target="_blank">
                            <div class="avatar avatar-2xl"><img class="rounded-circle" src="../assets/img/team/3.jpg"
                                                                alt=""/></div>
                            <p class="mb-0 fw-medium text-800 text-truncate fs--2">Account</p>
                          </a></div>
                          <div class="col-4"><a
                            class="d-block hover-bg-200 px-2 py-3 rounded-3 text-center text-decoration-none"
                            href="https://themewagon.com/" target="_blank"><img class="rounded"
                                                                                src="../assets/img/nav-icons/themewagon.png"
                                                                                alt="" width="40" height="40"/>
                            <p class="mb-0 fw-medium text-800 text-truncate fs--2 pt-1">Themewagon</p>
                          </a></div>
                          <div class="col-4"><a
                            class="d-block hover-bg-200 px-2 py-3 rounded-3 text-center text-decoration-none"
                            href="https://mailbluster.com/" target="_blank"><img class="rounded"
                                                                                 src="../assets/img/nav-icons/mailbluster.png"
                                                                                 alt="" width="40" height="40"/>
                            <p class="mb-0 fw-medium text-800 text-truncate fs--2 pt-1">Mailbluster</p>
                          </a></div>
                          <div class="col-4"><a
                            class="d-block hover-bg-200 px-2 py-3 rounded-3 text-center text-decoration-none" href="#!"
                            target="_blank"><img class="rounded" src="../assets/img/nav-icons/google.png" alt=""
                                                 width="40" height="40"/>
                            <p class="mb-0 fw-medium text-800 text-truncate fs--2 pt-1">Google</p>
                          </a></div>
                          <div class="col-4"><a
                            class="d-block hover-bg-200 px-2 py-3 rounded-3 text-center text-decoration-none" href="#!"
                            target="_blank"><img class="rounded" src="../assets/img/nav-icons/spotify.png" alt=""
                                                 width="40" height="40"/>
                            <p class="mb-0 fw-medium text-800 text-truncate fs--2 pt-1">Spotify</p>
                          </a></div>
                          <div class="col-4"><a
                            class="d-block hover-bg-200 px-2 py-3 rounded-3 text-center text-decoration-none" href="#!"
                            target="_blank"><img class="rounded" src="../assets/img/nav-icons/steam.png" alt=""
                                                 width="40" height="40"/>
                            <p class="mb-0 fw-medium text-800 text-truncate fs--2 pt-1">Steam</p>
                          </a></div>
                          <div class="col-4"><a
                            class="d-block hover-bg-200 px-2 py-3 rounded-3 text-center text-decoration-none" href="#!"
                            target="_blank"><img class="rounded" src="../assets/img/nav-icons/github-light.png" alt=""
                                                 width="40" height="40"/>
                            <p class="mb-0 fw-medium text-800 text-truncate fs--2 pt-1">Github</p>
                          </a></div>
                          <div class="col-4"><a
                            class="d-block hover-bg-200 px-2 py-3 rounded-3 text-center text-decoration-none" href="#!"
                            target="_blank"><img class="rounded" src="../assets/img/nav-icons/discord.png" alt=""
                                                 width="40" height="40"/>
                            <p class="mb-0 fw-medium text-800 text-truncate fs--2 pt-1">Discord</p>
                          </a></div>
                          <div class="col-4"><a
                            class="d-block hover-bg-200 px-2 py-3 rounded-3 text-center text-decoration-none" href="#!"
                            target="_blank"><img class="rounded" src="../assets/img/nav-icons/xbox.png" alt=""
                                                 width="40" height="40"/>
                            <p class="mb-0 fw-medium text-800 text-truncate fs--2 pt-1">xbox</p>
                          </a></div>
                          <div class="col-4"><a
                            class="d-block hover-bg-200 px-2 py-3 rounded-3 text-center text-decoration-none" href="#!"
                            target="_blank"><img class="rounded" src="../assets/img/nav-icons/trello.png" alt=""
                                                 width="40" height="40"/>
                            <p class="mb-0 fw-medium text-800 text-truncate fs--2 pt-1">Kanban</p>
                          </a></div>
                          <div class="col-4"><a
                            class="d-block hover-bg-200 px-2 py-3 rounded-3 text-center text-decoration-none" href="#!"
                            target="_blank"><img class="rounded" src="../assets/img/nav-icons/hp.png" alt="" width="40"
                                                 height="40"/>
                            <p class="mb-0 fw-medium text-800 text-truncate fs--2 pt-1">Hp</p>
                          </a></div>
                          <div class="col-12">
                            <hr class="my-3 mx-n3 bg-200"/>
                          </div>
                          <div class="col-4"><a
                            class="d-block hover-bg-200 px-2 py-3 rounded-3 text-center text-decoration-none" href="#!"
                            target="_blank"><img class="rounded" src="../assets/img/nav-icons/linkedin.png" alt=""
                                                 width="40" height="40"/>
                            <p class="mb-0 fw-medium text-800 text-truncate fs--2 pt-1">Linkedin</p>
                          </a></div>
                          <div class="col-4"><a
                            class="d-block hover-bg-200 px-2 py-3 rounded-3 text-center text-decoration-none" href="#!"
                            target="_blank"><img class="rounded" src="../assets/img/nav-icons/twitter.png" alt=""
                                                 width="40" height="40"/>
                            <p class="mb-0 fw-medium text-800 text-truncate fs--2 pt-1">Twitter</p>
                          </a></div>
                          <div class="col-4"><a
                            class="d-block hover-bg-200 px-2 py-3 rounded-3 text-center text-decoration-none" href="#!"
                            target="_blank"><img class="rounded" src="../assets/img/nav-icons/facebook.png" alt=""
                                                 width="40" height="40"/>
                            <p class="mb-0 fw-medium text-800 text-truncate fs--2 pt-1">Facebook</p>
                          </a></div>
                          <div class="col-4"><a
                            class="d-block hover-bg-200 px-2 py-3 rounded-3 text-center text-decoration-none" href="#!"
                            target="_blank"><img class="rounded" src="../assets/img/nav-icons/instagram.png" alt=""
                                                 width="40" height="40"/>
                            <p class="mb-0 fw-medium text-800 text-truncate fs--2 pt-1">Instagram</p>
                          </a></div>
                          <div class="col-4"><a
                            class="d-block hover-bg-200 px-2 py-3 rounded-3 text-center text-decoration-none" href="#!"
                            target="_blank"><img class="rounded" src="../assets/img/nav-icons/pinterest.png" alt=""
                                                 width="40" height="40"/>
                            <p class="mb-0 fw-medium text-800 text-truncate fs--2 pt-1">Pinterest</p>
                          </a></div>
                          <div class="col-4"><a
                            class="d-block hover-bg-200 px-2 py-3 rounded-3 text-center text-decoration-none" href="#!"
                            target="_blank"><img class="rounded" src="../assets/img/nav-icons/slack.png" alt=""
                                                 width="40" height="40"/>
                            <p class="mb-0 fw-medium text-800 text-truncate fs--2 pt-1">Slack</p>
                          </a></div>
                          <div class="col-4"><a
                            class="d-block hover-bg-200 px-2 py-3 rounded-3 text-center text-decoration-none" href="#!"
                            target="_blank"><img class="rounded" src="../assets/img/nav-icons/deviantart.png" alt=""
                                                 width="40" height="40"/>
                            <p class="mb-0 fw-medium text-800 text-truncate fs--2 pt-1">Deviantart</p>
                          </a></div>
                          <div class="col-4"><a
                            class="d-block hover-bg-200 px-2 py-3 rounded-3 text-center text-decoration-none"
                            href="../app/events/event-detail.html" target="_blank">
                            <div class="avatar avatar-2xl">
                              <div class="avatar-name rounded-circle bg-primary-subtle text-primary"><span class="fs-2">E</span>
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

              </li>
              <li class="nav-item dropdown"><a class="nav-link pe-0 ps-2" id="navbarDropdownUser" role="button"
                                               data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <div class="avatar avatar-xl">
                  <img class="rounded-circle" src="../assets/img/team/3-thumb.png" alt=""/>

                </div>
              </a>
                <div class="dropdown-menu dropdown-caret dropdown-caret dropdown-menu-end py-0"
                     aria-labelledby="navbarDropdownUser">
                  <div class="bg-white dark__bg-1000 rounded-2 py-2">
                    <a class="dropdown-item fw-bold text-warning" href="#!"><span
                      class="fas fa-crown me-1"></span><span>Go Pro</span></a>

                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item" href="#!">Set status</a>
                    <a class="dropdown-item" href="../pages/user/profile.html">Profile &amp; account</a>
                    <a class="dropdown-item" href="#!">Feedback</a>

                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item" href="../pages/user/settings.html">Settings</a>
                    <a class="dropdown-item" href="../pages/authentication/card/logout.html">Logout</a>
                  </div>
                </div>
              </li>
            </ul>
          </nav>
          <div class="row g-3">
            <div class="col-xxl-9">
              <div class="card rounded-3 overflow-hidden h-100">
                <div class="card-body bg-line-chart-gradient d-flex flex-column justify-content-between">
                  <div class="row align-items-center g-0">
                    <div class="col" data-bs-theme="light">
                      <h4 class="text-white mb-0">Today $764.39</h4>
                      <p class="fs--1 fw-semi-bold text-white">Yesterday <span class="opacity-50">$684.87</span></p>
                    </div>
                    <div class="col-auto d-none d-sm-block">
                      <select class="form-select form-select-sm mb-3" id="dashboard-chart-select">
                        <option value="all">All Payments</option>
                        <option value="successful" selected="selected">Successful Payments</option>
                        <option value="failed">Failed Payments</option>
                      </select>
                    </div>
                  </div>
                  <!-- Find the JS file for the following calendar at: src/js/charts/echarts/line-payment.js-->
                  <!-- If you are not using gulp based workflow, you can find the transpiled code at: public/assets/js/theme.js-->
                  <div class="echart-line-payment" style="height:200px" data-echart-responsive="true"></div>
                </div>
              </div>
            </div>
            <div class="col">
              <div class="row g-3">
                <div class="col-md-4 col-xxl-12">
                  <div class="card h-100">
                    <div class="card-body">
                      <div class="row flex-between-center g-0">
                        <div class="col-6 d-lg-block flex-between-center">
                          <h6 class="mb-2 text-900">Active Users</h6>
                          <h4 class="fs-3 fw-normal text-700 mb-0">765k</h4>
                        </div>
                        <div class="col-auto h-100">
                          <div style="height:50px;min-width:80px;"
                               data-echarts='{"xAxis":{"show":false,"boundaryGap":false},"series":[{"data":[3,7,6,8,5,12,11],"type":"line","symbol":"none"}],"grid":{"right":"0px","left":"0px","bottom":"0px","top":"0px"}}'></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-4 col-xxl-12">
                  <div class="card h-100">
                    <div class="card-body">
                      <div class="row flex-between-center">
                        <div class="col d-md-flex d-lg-block flex-between-center">
                          <h6 class="mb-md-0 mb-lg-2">Revenue</h6><span class="badge rounded-pill badge-subtle-success"><span
                          class="fas fa-caret-up"></span> 61.8%</span>
                        </div>
                        <div class="col-auto">
                          <h4 class="fs-3 fw-normal text-700"
                              data-countup='{"endValue":82.18,"decimalPlaces":2,"suffix":"M","prefix":"$"}'>0</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-4 col-xxl-12">
                  <div class="card h-100">
                    <div class="card-body">
                      <div class="row flex-between-center">
                        <div class="col d-md-flex d-lg-block flex-between-center">
                          <h6 class="mb-md-0 mb-lg-2">Conversion</h6><span
                          class="badge rounded-pill badge-subtle-primary"><span
                          class="fas fa-caret-up"></span> 29.4%</span>
                        </div>
                        <div class="col-auto">
                          <h4 class="fs-3 fw-normal text-primary"
                              data-countup='{"endValue":28.5,"decimalPlaces":2,"suffix":"%"}'>0</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row g-3 mb-3">
            <div class="col-xxl-9">
              <div class="card bg-light my-3">
                <div class="card-body p-3">
                  <p class="fs--1 mb-0"><a href="#!"><span class="fas fa-exchange-alt me-2"
                                                           data-fa-transform="rotate-90"></span>A payout for <strong>$921.42 </strong>was
                    deposited 13 days ago</a>. Your next deposit is expected on <strong>Tuesday, March 13.</strong></p>
                </div>
              </div>
              <div class="row g-3 mb-3">
                <div class="col-sm-6 col-md-4">
                  <div class="card overflow-hidden" style="min-width: 12rem">
                    <div class="bg-holder bg-card"
                         style="background-image:url(../assets/img/icons/spot-illustrations/corner-1.png);">
                    </div>
                    <!--/.bg-holder-->

                    <div class="card-body position-relative">
                      <h6>Customers<span class="badge badge-subtle-warning rounded-pill ms-2">-0.23%</span></h6>
                      <div class="display-4 fs-4 mb-2 fw-normal font-sans-serif text-warning"
                           data-countup='{"endValue":58.386,"decimalPlaces":2,"suffix":"k"}'>0
                      </div>
                      <a class="fw-semi-bold fs--1 text-nowrap" href="../app/e-commerce/customers.html">See all<span
                        class="fas fa-angle-right ms-1" data-fa-transform="down-1"></span></a>
                    </div>
                  </div>
                </div>
                <div class="col-sm-6 col-md-4">
                  <div class="card overflow-hidden" style="min-width: 12rem">
                    <div class="bg-holder bg-card"
                         style="background-image:url(../assets/img/icons/spot-illustrations/corner-2.png);">
                    </div>
                    <!--/.bg-holder-->

                    <div class="card-body position-relative">
                      <h6>Orders<span class="badge badge-subtle-info rounded-pill ms-2">0.0%</span></h6>
                      <div class="display-4 fs-4 mb-2 fw-normal font-sans-serif text-info"
                           data-countup='{"endValue":23.434,"decimalPlaces":2,"suffix":"k"}'>0
                      </div>
                      <a class="fw-semi-bold fs--1 text-nowrap" href="../app/e-commerce/orders/order-list.html">All
                        orders<span class="fas fa-angle-right ms-1" data-fa-transform="down-1"></span></a>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="card overflow-hidden" style="min-width: 12rem">
                    <div class="bg-holder bg-card"
                         style="background-image:url(../assets/img/icons/spot-illustrations/corner-3.png);">
                    </div>
                    <!--/.bg-holder-->

                    <div class="card-body position-relative">
                      <h6>Revenue<span class="badge badge-subtle-success rounded-pill ms-2">9.54%</span></h6>
                      <div class="display-4 fs-4 mb-2 fw-normal font-sans-serif"
                           data-countup='{"endValue":43594,"prefix":"$"}'>0
                      </div>
                      <a class="fw-semi-bold fs--1 text-nowrap" href="../index.html">Statistics<span
                        class="fas fa-angle-right ms-1" data-fa-transform="down-1"></span></a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row g-3">
                <div class="col-12">
                  <div class="card h-100">
                    <div class="card-header">
                      <div class="row flex-between-center">
                        <div class="col-auto">
                          <h6 class="mb-2">Candle Chart</h6>
                        </div>
                        <div class="col-auto mt-2">
                          <div class="row g-sm-4">
                            <div class="col-12 col-sm-auto">
                              <div class="mb-3 pe-4 border-end-sm border-200">
                                <h6 class="fs--2 text-600 mb-1">Forecast Hours</h6>
                                <div class="d-flex align-items-center">
                                  <h5 class="fs-0 text-900 mb-0 me-2">2077h</h5><span
                                  class="badge rounded-pill badge-subtle-primary"><span class="fas fa-caret-up"></span> 20.2%</span>
                                </div>
                              </div>
                            </div>
                            <div class="col-12 col-sm-auto">
                              <div class="mb-3 pe-4 border-end-sm border-200">
                                <h6 class="fs--2 text-600 mb-1">Workflow Hours</h6>
                                <div class="d-flex align-items-center">
                                  <h5 class="fs-0 text-900 mb-0 me-2">100h</h5><span
                                  class="badge rounded-pill badge-subtle-success"><span class="fas fa-caret-up"></span> 20%</span>
                                </div>
                              </div>
                            </div>
                            <div class="col-12 col-sm-auto">
                              <div class="mb-3 pe-0">
                                <h6 class="fs--2 text-600 mb-1">Forecast Income</h6>
                                <div class="d-flex align-items-center">
                                  <h5 class="fs-0 text-900 mb-0 me-2">$256,489</h5><span
                                  class="badge rounded-pill badge-subtle-primary"><span class="fas fa-caret-up"></span> 18%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="card-body pe-0 position-relative" id="candle-chart" dir="ltr">
                      <div class="btn-group position-absolute z-1 top-0 d-inline-block" role="group"
                           style="left:20px;right:20px;">
                        <button class="btn btn-falcon-default btn-sm mb-1" data-zoom="in"><span
                          class="fas fa-plus"></span></button>
                        <button class="btn btn-falcon-default btn-sm mb-1" data-zoom="out"><span
                          class="fas fa-minus"></span></button>
                      </div>
                      <!-- Find the JS file for the following calendar at: src/js/charts/echarts/candle-chart.js-->
                      <!-- If you are not using gulp based workflow, you can find the transpiled code at: public/assets/js/theme.js-->
                      <div class="echart-candle-chart" data-echart-responsive="true"
                           data-action-target="candle-chart"></div>
                    </div>
                  </div>
                </div>
                <div class="col-lg-4">
                  <div class="card">
                    <div class="card-header d-flex flex-between-center bg-light py-2">
                      <h6 class="mb-0">Active Users</h6>
                      <div class="dropdown font-sans-serif btn-reveal-trigger">
                        <button class="btn btn-link text-600 btn-sm dropdown-toggle dropdown-caret-none btn-reveal"
                                type="button" id="dropdown-active-user" data-bs-toggle="dropdown"
                                data-boundary="viewport" aria-haspopup="true" aria-expanded="false"><span
                          class="fas fa-ellipsis-h fs--2"></span></button>
                        <div class="dropdown-menu dropdown-menu-end border py-2" aria-labelledby="dropdown-active-user">
                          <a class="dropdown-item" href="#!">View</a><a class="dropdown-item" href="#!">Export</a>
                          <div class="dropdown-divider"></div>
                          <a class="dropdown-item text-danger" href="#!">Remove</a>
                        </div>
                      </div>
                    </div>
                    <div class="card-body py-2">
                      <div class="d-flex align-items-center position-relative mb-3">
                        <div class="avatar avatar-2xl status-online">
                          <img class="rounded-circle" src="../assets/img/team/1.jpg" alt=""/>

                        </div>
                        <div class="flex-1 ms-3">
                          <h6 class="mb-0 fw-semi-bold"><a class="stretched-link text-900"
                                                           href="../pages/user/profile.html">Emma Watson</a></h6>
                          <p class="text-500 fs--2 mb-0">Admin</p>
                        </div>
                      </div>
                      <div class="d-flex align-items-center position-relative mb-3">
                        <div class="avatar avatar-2xl status-online">
                          <img class="rounded-circle" src="../assets/img/team/2.jpg" alt=""/>

                        </div>
                        <div class="flex-1 ms-3">
                          <h6 class="mb-0 fw-semi-bold"><a class="stretched-link text-900"
                                                           href="../pages/user/profile.html">Antony Hopkins</a></h6>
                          <p class="text-500 fs--2 mb-0">Moderator</p>
                        </div>
                      </div>
                      <div class="d-flex align-items-center position-relative mb-3">
                        <div class="avatar avatar-2xl status-away">
                          <img class="rounded-circle" src="../assets/img/team/3.jpg" alt=""/>

                        </div>
                        <div class="flex-1 ms-3">
                          <h6 class="mb-0 fw-semi-bold"><a class="stretched-link text-900"
                                                           href="../pages/user/profile.html">Anna Karinina</a></h6>
                          <p class="text-500 fs--2 mb-0">Editor</p>
                        </div>
                      </div>
                      <div class="d-flex align-items-center position-relative mb-3">
                        <div class="avatar avatar-2xl status-offline">
                          <img class="rounded-circle" src="../assets/img/team/4.jpg" alt=""/>

                        </div>
                        <div class="flex-1 ms-3">
                          <h6 class="mb-0 fw-semi-bold"><a class="stretched-link text-900"
                                                           href="../pages/user/profile.html">John Lee</a></h6>
                          <p class="text-500 fs--2 mb-0">Admin</p>
                        </div>
                      </div>
                      <div class="d-flex align-items-center position-relative mb-3">
                        <div class="avatar avatar-2xl status-offline">
                          <img class="rounded-circle" src="../assets/img/team/5.jpg" alt=""/>

                        </div>
                        <div class="flex-1 ms-3">
                          <h6 class="mb-0 fw-semi-bold"><a class="stretched-link text-900"
                                                           href="../pages/user/profile.html">Rowen Atkinson</a></h6>
                          <p class="text-500 fs--2 mb-0">Editor</p>
                        </div>
                      </div>
                      <div class="d-flex align-items-center position-relative mb-3">
                        <div class="avatar avatar-2xl status-offline">
                          <img class="rounded-circle" src="../assets/img/team/6.jpg" alt=""/>

                        </div>
                        <div class="flex-1 ms-3">
                          <h6 class="mb-0 fw-semi-bold"><a class="stretched-link text-900"
                                                           href="../pages/user/profile.html">Bucky Robert</a></h6>
                          <p class="text-500 fs--2 mb-0">Editor</p>
                        </div>
                      </div>
                      <div class="d-flex align-items-center position-relative false">
                        <div class="avatar avatar-2xl status-offline">
                          <img class="rounded-circle" src="../assets/img/team/7.jpg" alt=""/>

                        </div>
                        <div class="flex-1 ms-3">
                          <h6 class="mb-0 fw-semi-bold"><a class="stretched-link text-900"
                                                           href="../pages/user/profile.html">Tom Hanks</a></h6>
                          <p class="text-500 fs--2 mb-0">Editor</p>
                        </div>
                      </div>
                    </div>
                    <div class="card-footer bg-light p-0"><a class="btn btn-sm btn-link d-block w-100 py-2"
                                                             href="../app/social/followers.html">All active users<span
                      class="fas fa-chevron-right ms-1 fs--2"></span></a></div>
                  </div>
                </div>
                <div class="col-lg-8">
                  <div class="card h-100">
                    <div class="card-header">
                      <div class="row justify-content-between gx-0">
                        <div class="col-auto">
                          <h1 class="fs-0 text-900">Gross revenue</h1>
                          <div class="d-flex">
                            <h4 class="text-primary mb-0">$165.50</h4>
                            <div class="ms-3"><span class="badge rounded-pill badge-subtle-primary"><span
                              class="fas fa-caret-up"></span> 5%</span></div>
                          </div>
                        </div>
                        <div class="col-auto">
                          <select class="form-select form-select-sm pe-4" id="select-gross-revenue-month">
                            <option value="0">Jan</option>
                            <option value="1">Feb</option>
                            <option value="2">Mar</option>
                            <option value="3">Apr</option>
                            <option value="4">May</option>
                            <option value="5">Jun</option>
                            <option value="6">Jul</option>
                            <option value="7">Aug</option>
                            <option value="8">Sep</option>
                            <option value="9">Oct</option>
                            <option value="10">Nov</option>
                            <option value="11">Dec</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div class="card-body pt-0 pb-3 h-100">
                      <div class="mx-nx1">
                        <table class="table table-borderless font-sans-serif fw-medium fs--1">
                          <tr>
                            <td class="pb-2 pt-0">Point of sale</td>
                            <td class="pb-2 pt-0 text-end" style="width: 20%">$791.64</td>
                            <td class="pb-2 pt-0 text-end text-700" style="max-width: 20%"><span
                              class="me-1 fas fa-long-arrow-alt-down text-danger"></span>13%
                            </td>
                          </tr>
                          <tr>
                            <td class="pb-2 pt-0">Online Store</td>
                            <td class="pb-2 pt-0 text-end" style="width: 20%">$113.86</td>
                            <td class="pb-2 pt-0 text-end text-700" style="max-width: 20%"><span
                              class="me-1 fas fa-long-arrow-alt-up text-success"></span>178%
                            </td>
                          </tr>
                          <tr>
                            <td class="pb-2 pt-0">Online Store</td>
                            <td class="pb-2 pt-0 text-end" style="width: 20%">$0.00</td>
                            <td class="pb-2 pt-0 text-end text-700" style="max-width: 20%"><span
                              class="me-1 false text-success"></span>-
                            </td>
                          </tr>
                        </table>
                        <!-- Find the JS file for the following calendar at: src/js/charts/echarts/gross-revenue.js-->
                        <!-- If you are not using gulp based workflow, you can find the transpiled code at: public/assets/js/theme.js-->
                        <div class="echart-gross-revenue-chart px-3 h-100" data-echart-responsive="true"
                             data-options='{"target":"gross-revenue-footer","monthSelect":"select-gross-revenue-month","optionOne":"currentMonth","optionTwo":"prevMonth"}'></div>
                      </div>
                    </div>
                    <div class="card-footer border-top py-2 d-flex flex-between-center">
                      <div class="d-flex" id="gross-revenue-footer">
                        <div class="btn btn-sm btn-text d-flex align-items-center p-0 shadow-none" id="currentMonth"
                             data-month="current"><span class="fas fa-circle text-primary fs--2 me-1"></span><span
                          class="text">Jan</span></div>
                        <div class="btn btn-sm btn-text d-flex align-items-center p-0 shadow-none ms-2" id="prevMonth"
                             data-month="prev"><span class="fas fa-circle text-300 fs--2 me-1"></span><span
                          class="text">Dec</span></div>
                      </div>
                      <a class="btn btn-link btn-sm px-0" href="#!">View report<span
                        class="fas fa-chevron-right ms-1 fs--2"></span></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col">
              <div class="row g-3">
                <div class="col-xxl-12">
                  <div class="card h-100 h-xxl-auto mt-xxl-3">
                    <div class="card-header d-flex flex-between-center bg-light py-2">
                      <h6 class="mb-0">Shared Files</h6><a class="py-1 fs--1 font-sans-serif" href="#!">View All</a>
                    </div>
                    <div class="card-body pb-0">
                      <div class="d-flex mb-3 hover-actions-trigger align-items-center">
                        <div class="file-thumbnail"><img class="border h-100 w-100 object-fit-cover rounded-2"
                                                         src="../assets/img/products/5-thumb.png" alt=""/>
                        </div>
                        <div class="ms-3 flex-shrink-1 flex-grow-1">
                          <h6 class="mb-1"><a class="stretched-link text-900 fw-semi-bold" href="#!">apple-smart-watch.png</a>
                          </h6>
                          <div class="fs--1"><span class="fw-semi-bold">Antony</span><span
                            class="fw-medium text-600 ms-2">Just Now</span></div>
                          <div class="hover-actions end-0 top-50 translate-middle-y"><a
                            class="btn btn-light border-300 btn-sm me-1 text-600" data-bs-toggle="tooltip"
                            data-bs-placement="top" title="Download" href="../assets/img/icons/cloud-download.svg"
                            download="download"><img src="../assets/img/icons/cloud-download.svg" alt=""
                                                     width="15"/></a>
                            <button class="btn btn-light border-300 btn-sm me-1 text-600 shadow-none" type="button"
                                    data-bs-toggle="tooltip" data-bs-placement="top" title="Edit"><img
                              src="../assets/img/icons/edit-alt.svg" alt="" width="15"/></button>
                          </div>
                        </div>
                      </div>
                      <hr class="text-200"/>
                      <div class="d-flex mb-3 hover-actions-trigger align-items-center">
                        <div class="file-thumbnail"><img class="border h-100 w-100 object-fit-cover rounded-2"
                                                         src="../assets/img/products/3-thumb.png" alt=""/>
                        </div>
                        <div class="ms-3 flex-shrink-1 flex-grow-1">
                          <h6 class="mb-1"><a class="stretched-link text-900 fw-semi-bold" href="#!">iphone.jpg</a></h6>
                          <div class="fs--1"><span class="fw-semi-bold">Antony</span><span
                            class="fw-medium text-600 ms-2">Yesterday at 1:30 PM</span></div>
                          <div class="hover-actions end-0 top-50 translate-middle-y"><a
                            class="btn btn-light border-300 btn-sm me-1 text-600" data-bs-toggle="tooltip"
                            data-bs-placement="top" title="Download" href="../assets/img/icons/cloud-download.svg"
                            download="download"><img src="../assets/img/icons/cloud-download.svg" alt=""
                                                     width="15"/></a>
                            <button class="btn btn-light border-300 btn-sm me-1 text-600 shadow-none" type="button"
                                    data-bs-toggle="tooltip" data-bs-placement="top" title="Edit"><img
                              src="../assets/img/icons/edit-alt.svg" alt="" width="15"/></button>
                          </div>
                        </div>
                      </div>
                      <hr class="text-200"/>
                      <div class="d-flex mb-3 hover-actions-trigger align-items-center">
                        <div class="file-thumbnail"><img class="img-fluid" src="../assets/img/icons/zip.png" alt=""/>
                        </div>
                        <div class="ms-3 flex-shrink-1 flex-grow-1">
                          <h6 class="mb-1"><a class="stretched-link text-900 fw-semi-bold" href="#!">Falcon v1.8.2</a>
                          </h6>
                          <div class="fs--1"><span class="fw-semi-bold">Jane</span><span
                            class="fw-medium text-600 ms-2">27 Sep at 10:30 AM</span></div>
                          <div class="hover-actions end-0 top-50 translate-middle-y"><a
                            class="btn btn-light border-300 btn-sm me-1 text-600" data-bs-toggle="tooltip"
                            data-bs-placement="top" title="Download" href="../assets/img/icons/cloud-download.svg"
                            download="download"><img src="../assets/img/icons/cloud-download.svg" alt=""
                                                     width="15"/></a>
                            <button class="btn btn-light border-300 btn-sm me-1 text-600 shadow-none" type="button"
                                    data-bs-toggle="tooltip" data-bs-placement="top" title="Edit"><img
                              src="../assets/img/icons/edit-alt.svg" alt="" width="15"/></button>
                          </div>
                        </div>
                      </div>
                      <hr class="text-200"/>
                      <div class="d-flex mb-3 hover-actions-trigger align-items-center">
                        <div class="file-thumbnail"><img class="border h-100 w-100 object-fit-cover rounded-2"
                                                         src="../assets/img/products/2-thumb.png" alt=""/>
                        </div>
                        <div class="ms-3 flex-shrink-1 flex-grow-1">
                          <h6 class="mb-1"><a class="stretched-link text-900 fw-semi-bold" href="#!">iMac.jpg</a></h6>
                          <div class="fs--1"><span class="fw-semi-bold">Rowen</span><span
                            class="fw-medium text-600 ms-2">23 Sep at 6:10 PM</span></div>
                          <div class="hover-actions end-0 top-50 translate-middle-y"><a
                            class="btn btn-light border-300 btn-sm me-1 text-600" data-bs-toggle="tooltip"
                            data-bs-placement="top" title="Download" href="../assets/img/icons/cloud-download.svg"
                            download="download"><img src="../assets/img/icons/cloud-download.svg" alt=""
                                                     width="15"/></a>
                            <button class="btn btn-light border-300 btn-sm me-1 text-600 shadow-none" type="button"
                                    data-bs-toggle="tooltip" data-bs-placement="top" title="Edit"><img
                              src="../assets/img/icons/edit-alt.svg" alt="" width="15"/></button>
                          </div>
                        </div>
                      </div>
                      <hr class="text-200"/>
                      <div class="d-flex mb-3 hover-actions-trigger align-items-center">
                        <div class="file-thumbnail"><img class="img-fluid" src="../assets/img/icons/docs.png" alt=""/>
                        </div>
                        <div class="ms-3 flex-shrink-1 flex-grow-1">
                          <h6 class="mb-1"><a class="stretched-link text-900 fw-semi-bold" href="#!">functions.php</a>
                          </h6>
                          <div class="fs--1"><span class="fw-semi-bold">John</span><span
                            class="fw-medium text-600 ms-2">1 Oct at 4:30 PM</span></div>
                          <div class="hover-actions end-0 top-50 translate-middle-y"><a
                            class="btn btn-light border-300 btn-sm me-1 text-600" data-bs-toggle="tooltip"
                            data-bs-placement="top" title="Download" href="../assets/img/icons/cloud-download.svg"
                            download="download"><img src="../assets/img/icons/cloud-download.svg" alt=""
                                                     width="15"/></a>
                            <button class="btn btn-light border-300 btn-sm me-1 text-600 shadow-none" type="button"
                                    data-bs-toggle="tooltip" data-bs-placement="top" title="Edit"><img
                              src="../assets/img/icons/edit-alt.svg" alt="" width="15"/></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md col-xxl-12">
                  <div class="card h-100 h-xxl-auto">
                    <div class="card-header bg-light d-flex flex-between-center py-2">
                      <h6 class="mb-0">Bandwidth Saved</h6>
                      <div class="dropdown font-sans-serif btn-reveal-trigger">
                        <button class="btn btn-link text-600 btn-sm dropdown-toggle dropdown-caret-none btn-reveal"
                                type="button" id="dropdown-bandwidth-saved" data-bs-toggle="dropdown"
                                data-boundary="viewport" aria-haspopup="true" aria-expanded="false"><span
                          class="fas fa-ellipsis-h fs--2"></span></button>
                        <div class="dropdown-menu dropdown-menu-end border py-2"
                             aria-labelledby="dropdown-bandwidth-saved"><a class="dropdown-item" href="#!">View</a><a
                          class="dropdown-item" href="#!">Export</a>
                          <div class="dropdown-divider"></div>
                          <a class="dropdown-item text-danger" href="#!">Remove</a>
                        </div>
                      </div>
                    </div>
                    <div class="card-body d-flex flex-center flex-column">
                      <!-- Find the JS file for the following chart at: src/js/charts/echarts/bandwidth-saved.js-->
                      <!-- If you are not using gulp based workflow, you can find the transpiled code at: public/assets/js/theme.js-->
                      <div class="echart-bandwidth-saved" data-echart-responsive="true"></div>
                      <div class="text-center mt-3">
                        <h6 class="fs-0 mb-1"><span class="fas fa-check text-success me-1"
                                                    data-fa-transform="shrink-2"></span>35.75 GB saved</h6>
                        <p class="fs--1 mb-0">38.44 GB total bandwidth</p>
                      </div>
                    </div>
                    <div class="card-footer bg-light py-2">
                      <div class="row flex-between-center">
                        <div class="col-auto">
                          <select class="form-select form-select-sm">
                            <option>Last 6 Months</option>
                            <option>Last Year</option>
                            <option>Last 2 Year</option>
                          </select>
                        </div>
                        <div class="col-auto"><a class="fs--1 font-sans-serif" href="#!">Help</a></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md col-xxl-12">
                  <div class="card">
                    <div class="card-body px-4 py-3 my-2">
                      <h4 class="text-800">More with Falcon</h4>
                      <h5 class="text-600 fs-0">Get <span class="text-primary fw-semi-bold">70% OFF </span>with Falcon+
                      </h5>
                      <div class="alert alert-success mt-3">
                        <h3 class="mb-0 text-800">$29<span class="fs-0 fw-medium font-sans-serif text-600">/month</span>
                        </h3>
                      </div>
                      <ul class="fa-ul ms-2 ps-x1 mb-2">
                        <li class="py-1">
                          <h6 class="text-700"><span class="fa-li text-success"><i class="fas fa-infinity"></i></span>Unlimited
                            downloads</h6>
                        </li>
                        <li class="py-1">
                          <h6 class="text-700"><span class="fa-li text-success"><i class="fas fa-check"></i></span>Commercial
                            use</h6>
                        </li>
                        <li class="py-1">
                          <h6 class="text-700"><span class="fa-li text-success"><i class="fas fa-check"></i></span>100%
                            moneyback guarantee</h6>
                        </li>
                        <li class="py-1">
                          <h6 class="text-700"><span class="fa-li text-success"><i class="fas fa-check"></i></span>Lifetime
                            free updates</h6>
                        </li>
                      </ul>
                      <button class="btn btn-success w-100"><span class="fas fa-crown me-2"></span>Upgrade to Falcon+
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="card overflow-hidden">
                <div class="card-header d-flex flex-between-center bg-light py-2">
                  <h6 class="mb-0">Transaction Summary</h6>
                  <div class="dropdown font-sans-serif btn-reveal-trigger">
                    <button class="btn btn-link text-600 btn-sm dropdown-toggle dropdown-caret-none btn-reveal"
                            type="button" id="dropdown-transaction-summary" data-bs-toggle="dropdown"
                            data-boundary="viewport" aria-haspopup="true" aria-expanded="false"><span
                      class="fas fa-ellipsis-h fs--2"></span></button>
                    <div class="dropdown-menu dropdown-menu-end border py-2"
                         aria-labelledby="dropdown-transaction-summary"><a class="dropdown-item" href="#!">View</a><a
                      class="dropdown-item" href="#!">Export</a>
                      <div class="dropdown-divider"></div>
                      <a class="dropdown-item text-danger" href="#!">Remove</a>
                    </div>
                  </div>
                </div>
                <div class="card-body py-0">
                  <div class="table-responsive scrollbar">
                    <table class="table table-dashboard mb-0 fs--1">
                      <tr>
                        <td class="align-middle ps-0 text-nowrap">
                          <div class="d-flex position-relative align-items-center"><img
                            class="d-flex align-self-center me-2" src="../assets/img/logos/atlassian.png" alt=""
                            width="30"/>
                            <div class="flex-1"><a class="stretched-link" href="#!">
                              <h6 class="mb-0">Atlassian</h6>
                            </a>
                              <p class="mb-0">Subscription payment</p>
                            </div>
                          </div>
                        </td>
                        <td class="align-middle px-4" style="width:1%;"><span
                          class="badge fs--1 w-100 badge-subtle-success">Completed</span></td>
                        <td class="align-middle px-4 text-end text-nowrap" style="width:1%;">
                          <h6 class="mb-0">$290.00 USD</h6>
                          <p class="fs--2 mb-0">15 May, 2020</p>
                        </td>
                        <td class="align-middle ps-4 pe-1" style="width: 130px; min-width: 130px;">
                          <select class="form-select form-select-sm px-2 bg-transparent">
                            <option>Action</option>
                            <option>Archive</option>
                            <option>Delete</option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <td class="align-middle ps-0 text-nowrap">
                          <div class="d-flex position-relative align-items-center"><img
                            class="d-flex align-self-center me-2" src="../assets/img/logos/hubstaff.png" alt=""
                            width="30"/>
                            <div class="flex-1"><a class="stretched-link" href="#!">
                              <h6 class="mb-0">Hubstaff</h6>
                            </a>
                              <p class="mb-0">Subscription payment</p>
                            </div>
                          </div>
                        </td>
                        <td class="align-middle px-4" style="width:1%;"><span
                          class="badge fs--1 w-100 badge-subtle-warning">Pending</span></td>
                        <td class="align-middle px-4 text-end text-nowrap" style="width:1%;">
                          <h6 class="mb-0">$200.00 USD</h6>
                          <p class="fs--2 mb-0">1 May, 2020</p>
                        </td>
                        <td class="align-middle ps-4 pe-1" style="width: 130px; min-width: 130px;">
                          <select class="form-select form-select-sm px-2 bg-transparent">
                            <option>Action</option>
                            <option>Archive</option>
                            <option>Delete</option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <td class="align-middle ps-0 text-nowrap">
                          <div class="d-flex position-relative align-items-center"><img
                            class="d-flex align-self-center me-2" src="../assets/img/logos/bs-5.png" alt="" width="30"/>
                            <div class="flex-1"><a class="stretched-link" href="#!">
                              <h6 class="mb-0">Bootstrap</h6>
                            </a>
                              <p class="mb-0">Subscription payment</p>
                            </div>
                          </div>
                        </td>
                        <td class="align-middle px-4" style="width:1%;"><span
                          class="badge fs--1 w-100 badge-subtle-warning">Pending</span></td>
                        <td class="align-middle px-4 text-end text-nowrap" style="width:1%;">
                          <h6 class="mb-0">$300.00 USD</h6>
                          <p class="fs--2 mb-0">26 April, 2020</p>
                        </td>
                        <td class="align-middle ps-4 pe-1" style="width: 130px; min-width: 130px;">
                          <select class="form-select form-select-sm px-2 bg-transparent">
                            <option>Action</option>
                            <option>Archive</option>
                            <option>Delete</option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <td class="align-middle ps-0 text-nowrap">
                          <div class="d-flex position-relative align-items-center"><img
                            class="d-flex align-self-center me-2" src="../assets/img/logos/asana-logo.png" alt=""
                            width="30"/>
                            <div class="flex-1"><a class="stretched-link" href="#!">
                              <h6 class="mb-0">Asana</h6>
                            </a>
                              <p class="mb-0">Subscription payment</p>
                            </div>
                          </div>
                        </td>
                        <td class="align-middle px-4" style="width:1%;"><span
                          class="badge fs--1 w-100 badge-subtle-warning">Pending</span></td>
                        <td class="align-middle px-4 text-end text-nowrap" style="width:1%;">
                          <h6 class="mb-0">$320.00 USD</h6>
                          <p class="fs--2 mb-0">14 April, 2020</p>
                        </td>
                        <td class="align-middle ps-4 pe-1" style="width: 130px; min-width: 130px;">
                          <select class="form-select form-select-sm px-2 bg-transparent">
                            <option>Action</option>
                            <option>Archive</option>
                            <option>Delete</option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <td class="align-middle ps-0 text-nowrap">
                          <div class="d-flex position-relative align-items-center"><img
                            class="d-flex align-self-center me-2" src="../assets/img/logos/adobe-creative-cloud.png"
                            alt="" width="30"/>
                            <div class="flex-1"><a class="stretched-link" href="#!">
                              <h6 class="mb-0">Adobe Creative Cloud</h6>
                            </a>
                              <p class="mb-0">Subscription payment</p>
                            </div>
                          </div>
                        </td>
                        <td class="align-middle px-4" style="width:1%;"><span
                          class="badge fs--1 w-100 badge-subtle-warning">Pending</span></td>
                        <td class="align-middle px-4 text-end text-nowrap" style="width:1%;">
                          <h6 class="mb-0">$150.00 USD</h6>
                          <p class="fs--2 mb-0">11 April, 2020</p>
                        </td>
                        <td class="align-middle ps-4 pe-1" style="width: 130px; min-width: 130px;">
                          <select class="form-select form-select-sm px-2 bg-transparent">
                            <option>Action</option>
                            <option>Archive</option>
                            <option>Delete</option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <td class="align-middle ps-0 text-nowrap">
                          <div class="d-flex position-relative align-items-center"><img
                            class="d-flex align-self-center me-2" src="../assets/img/logos/coursera.png" alt=""
                            width="30"/>
                            <div class="flex-1"><a class="stretched-link" href="#!">
                              <h6 class="mb-0">Coursera</h6>
                            </a>
                              <p class="mb-0">Subscription payment</p>
                            </div>
                          </div>
                        </td>
                        <td class="align-middle px-4" style="width:1%;"><span
                          class="badge fs--1 w-100 badge-subtle-warning">Pending</span></td>
                        <td class="align-middle px-4 text-end text-nowrap" style="width:1%;">
                          <h6 class="mb-0">$280.00 USD</h6>
                          <p class="fs--2 mb-0">26 March, 2020</p>
                        </td>
                        <td class="align-middle ps-4 pe-1" style="width: 130px; min-width: 130px;">
                          <select class="form-select form-select-sm px-2 bg-transparent">
                            <option>Action</option>
                            <option>Archive</option>
                            <option>Delete</option>
                          </select>
                        </td>
                      </tr>
                      <tr class="border-0">
                        <td class="align-middle ps-0 text-nowrap border-0">
                          <div class="d-flex position-relative align-items-center"><img
                            class="d-flex align-self-center me-2" src="../assets/img/logos/medium.png" alt=""
                            width="30"/>
                            <div class="flex-1"><a class="stretched-link" href="#!">
                              <h6 class="mb-0">Medium</h6>
                            </a>
                              <p class="mb-0">Subscription payment</p>
                            </div>
                          </div>
                        </td>
                        <td class="align-middle px-4 border-0" style="width:1%;"><span
                          class="badge fs--1 w-100 badge-subtle-danger">Rejected</span></td>
                        <td class="align-middle px-4 text-end text-nowrap border-0" style="width:1%;">
                          <h6 class="mb-0">$290.00 USD</h6>
                          <p class="fs--2 mb-0">15 March, 2020</p>
                        </td>
                        <td class="align-middle ps-4 pe-1 border-0" style="width: 130px; min-width: 130px;">
                          <select class="form-select form-select-sm px-2 bg-transparent">
                            <option>Action</option>
                            <option>Archive</option>
                            <option>Delete</option>
                          </select>
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
                <div class="card-footer bg-light py-2">
                  <div class="row flex-between-center">
                    <div class="col-auto">
                      <select class="form-select form-select-sm">
                        <option>Last 7 days</option>
                        <option>Last Month</option>
                        <option>Last Year</option>
                      </select>
                    </div>
                    <div class="col-auto"><a class="btn btn-link btn-sm px-0 fw-medium" href="#!">View All<span
                      class="fas fa-chevron-right ms-1 fs--2"></span></a></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <footer class="footer">
            <div class="row g-0 justify-content-between fs--1 mt-4 mb-3">
              <div class="col-12 col-sm-auto text-center">
                <p class="mb-0 text-600">Thank you for creating with Falcon <span
                  class="d-none d-sm-inline-block">| </span><br class="d-sm-none"/> 2023 &copy; <a
                  href="https://themewagon.com">Themewagon</a></p>
              </div>
              <div class="col-12 col-sm-auto text-center">
                <p class="mb-0 text-600">v3.16.0</p>
              </div>
            </div>
          </footer>
        </div>
        <div class="modal fade" id="authentication-modal" tabindex="-1" role="dialog"
             aria-labelledby="authentication-modal-label" aria-hidden="true">
          <div class="modal-dialog mt-6" role="document">
            <div class="modal-content border-0">
              <div class="modal-header px-5 position-relative modal-shape-header bg-shape">
                <div class="position-relative z-1" data-bs-theme="light">
                  <h4 class="mb-0 text-white" id="authentication-modal-label">Register</h4>
                  <p class="fs--1 mb-0 text-white">Please create your free Falcon account</p>
                </div>
                <button class="btn-close btn-close-white position-absolute top-0 end-0 mt-2 me-2"
                        data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body py-4 px-5">
                <form>
                  <div class="mb-3">
                    <label class="form-label" for="modal-auth-name">Name</label>
                    <input class="form-control" type="text" autocomplete="on" id="modal-auth-name"/>
                  </div>
                  <div class="mb-3">
                    <label class="form-label" for="modal-auth-email">Email address</label>
                    <input class="form-control" type="email" autocomplete="on" id="modal-auth-email"/>
                  </div>
                  <div class="row gx-2">
                    <div class="mb-3 col-sm-6">
                      <label class="form-label" for="modal-auth-password">Password</label>
                      <input class="form-control" type="password" autocomplete="on" id="modal-auth-password"/>
                    </div>
                    <div class="mb-3 col-sm-6">
                      <label class="form-label" for="modal-auth-confirm-password">Confirm Password</label>
                      <input class="form-control" type="password" autocomplete="on" id="modal-auth-confirm-password"/>
                    </div>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="modal-auth-register-checkbox"/>
                    <label class="form-label" for="modal-auth-register-checkbox">I accept the <a href="#!">terms </a>and
                      <a href="#!">privacy policy</a></label>
                  </div>
                  <div class="mb-3">
                    <button class="btn btn-primary d-block w-100 mt-3" type="submit" name="submit">Register</button>
                  </div>
                </form>
                <div class="position-relative mt-5">
                  <hr/>
                  <div class="divider-content-center">or register with</div>
                </div>
                <div class="row g-2 mt-2">
                  <div class="col-sm-6"><a class="btn btn-outline-google-plus btn-sm d-block w-100" href="#"><span
                    class="fab fa-google-plus-g me-2" data-fa-transform="grow-8"></span> google</a></div>
                  <div class="col-sm-6"><a class="btn btn-outline-facebook btn-sm d-block w-100" href="#"><span
                    class="fab fa-facebook-square me-2" data-fa-transform="grow-8"></span> facebook</a></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <!-- ===============================================-->
    <!--    End of Main Content-->
    <!-- ===============================================-->


    <div class="offcanvas offcanvas-end settings-panel border-0" id="settings-offcanvas" tabindex="-1"
         aria-labelledby="settings-offcanvas">
      <div class="offcanvas-header settings-panel-header bg-shape">
        <div class="z-1 py-1" data-bs-theme="light">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <h5 class="text-white mb-0 me-2"><span class="fas fa-palette me-2 fs-0"></span>Settings</h5>
            <button class="btn btn-primary btn-sm rounded-pill mt-0 mb-0" data-theme-control="reset"
                    style="font-size:12px"><span class="fas fa-redo-alt me-1" data-fa-transform="shrink-3"></span>Reset
            </button>
          </div>
          <p class="mb-0 fs--1 text-white opacity-75"> Set your own customized style</p>
        </div>
        <button class="btn-close btn-close-white z-1 mt-0" type="button" data-bs-dismiss="offcanvas"
                aria-label="Close"></button>
      </div>
      <div class="offcanvas-body scrollbar-overlay px-x1 h-100" id="themeController">
        <h5 class="fs-0">Color Scheme</h5>
        <p class="fs--1">Choose the perfect color mode for your app.</p>
        <div class="btn-group d-block w-100 btn-group-navbar-style">
          <div class="row gx-2">
            <div class="col-6">
              <input class="btn-check" id="themeSwitcherLight" name="theme-color" type="radio" value="light"
                     data-theme-control="theme"/>
              <label class="btn d-inline-block btn-navbar-style fs--1" for="themeSwitcherLight"> <span
                class="hover-overlay mb-2 rounded d-block"><img class="img-fluid img-prototype mb-0"
                                                                src="../assets/img/generic/falcon-mode-default.jpg"
                                                                alt=""/></span><span
                class="label-text">Light</span></label>
            </div>
            <div class="col-6">
              <input class="btn-check" id="themeSwitcherDark" name="theme-color" type="radio" value="dark"
                     data-theme-control="theme"/>
              <label class="btn d-inline-block btn-navbar-style fs--1" for="themeSwitcherDark"> <span
                class="hover-overlay mb-2 rounded d-block"><img class="img-fluid img-prototype mb-0"
                                                                src="../assets/img/generic/falcon-mode-dark.jpg"
                                                                alt=""/></span><span
                class="label-text"> Dark</span></label>
            </div>
          </div>
        </div>
        <hr/>
        <div class="d-flex justify-content-between">
          <div class="d-flex align-items-start"><img class="me-2" src="../assets/img/icons/left-arrow-from-left.svg"
                                                     width="20" alt=""/>
            <div class="flex-1">
              <h5 class="fs-0">RTL Mode</h5>
              <p class="fs--1 mb-0">Switch your language direction </p><a class="fs--1"
                                                                          href="../documentation/customization/configuration.html">RTL
              Documentation</a>
            </div>
          </div>
          <div class="form-check form-switch">
            <input class="form-check-input ms-0" id="mode-rtl" type="checkbox" data-theme-control="isRTL"/>
          </div>
        </div>
        <hr/>
        <div class="d-flex justify-content-between">
          <div class="d-flex align-items-start"><img class="me-2" src="../assets/img/icons/arrows-h.svg" width="20"
                                                     alt=""/>
            <div class="flex-1">
              <h5 class="fs-0">Fluid Layout</h5>
              <p class="fs--1 mb-0">Toggle container layout system </p><a class="fs--1"
                                                                          href="../documentation/customization/configuration.html">Fluid
              Documentation</a>
            </div>
          </div>
          <div class="form-check form-switch">
            <input class="form-check-input ms-0" id="mode-fluid" type="checkbox" data-theme-control="isFluid"/>
          </div>
        </div>
        <hr/>
        <div class="d-flex align-items-start"><img class="me-2" src="../assets/img/icons/paragraph.svg" width="20"
                                                   alt=""/>
          <div class="flex-1">
            <h5 class="fs-0 d-flex align-items-center">Navigation Position</h5>
            <p class="fs--1 mb-2">Select a suitable navigation system for your web application </p>
            <div>
              <select class="form-select form-select-sm" aria-label="Navbar position"
                      data-theme-control="navbarPosition">
                <option value="vertical" data-page-url="../modules/components/navs-and-tabs/vertical-navbar.html">
                  Vertical
                </option>
                <option value="top" data-page-url="../modules/components/navs-and-tabs/top-navbar.html">Top</option>
                <option value="combo" data-page-url="../modules/components/navs-and-tabs/combo-navbar.html">Combo
                </option>
                <option value="double-top" data-page-url="../modules/components/navs-and-tabs/double-top-navbar.html">
                  Double Top
                </option>
              </select>
            </div>
          </div>
        </div>
        <hr/>
        <h5 class="fs-0 d-flex align-items-center">Vertical Navbar Style</h5>
        <p class="fs--1 mb-0">Switch between styles for your vertical navbar </p>
        <p><a class="fs--1" href="../modules/components/navs-and-tabs/vertical-navbar.html#navbar-styles">See
          Documentation</a></p>
        <div class="btn-group d-block w-100 btn-group-navbar-style">
          <div class="row gx-2">
            <div class="col-6">
              <input class="btn-check" id="navbar-style-transparent" type="radio" name="navbarStyle" value="transparent"
                     data-theme-control="navbarStyle"/>
              <label class="btn d-block w-100 btn-navbar-style fs--1" for="navbar-style-transparent"> <img
                class="img-fluid img-prototype" src="../assets/img/generic/default.png" alt=""/><span
                class="label-text"> Transparent</span></label>
            </div>
            <div class="col-6">
              <input class="btn-check" id="navbar-style-inverted" type="radio" name="navbarStyle" value="inverted"
                     data-theme-control="navbarStyle"/>
              <label class="btn d-block w-100 btn-navbar-style fs--1" for="navbar-style-inverted"> <img
                class="img-fluid img-prototype" src="../assets/img/generic/inverted.png" alt=""/><span
                class="label-text"> Inverted</span></label>
            </div>
            <div class="col-6">
              <input class="btn-check" id="navbar-style-card" type="radio" name="navbarStyle" value="card"
                     data-theme-control="navbarStyle"/>
              <label class="btn d-block w-100 btn-navbar-style fs--1" for="navbar-style-card"> <img
                class="img-fluid img-prototype" src="../assets/img/generic/card.png" alt=""/><span class="label-text"> Card</span></label>
            </div>
            <div class="col-6">
              <input class="btn-check" id="navbar-style-vibrant" type="radio" name="navbarStyle" value="vibrant"
                     data-theme-control="navbarStyle"/>
              <label class="btn d-block w-100 btn-navbar-style fs--1" for="navbar-style-vibrant"> <img
                class="img-fluid img-prototype" src="../assets/img/generic/vibrant.png" alt=""/><span
                class="label-text"> Vibrant</span></label>
            </div>
          </div>
        </div>
        <div class="text-center mt-5"><img class="mb-4" src="../assets/img/icons/spot-illustrations/47.png" alt=""
                                           width="120"/>
          <h5>Like What You See?</h5>
          <p class="fs--1">Get Falcon now and create beautiful dashboards with hundreds of widgets.</p><a
            class="mb-3 btn btn-primary"
            href="https://themes.getbootstrap.com/product/falcon-admin-dashboard-webapp-template/" target="_blank">Purchase</a>
        </div>
      </div>
    </div>
    <a class="card setting-toggle" href="#settings-offcanvas" data-bs-toggle="offcanvas">
      <div class="card-body d-flex align-items-center py-md-2 px-2 py-1">
        <div class="bg-primary-subtle position-relative rounded-start" style="height:34px;width:28px">
          <div class="settings-popover"><span class="ripple"><span
            class="fa-spin position-absolute all-0 d-flex flex-center"><span
            class="icon-spin position-absolute all-0 d-flex flex-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M19.7369 12.3941L19.1989 12.1065C18.4459 11.7041 18.0843 10.8487 18.0843 9.99495C18.0843 9.14118 18.4459 8.28582 19.1989 7.88336L19.7369 7.59581C19.9474 7.47484 20.0316 7.23291 19.9474 7.03131C19.4842 5.57973 18.6843 4.28943 17.6738 3.20075C17.5053 3.03946 17.2527 2.99914 17.0422 3.12011L16.393 3.46714C15.6883 3.84379 14.8377 3.74529 14.1476 3.3427C14.0988 3.31422 14.0496 3.28621 14.0002 3.25868C13.2568 2.84453 12.7055 2.10629 12.7055 1.25525V0.70081C12.7055 0.499202 12.5371 0.297594 12.2845 0.257272C10.7266 -0.105622 9.16879 -0.0653007 7.69516 0.257272C7.44254 0.297594 7.31623 0.499202 7.31623 0.70081V1.23474C7.31623 2.09575 6.74999 2.8362 5.99824 3.25599C5.95774 3.27861 5.91747 3.30159 5.87744 3.32493C5.15643 3.74527 4.26453 3.85902 3.53534 3.45302L2.93743 3.12011C2.72691 2.99914 2.47429 3.03946 2.30587 3.20075C1.29538 4.28943 0.495411 5.57973 0.0322686 7.03131C-0.051939 7.23291 0.0322686 7.47484 0.242788 7.59581L0.784376 7.8853C1.54166 8.29007 1.92694 9.13627 1.92694 9.99495C1.92694 10.8536 1.54166 11.6998 0.784375 12.1046L0.242788 12.3941C0.0322686 12.515 -0.051939 12.757 0.0322686 12.9586C0.495411 14.4102 1.29538 15.7005 2.30587 16.7891C2.47429 16.9504 2.72691 16.9907 2.93743 16.8698L3.58669 16.5227C4.29133 16.1461 5.14131 16.2457 5.8331 16.6455C5.88713 16.6767 5.94159 16.7074 5.99648 16.7375C6.75162 17.1511 7.31623 17.8941 7.31623 18.7552V19.2891C7.31623 19.4425 7.41373 19.5959 7.55309 19.696C7.64066 19.7589 7.74815 19.7843 7.85406 19.8046C9.35884 20.0925 10.8609 20.0456 12.2845 19.7729C12.5371 19.6923 12.7055 19.4907 12.7055 19.2891V18.7346C12.7055 17.8836 13.2568 17.1454 14.0002 16.7312C14.0496 16.7037 14.0988 16.6757 14.1476 16.6472C14.8377 16.2446 15.6883 16.1461 16.393 16.5227L17.0422 16.8698C17.2527 16.9907 17.5053 16.9504 17.6738 16.7891C18.7264 15.7005 19.4842 14.4102 19.9895 12.9586C20.0316 12.757 19.9474 12.515 19.7369 12.3941ZM10.0109 13.2005C8.1162 13.2005 6.64257 11.7893 6.64257 9.97478C6.64257 8.20063 8.1162 6.74905 10.0109 6.74905C11.8634 6.74905 13.3792 8.20063 13.3792 9.97478C13.3792 11.7893 11.8634 13.2005 10.0109 13.2005Z"
                      fill="#2A7BE4"></path>
                  </svg></span></span></span></div>
        </div>
        <small
          class="text-uppercase text-primary fw-bold bg-primary-subtle py-2 pe-2 ps-1 rounded-end">customize</small>
      </div>
    </a>
  `,
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {

  public readonly config: any = {
    isNavbarVerticalCollapsed: false,
    theme: 'light',
    isRTL: false,
    isFluid: false,
    navbarStyle: 'card',
    navbarPosition: 'vertical'
  };

  public ngAfterViewInit(): void {

    Object.keys(this.config).forEach((key) => {
      if (localStorage.getItem(key) === null) {
        localStorage.setItem(key, this.config[key]);
      }
    })

    if (JSON.parse(localStorage.getItem('isNavbarVerticalCollapsed') ?? '')) {
      document.documentElement.classList.add('navbar-vertical-collapsed');
    }

    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
    }

    const navbarStyle = localStorage.getItem("navbarStyle");
    if (navbarStyle && navbarStyle !== 'transparent') {
      const navbar = document.querySelector('.navbar-vertical');
      console.log(navbar);
      if (navbar) {
        navbar.classList.add(`navbar-${navbarStyle}`);
      }
    }

    const hasTopNavOnly = true;

    if (hasTopNavOnly) {

      const navbarPosition = localStorage.getItem('navbarPosition');
      const navbarTop = document.querySelector('[data-layout] .navbar-top:not([data-double-top-nav');
      const navbarDoubleTop = document.querySelector('[data-double-top-nav]');

      if (localStorage.getItem('navbarPosition') === 'double-top') {
        document.documentElement.classList.toggle('double-top-nav-layout');
      }

      if (navbarPosition === 'double-top') {
        if (navbarDoubleTop) {
          navbarDoubleTop.removeAttribute('style');
        }
        if (navbarTop) {
          navbarTop.remove(); // argument: navbarTop
        }
      } else {
        if (navbarTop) {
          navbarTop.removeAttribute('style');
        }
        if (navbarDoubleTop) {
          navbarDoubleTop.remove(); // argument: navbarDoubleTop
        }
      }
    } else {

      const navbarPosition = localStorage.getItem('navbarPosition');
      const navbarVertical = document.querySelector('.navbar-vertical');
      const navbarTopVertical = document.querySelector('.content .navbar-top');
      const navbarTop = document.querySelector('[data-layout] .navbar-top:not([data-double-top-nav');
      const navbarDoubleTop = document.querySelector('[data-double-top-nav]');
      const navbarTopCombo = document.querySelector('.content [data-navbar-top="combo"]');

      if (localStorage.getItem('navbarPosition') === 'double-top') {
        document.documentElement.classList.toggle('double-top-nav-layout');
      }

      if (navbarPosition === 'top') {
        if (navbarTop) {
          navbarTop.removeAttribute('style');
        }
        if (navbarTopVertical) {
          navbarTopVertical.remove(); // argument: navbarTopVertical
        }
        if (navbarVertical) {
          navbarVertical.remove(); // argument: navbarVertical
        }
        if (navbarTopCombo) {
          navbarTopCombo.remove(); // argument: navbarTopCombo
        }
        if (navbarDoubleTop) {
          navbarDoubleTop.remove(); // argument: navbarDoubleTop
        }
      } else if (navbarPosition === 'combo') {
        if (navbarVertical) {
          navbarVertical.removeAttribute('style');
        }
        if (navbarTopCombo) {
          navbarTopCombo.removeAttribute('style');
        }
        if (navbarTop) {
          navbarTop.remove(); // argument: navbarTop
        }
        if (navbarTopVertical) {
          navbarTopVertical.remove(); // argument: navbarTopVertical
        }
        if (navbarDoubleTop) {
          navbarDoubleTop.remove(); // argument: navbarDoubleTop
        }
      } else if (navbarPosition === 'double-top') {
        if (navbarDoubleTop) {
          navbarDoubleTop.removeAttribute('style');
        }
        if (navbarTopVertical) {
          navbarTopVertical.remove(); // argument: navbarTopVertical
        }
        if (navbarVertical) {
          navbarVertical.remove(); // argument: navbarVertical
        }
        if (navbarTop) {
          navbarTop.remove(); // argument: navbarTop
        }
        if (navbarTopCombo) {
          navbarTopCombo.remove(); // argument: navbarTopCombo
        }
      } else {
        if (navbarVertical) {
          navbarVertical.removeAttribute('style');
        }
        if (navbarTopVertical) {
          navbarTopVertical.removeAttribute('style');
        }
        if (navbarTop) {
          navbarTop.remove(); // argument: navbarTop
        }
        if (navbarDoubleTop) {
          navbarDoubleTop.remove(); // argument: navbarDoubleTop
        }
        if (navbarTopCombo) {
          navbarTopCombo.remove(); // argument: navbarTopCombo
        }
      }

    }

    const isFluid = JSON.parse(localStorage.getItem('isFluid') ?? '');
    if (isFluid) {
      const container = document.querySelector('[data-layout]');
      if (container) {
        container.classList.remove('container');
        container.classList.add('container-fluid');
      }
    }


    const isRTL = JSON.parse(localStorage.getItem('isRTL') ?? '');
    if (isRTL) {
      const linkDefault = document.getElementById('style-default');
      const userLinkDefault = document.getElementById('user-style-default');
      if (linkDefault) {
        linkDefault.setAttribute('disabled', 'true');
      }
      if (userLinkDefault) {
        userLinkDefault.setAttribute('disabled', 'true');
      }
      document.querySelector('html')?.setAttribute('dir', 'rtl');
    } else {
      const linkRTL = document.getElementById('style-rtl');
      const userLinkRTL = document.getElementById('user-style-rtl');
      linkRTL?.setAttribute('disabled', 'true');
      userLinkRTL?.setAttribute('disabled', 'true');
    }

    navbarDarkenOnScroll();
    handleNavbarVerticalCollapsed();


  }

}

/* -------------------------------------------------------------------------- */
/*                                    Utils                                   */
/* -------------------------------------------------------------------------- */
const docReady = (fn: any) => {
  // see if DOM is already available
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn);
  } else {
    setTimeout(fn, 1);
  }
};

const resize = (fn: any) => window.addEventListener("resize", fn);

const isIterableArray = (array: []) => Array.isArray(array) && !!array.length;

const camelize = (str: string) => {
  const text = str.replace(/[-_\s.]+(.)?/g, (_, c) =>
    c ? c.toUpperCase() : ""
  );
  return `${text.substr(0, 1).toLowerCase()}${text.substr(1)}`;
};

const getData = (el: HTMLElement, data: any) => {
  try {
    return JSON.parse(el.dataset[camelize(data)] ?? '');
  } catch (e) {
    return el.dataset[camelize(data)];
  }
};

/* ----------------------------- Colors function ---------------------------- */

const hexToRgb = (hexValue: any) => {
  let hex;
  hexValue.indexOf("#") === 0
    ? (hex = hexValue.substring(1))
    : (hex = hexValue);
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
    hex.replace(shorthandRegex, (m: any, r: any, g: any, b: any) => r + r + g + g + b + b)
  );
  return result
    ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16),
    ]
    : null;
};

const rgbaColor = (color = "#fff", alpha = 0.5) =>
  `rgba(${hexToRgb(color)}, ${alpha})`;

/* --------------------------------- Colors --------------------------------- */

const getColor = (name: string, dom = document.documentElement) =>
  getComputedStyle(dom).getPropertyValue(`--falcon-${name}`).trim();

const getColors = (dom: any) => ({
  primary: getColor("primary", dom),
  secondary: getColor("secondary", dom),
  success: getColor("success", dom),
  info: getColor("info", dom),
  warning: getColor("warning", dom),
  danger: getColor("danger", dom),
  light: getColor("light", dom),
  dark: getColor("dark", dom),
});

const getSubtleColors = (dom: any) => ({
  primary: getColor("primary-bg-subtle", dom),
  secondary: getColor("secondary-bg-subtle", dom),
  success: getColor("success-bg-subtle", dom),
  info: getColor("info-bg-subtle", dom),
  warning: getColor("warning-bg-subtle", dom),
  danger: getColor("danger-bg-subtle", dom),
  light: getColor("light-bg-subtle", dom),
  dark: getColor("dark-bg-subtle", dom),
});

const getGrays = (dom: any) => ({
  white: getColor("gray-white", dom),
  100: getColor("gray-100", dom),
  200: getColor("gray-200", dom),
  300: getColor("gray-300", dom),
  400: getColor("gray-400", dom),
  500: getColor("gray-500", dom),
  600: getColor("gray-600", dom),
  700: getColor("gray-700", dom),
  800: getColor("gray-800", dom),
  900: getColor("gray-900", dom),
  1000: getColor("gray-1000", dom),
  1100: getColor("gray-1100", dom),
  black: getColor("gray-black", dom),
});

const hasClass = (el: HTMLElement, className: string) => {
  !el && false;
  return el.classList.value.includes(className);
};

const addClass = (el: HTMLElement, className: string) => {
  el.classList.add(className);
};

const removeClass = (el: HTMLElement, className: string) => {
  el.classList.remove(className);
};

const getOffset = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect();
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return {top: rect.top + scrollTop, left: rect.left + scrollLeft};
};

function isScrolledIntoView(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  const vertInView = rect.top <= windowHeight && rect.top + rect.height >= 0;
  const horInView = rect.left <= windowWidth && rect.left + rect.width >= 0;

  return vertInView && horInView;
}

const breakpoints: any = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1540,
};

const getBreakpoint = (el: HTMLElement) => {
  const classes: any = el && el.classList.value;
  let breakpoint;
  if (classes) {
    breakpoint =
      breakpoints[
        classes
          .split(" ")
          .filter((cls: string) => cls.includes("navbar-expand-"))
          .pop()
          .split("-")
          .pop()
        ];
  }
  return breakpoint;
};

/* --------------------------------- Cookie --------------------------------- */

const setCookie = (name: string, value: string, expire: number) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + expire);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()}`;
};

const getCookie = (name: string) => {
  const keyValue = document.cookie.match(`(^|;) ?${name}=([^;]*)(;|$)`);
  return keyValue ? keyValue[2] : keyValue;
};

const settings = {
  tinymce: {
    theme: "oxide",
  },
  chart: {
    borderColor: "rgba(255, 255, 255, 0.8)",
  },
};

/* -------------------------- Chart Initialization -------------------------- */

// const newChart = (chart, config) => {
//   const ctx = chart.getContext("2d");
//   return new window.Chart(ctx, config);
// };

/* ---------------------------------- Store --------------------------------- */

const getItemFromStore = (key: string, defaultValue?: any, store = localStorage) => {
  try {
    return JSON.parse(store.getItem(key) ?? '') || defaultValue;
  } catch {
    return store.getItem(key) || defaultValue;
  }
};

const setItemToStore = (key: string, payload: any, store = localStorage) =>
  store.setItem(key, payload);
const getStoreSpace = (store = localStorage) =>
  parseFloat(
    (
      escape(encodeURIComponent(JSON.stringify(store))).length /
      (1024 * 1024)
    ).toFixed(2)
  );

/* get Dates between */

const getDates = (startDate: any, endDate: any, interval = 1000 * 60 * 60 * 24) => {
  const duration = endDate - startDate;
  const steps = duration / interval;
  return Array.from(
    {length: steps + 1},
    (v, i) => new Date(startDate.valueOf() + interval * i)
  );
};

const getPastDates = (duration: any) => {
  let days;

  switch (duration) {
    case "week":
      days = 7;
      break;
    case "month":
      days = 30;
      break;
    case "year":
      days = 365;
      break;

    default:
      days = duration;
  }

  const date = new Date();
  const endDate = date;
  const startDate = new Date(new Date().setDate(date.getDate() - (days - 1)));
  return getDates(startDate, endDate);
};

/* Get Random Number */
const getRandomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min) + min);

const utils = {
  docReady,
  breakpoints,
  resize,
  isIterableArray,
  camelize,
  getData,
  hasClass,
  addClass,
  hexToRgb,
  rgbaColor,
  getColor,
  getColors,
  getSubtleColors,
  getGrays,
  getOffset,
  isScrolledIntoView,
  getBreakpoint,
  setCookie,
  getCookie,
  // newChart,
  settings,
  getItemFromStore,
  setItemToStore,
  getStoreSpace,
  getDates,
  getPastDates,
  getRandomNumber,
  removeClass,
};


const navbarDarkenOnScroll = () => {
  const Selector = {
    NAVBAR: '[data-navbar-darken-on-scroll]',
    NAVBAR_COLLAPSE: '.navbar-collapse',
    NAVBAR_TOGGLER: '.navbar-toggler',
  };

  const ClassNames = {
    COLLAPSED: 'collapsed',
  };

  const Events = {
    SCROLL: 'scroll',
    SHOW_BS_COLLAPSE: 'show.bs.collapse',
    HIDE_BS_COLLAPSE: 'hide.bs.collapse',
    HIDDEN_BS_COLLAPSE: 'hidden.bs.collapse',
  };

  const DataKey = {
    NAVBAR_DARKEN_ON_SCROLL: 'navbar-darken-on-scroll',
  };

  const navbar: HTMLElement = document.querySelector(Selector.NAVBAR) as any;
  console.log(navbar);

  function removeNavbarBgClass() {
    navbar.classList.remove('bg-dark');
    navbar.classList.remove('bg-100');
  }

  const toggleThemeClass = (theme: string) => {
    if (theme === 'dark') {
      navbar.classList.remove('navbar-dark');
      navbar.classList.add('navbar-light');
    } else {
      navbar.classList.remove('navbar-light');
      navbar.classList.add('navbar-dark');
    }
  };

  function getBgClassName(name: string, defaultColorName: string) {
    const parent = document.documentElement;
    const allColors: any = {
      ...utils.getColors(parent),
      ...utils.getGrays(parent),
    };

    const colorName: any = Object.keys(allColors).includes(name)
      ? name
      : defaultColorName;
    const color = allColors[colorName];
    const bgClassName = `bg-${colorName}`;
    return {color, bgClassName};
  }

  if (navbar) {
    const theme = localStorage.getItem('theme');
    let defaultColorName: any = theme === 'dark' ? '100' : 'dark';
    const name = utils.getData(navbar, DataKey.NAVBAR_DARKEN_ON_SCROLL);

    toggleThemeClass(theme as string);

    document.body?.addEventListener(
      'clickControl',
      (event) => {
        console.log(event);
        const {detail: {control, value}} = event as any;
        if (control === 'theme') {
          toggleThemeClass(value);
          defaultColorName = value === 'dark' ? '100' : 'dark';
          if (
            navbar.classList.contains('bg-dark') ||
            navbar.classList.contains('bg-100')
          ) {
            removeNavbarBgClass();
            navbar.classList.add(
              getBgClassName(name, defaultColorName).bgClassName
            );
          }
        }
      }
    );

    const windowHeight = window.innerHeight;
    const html = document.documentElement;
    const navbarCollapse = navbar.querySelector(Selector.NAVBAR_COLLAPSE);
    console.log(navbarCollapse);
    const colorRgb = utils.hexToRgb(
      getBgClassName(name, defaultColorName).color
    );
    const {backgroundImage} = window.getComputedStyle(navbar);
    const transition = 'background-color 0.35s ease';

    navbar.style.backgroundImage = 'none';
    // Change navbar background color on scroll
    window.addEventListener(Events.SCROLL, () => {
      const {scrollTop} = html;
      let alpha = (scrollTop / windowHeight) * 2;
      alpha >= 1 && (alpha = 1);
      navbar.style.backgroundColor = `rgba(${colorRgb?.[0] ?? ''}, ${colorRgb?.[1]}, ${colorRgb?.[2]}, ${alpha})`;
      navbar.style.backgroundImage =
        alpha > 0 || utils.hasClass(navbarCollapse as HTMLElement, 'show')
          ? backgroundImage
          : 'none';
    });

    // Toggle bg class on window resize
    utils.resize(() => {
      const breakPoint = utils.getBreakpoint(navbar);
      if (window.innerWidth > breakPoint) {
        removeNavbarBgClass();
        navbar.style.backgroundImage = html.scrollTop
          ? backgroundImage
          : 'none';
        navbar.style.transition = 'none';
      } else if (
        utils.hasClass(
          navbar.querySelector(Selector.NAVBAR_TOGGLER) as HTMLElement,
          ClassNames.COLLAPSED
        )
      ) {
        removeNavbarBgClass();
        navbar.style.backgroundImage = backgroundImage;
      }

      if (window.innerWidth <= breakPoint) {
        navbar.style.transition = utils.hasClass(navbarCollapse as HTMLElement, 'show')
          ? transition
          : 'none';
      }
    });

    navbarCollapse?.addEventListener(Events.SHOW_BS_COLLAPSE, () => {
      navbar.classList.add(getBgClassName(name, defaultColorName).bgClassName);
      navbar.style.backgroundImage = backgroundImage;
      navbar.style.transition = transition;
    });

    navbarCollapse?.addEventListener(Events.HIDE_BS_COLLAPSE, () => {
      removeNavbarBgClass();
      !html.scrollTop && (navbar.style.backgroundImage = 'none');
    });

    navbarCollapse?.addEventListener(Events.HIDDEN_BS_COLLAPSE, () => {
      navbar.style.transition = 'none';
    });
  }
}


const handleNavbarVerticalCollapsed = () => {
  const Selector = {
    HTML: 'html',
    NAVBAR_VERTICAL_TOGGLE: '.navbar-vertical-toggle',
    NAVBAR_VERTICAL_COLLAPSE: '.navbar-vertical .navbar-collapse',
    ECHART_RESPONSIVE: '[data-echart-responsive]',
  };

  const Events = {
    CLICK: 'click',
    MOUSE_OVER: 'mouseover',
    MOUSE_LEAVE: 'mouseleave',
    NAVBAR_VERTICAL_TOGGLE: 'navbar.vertical.toggle',
  };
  const ClassNames = {
    NAVBAR_VERTICAL_COLLAPSED: 'navbar-vertical-collapsed',
    NAVBAR_VERTICAL_COLLAPSED_HOVER: 'navbar-vertical-collapsed-hover',
  };
  const navbarVerticalToggle = document.querySelector(
    Selector.NAVBAR_VERTICAL_TOGGLE
  );
  const html = document.querySelector(Selector.HTML);
  const navbarVerticalCollapse = document.querySelector(
    Selector.NAVBAR_VERTICAL_COLLAPSE
  );

  if (navbarVerticalToggle) {
    navbarVerticalToggle.addEventListener(Events.CLICK, (e) => {
      (navbarVerticalToggle as any).blur();
      html?.classList.toggle(ClassNames.NAVBAR_VERTICAL_COLLAPSED);

      // Set collapse state on localStorage
      const isNavbarVerticalCollapsed = utils.getItemFromStore(
        'isNavbarVerticalCollapsed'
      );
      utils.setItemToStore(
        'isNavbarVerticalCollapsed',
        !isNavbarVerticalCollapsed
      );

      const event = new CustomEvent(Events.NAVBAR_VERTICAL_TOGGLE);
      e?.currentTarget?.dispatchEvent(event);
    });
  }
  if (navbarVerticalCollapse) {
    navbarVerticalCollapse.addEventListener(Events.MOUSE_OVER, () => {
      if (utils.hasClass(html as HTMLElement, ClassNames.NAVBAR_VERTICAL_COLLAPSED)) {
        html?.classList.add(ClassNames.NAVBAR_VERTICAL_COLLAPSED_HOVER);
      }
    });
    navbarVerticalCollapse.addEventListener(Events.MOUSE_LEAVE, () => {
      if (utils.hasClass(html as HTMLElement, ClassNames.NAVBAR_VERTICAL_COLLAPSED_HOVER)) {
        html?.classList.remove(ClassNames.NAVBAR_VERTICAL_COLLAPSED_HOVER);
      }
    });
  }
};
