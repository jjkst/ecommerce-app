import { Routes } from '@angular/router';
import { ProductsListComponent } from './products-list/products-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { ScheduleManagerComponent } from './schedule-manager/schedule-manager.component';
import { LoginComponent } from './login/login.component';
import { ServiceManagerComponent } from './service-manager/service-manager.component';


export const routes: Routes = [
    { path: '', component: ProductsListComponent },
    { path: 'login', component: LoginComponent },
    { path: 'admin/manage-services', component: ServiceManagerComponent },
    { path: 'products/:id', component: ProductDetailComponent },
    { path: 'cart', component: ShoppingCartComponent },
    { path: 'schedule', component: ScheduleManagerComponent }

  ];