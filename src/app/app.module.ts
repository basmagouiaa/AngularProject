import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from '../services/auth-interceptor.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './components/register/register.component';
import { HomePageComponent } from './components/clients/home-page/home-page.component';
import { HeaderComponent } from './components/clients/header/header.component';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './components/clients/footer/footer.component';
import { TablesComponent } from './components/dashboard/tables/tables.component';
import { CategoryComponent } from './components/dashboard/category/category.component';
import { FoodComponent } from './components/dashboard/food/food.component';
import { ReservationComponent } from './components/dashboard/reservation/reservation.component';
import { OrderComponent } from './components/dashboard/order/order.component';

import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { CreateTableComponent } from './components/create-table/create-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    RegisterComponent,
    HomePageComponent,
    HeaderComponent,
    FooterComponent,
    TablesComponent,
    CategoryComponent,
    FoodComponent,
    ReservationComponent,
    OrderComponent,
    ConfirmDialogComponent,
    CreateTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatPseudoCheckboxModule,
    MatInputModule,

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
