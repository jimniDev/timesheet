import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRouteSnapshot, NavigationEnd, NavigationError } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Account, AccountService, StateStorageService, LoginService } from 'app/core';

@Component({
  selector: 'jhi-main',
  templateUrl: './main.component.html'
})
export class JhiMainComponent implements OnInit, OnDestroy {
  _cleanup: Subject<any> = new Subject<any>();

  constructor(
    private accountService: AccountService,
    private stateStorageService: StateStorageService,
    private loginService: LoginService,
    private router: Router
  ) {}

  private getPageTitle(routeSnapshot: ActivatedRouteSnapshot) {
    let title: string = routeSnapshot.data && routeSnapshot.data['pageTitle'] ? routeSnapshot.data['pageTitle'] : 'timesheetApp';
    if (routeSnapshot.firstChild) {
      title = this.getPageTitle(routeSnapshot.firstChild) || title;
    }
    return title;
  }

  login() {
    this.loginService.login();
  }
  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // this.jhiLanguageHelper.updateTitle(this.getPageTitle(this.router.routerState.snapshot.root));
      }
      if (event instanceof NavigationError && event.error.status === 404) {
        this.router.navigate(['/404']);
      }
    });
    this.subscribeToLoginEvents();
  }

  ngOnDestroy() {
    this._cleanup.next();
    this._cleanup.complete();
  }

  private subscribeToLoginEvents() {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this._cleanup))
      .subscribe((account: Account) => {
        if (account) {
          this.navigateToStoredUrl();
        }
      });
  }

  private navigateToStoredUrl() {
    const previousUrl = this.stateStorageService.getUrl();
    if (previousUrl) {
      this.stateStorageService.storeUrl(null);
      this.router.navigateByUrl(previousUrl);
    }
  }

  isAuthenticated() {
    return this.accountService.isAuthenticated();
  }
}
