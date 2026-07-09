import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <div class="star-field"></div>
    <app-navbar />
    <main>
      <router-outlet />
    </main>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: linear-gradient(135deg, #0d0221 0%, #1a0533 50%, #0d0221 100%);
    }

    main {
      position: relative;
      z-index: 1;
    }
  `]
})
export class AppComponent {
  title = 'Mystic Tarot';
}
