import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NavigationComponent } from './navigation/navigation.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent, FooterComponent],
  template: `
    <app-navigation></app-navigation>
    <router-outlet></router-outlet>
    <app-footer></app-footer>
  `
})
export class AppComponent { }