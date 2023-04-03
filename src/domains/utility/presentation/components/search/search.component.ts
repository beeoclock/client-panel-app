import {Component, ViewEncapsulation} from "@angular/core";

@Component({
  selector: 'utility-search-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="search-box" data-list='{"valueNames":["title"]}'>
      <form class="position-relative" data-bs-display="static" data-bs-toggle="search">
        <input aria-label="Search" class="form-control search-input fuzzy-search" placeholder="Search..."
               type="search"/>
        <span class="fas fa-search search-box-icon"></span>

      </form>
      <div class="btn-close-falcon-container position-absolute end-0 top-50 translate-middle shadow-none"
           data-bs-dismiss="search">
        <button aria-label="Close" class="btn btn-link btn-close-falcon p-0"></button>
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
          <h6 class="dropdown-header fw-medium text-uppercase px-x1 fs--2 pt-0 pb-2">Files</h6>
          <a class="dropdown-item px-x1 py-2" href="#!">
            <div class="d-flex align-items-center">
              <div class="file-thumbnail me-2"><img alt="" class="img-fluid"
                                                    src="assets/img/icons/zip.png"/></div>
              <div class="flex-1">
                <h6 class="mb-0 title">Bee O\`clock v1.8.2</h6>
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
              <img alt="" class="rounded-circle" src="/assets/img/logo.png"/>

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
                <img alt="" class="rounded-circle" src="/assets/img/logo.png"/>

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
                <img alt="" class="rounded-circle" src="/assets/img/logo.png"/>

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
  `
})
export class SearchComponent {

}
