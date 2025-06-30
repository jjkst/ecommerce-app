import { Routes } from '@angular/router';
import { ProductsListComponent } from './products-list/products-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { ScheduleManagerComponent } from './schedule-manager/schedule-manager.component';
import { LoginComponent } from './login/login.component';
import { ServiceManagerComponent } from './service-manager/service-manager.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';


export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'login', component: LoginComponent },
    { path: 'admin/manage-services', component: ServiceManagerComponent },
    { path: 'products/:id', component: ProductDetailComponent },
    { path: 'cart', component: ShoppingCartComponent },
    { path: 'schedule', component: ScheduleManagerComponent }

  ];