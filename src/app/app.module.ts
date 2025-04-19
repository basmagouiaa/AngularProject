import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from '../services/auth-interceptor.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './components/register/register.component';
import { HeaderComponent } from './components/clients/header/header.component';
import { RouterModule } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FooterComponent } from './components/clients/footer/footer.component';
import { TablesComponent } from './components/dashboard/tables/tables.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CategoryComponent } from './components/dashboard/category/category.component';
import { FoodComponent } from './components/dashboard/food/food.component';
import { OrderComponent } from './components/dashboard/order/order.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { CreateTableComponent } from './components/create-table/create-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatError, MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { CategorieDialogDataComponent } from './components/dashboard/category/categorie-dialog-data/categorie-dialog-data.component';
import { CreateEditFoodComponent } from './components/dashboard/create-edit-food/create-edit-food.component';
import { FilePondModule, registerPlugin } from 'ngx-filepond';
// import { MatCarousel, MatCarouselComponent, MatCarouselModule } from '@ngmodule/material-carousel';

// Plugins FilePond
import * as FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import * as FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import { ListReservationComponent } from './components/dashboard/list-reservation/list-reservation.component';
import { ChooseUsComponent } from './components/clients/header/choose-us/choose-us.component';
import { HeroSliderComponent } from './components/clients/header/hero-slider/hero-slider.component';
import { PopularMenuComponent } from './components/clients/header/popular-menu/popular-menu.component';
import { CartComponent } from './components/clients/cart/cart.component';
import { MenuPackComponent } from './components/clients/menu-pack/menu-pack.component';
import { ProductCardComponent } from './components/clients/product-card/product-card.component';
import { TestimonialsComponent } from './components/clients/testimonials/testimonials.component';
import { TableReservationComponent } from './components/clients/table-reservation/table-reservation.component';
import { HomeComponent } from './components/clients/pages/home/home.component';
import { MenuComponent } from './components/clients/pages/menu/menu.component';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MyReservationsComponent } from './components/clients/my-reservations/my-reservations.component';
import { UserOrdersComponent } from './components/clients/user-orders/user-orders.component';
import { OrderDetailsComponent } from './components/clients/order-details/order-details.component';
import { DashComponent } from './components/dashboard/dash/dash.component';
// import { SlickCarouselModule } from 'ngx-slick-carousel';


// Enregistre les plugins
registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    RegisterComponent,
    HeaderComponent,
    FooterComponent,
    TablesComponent,
    CategoryComponent,
    FoodComponent,
    OrderComponent,
    ConfirmDialogComponent,
    CreateTableComponent,
    CategorieDialogDataComponent,
    CreateEditFoodComponent,
    ListReservationComponent,
    ChooseUsComponent,
    HeroSliderComponent,
    PopularMenuComponent,
    CartComponent,
    HeaderComponent,
    MenuPackComponent,
    ProductCardComponent,
    TestimonialsComponent,
    TableReservationComponent,
    HomeComponent,
    MenuComponent,
    MyReservationsComponent,
    UserOrdersComponent,
    OrderDetailsComponent,
    DashComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
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
    FilePondModule,
    MatTooltipModule,
    MatSnackBarModule,
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatBadgeModule,
    MatMenuModule,
    NgChartsModule


  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
