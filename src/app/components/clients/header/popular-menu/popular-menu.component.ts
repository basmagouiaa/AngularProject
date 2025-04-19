import { Component } from '@angular/core';

@Component({
  selector: 'app-popular-menu',
  templateUrl: './popular-menu.component.html',
  styleUrls: ['./popular-menu.component.css']
})
export class PopularMenuComponent {
  popularMenuFood = [
    {
      id: "01",
      title: "Vegetable Salad",
      price: 25,
      imgUrl: "https://res.cloudinary.com/dwlggaakr/image/upload/v1744588006/images/chicken3_f5utwb.png",
    },
    {
      id: "02",
      title: "Chicken",
      price: 250,
      imgUrl: "https://res.cloudinary.com/dwlggaakr/image/upload/v1744587995/images/chicken4_zsfyto.png",
    },
    {
      id: "03",
      title: "Whipped Cream",
      price: 45,
      imgUrl: "https://res.cloudinary.com/dwlggaakr/image/upload/v1744588004/images/dessert02_pq4rsy.png",
    },
    {
      id: "04",
      title: "Pizza",
      price: 75,
      imgUrl: "https://res.cloudinary.com/dwlggaakr/image/upload/v1744588013/images/pizza1_hhjtdi.png",
    },
  ];
}
