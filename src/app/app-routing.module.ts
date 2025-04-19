import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AppComponent } from './app.component';
import { TablesComponent } from './components/dashboard/tables/tables.component';
import { CategoryComponent } from './components/dashboard/category/category.component';
import { FoodComponent } from './components/dashboard/food/food.component';
import { OrderComponent } from './components/dashboard/order/order.component';
import { AdminGuard } from 'src/services/admin-guard.service';
import { ListReservationComponent } from './components/dashboard/list-reservation/list-reservation.component';
import { HomeComponent } from './components/clients/pages/home/home.component';
import { MenuComponent } from './components/clients/pages/menu/menu.component';
import { CartComponent } from './components/clients/cart/cart.component';
import { MenuPackComponent } from './components/clients/menu-pack/menu-pack.component';
import { TableReservationComponent } from './components/clients/table-reservation/table-reservation.component';
import { MyReservationsComponent } from './components/clients/my-reservations/my-reservations.component';
import { UserOrdersComponent } from './components/clients/user-orders/user-orders.component';
import { OrderDetailsComponent } from './components/clients/order-details/order-details.component';
import { DashComponent } from './components/dashboard/dash/dash.component';
import { authGuard } from 'src/services/auth-guard.service';

const routes: Routes = [
  { path: 'login', component: LoginComponent,pathMatch: 'full' },
  { path: 'register', component: RegisterComponent,pathMatch: 'full'},
  { path: 'menu', component: MenuPackComponent,pathMatch: 'full', },
  { path: 'reservation', component: TableReservationComponent,pathMatch: 'full' },
  { path: 'mes-reservation', component: MyReservationsComponent,pathMatch: 'full' },
  { path: 'orders', component: UserOrdersComponent, pathMatch: 'full'},
  { path: 'orders/:id', component: OrderDetailsComponent,pathMatch: 'full'},
  { path: 'cart', component: CartComponent,pathMatch: 'full', },
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent , 
    children: [
      { path: '', component: DashComponent },
      { path: 'tables', component: TablesComponent,pathMatch: 'full' },
      { path: 'category', component: CategoryComponent },
      { path: 'food', component: FoodComponent },
      { path: 'reservations', component: ListReservationComponent },
      { path: 'order', component: OrderComponent }
    ]
  },
  {
    path:'**' , redirectTo: 'login', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
