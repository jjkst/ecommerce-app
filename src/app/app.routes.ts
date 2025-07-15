import { Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { ScheduleManagerComponent } from './schedule-manager/schedule-manager.component';
import { ServiceManagerComponent } from './service-manager/service-manager.component';
import { AvailabilityManagerComponent } from './availability-manager/availability-manager.component';
import { LoginComponent } from './login/login.component';


export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'services', component: ProductListComponent},
    { path: 'about', component: AboutComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'login', component: LoginComponent },
    { path: 'admin', component: ServiceManagerComponent },
    { path: 'admin/manage-services', component: ServiceManagerComponent },
    { path: 'admin/manage-availability', component: AvailabilityManagerComponent },
    { path: 'products/:id', component: ProductDetailComponent },
    { path: 'cart', component: ShoppingCartComponent },
    { path: 'schedule', component: ScheduleManagerComponent }

  ];