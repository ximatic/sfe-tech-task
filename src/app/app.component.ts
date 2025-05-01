import { DOCUMENT } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { Subscription } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AuthFacadeService } from './core/facades/auth-facade.service';
import { UsersFacadeService } from './core/facades/users-facade.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    // Angular imports
    RouterOutlet,
    // 3rd party imports
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class AppComponent implements OnDestroy {
  // di
  private router: Router = inject(Router);
  private document = inject(DOCUMENT);
  authFacade: AuthFacadeService = inject(AuthFacadeService);
  userFacade: UsersFacadeService = inject(UsersFacadeService);

  // other
  private subscription = new Subscription();

  // lifecycle methods

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // navigation methods

  toggleTheme(): void {
    this.document.body.classList.toggle('light-theme');
  }

  logout(): void {
    this.subscription.add(
      this.authFacade.logout().subscribe(() => {
        this.userFacade.clear();
        this.router.navigate(['/auth']);
      })
    );
  }
}
