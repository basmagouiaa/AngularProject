import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from 'src/services/auth-guard.service';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AppComponent } from './app.component';
import { HomePageComponent } from './components/clients/home-page/home-page.component';
import { TablesComponent } from './components/dashboard/tables/tables.component';
import { CategoryComponent } from './components/dashboard/category/category.component';
import { FoodComponent } from './components/dashboard/food/food.component';
import { ReservationComponent } from './components/dashboard/reservation/reservation.component';
import { OrderComponent } from './components/dashboard/order/order.component';
import { AdminGuard } from 'src/services/admin-guard.service';

const routes: Routes = [
  { path: 'login', component: LoginComponent,pathMatch: 'full' , canActivate: [AuthGuard]},
  { path: 'register', component: RegisterComponent,pathMatch: 'full',  canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard,AdminGuard] ,
    children: [
      // { path: '', component: TablesComponent },
      { path: 'tables', component: TablesComponent,pathMatch: 'full' },
      { path: 'category', component: CategoryComponent },
      { path: 'food', component: FoodComponent },
      { path: 'reservation', component: ReservationComponent },
      { path: 'order', component: OrderComponent }
    ]
  },
  { path: '', component: HomePageComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
