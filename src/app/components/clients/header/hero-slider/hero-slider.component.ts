import { Component } from '@angular/core';

@Component({
  selector: 'app-hero-slider',
  templateUrl: './hero-slider.component.html',
  styleUrls: ['./hero-slider.component.css']
})
export class HeroSliderComponent {
  sliderData = [
    {
      id: '01',
      title: 'We have simple and delicious food for you',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit...',
      imgUrl: 'https://res.cloudinary.com/dwlggaakr/image/upload/v1744588032/images/slider1_g3kxuk.png',
    },
    {
      id: '02',
      title: 'We believe good food over great smile',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit...',
      imgUrl: 'https://res.cloudinary.com/dwlggaakr/image/upload/v1744588029/images/slider2_h949oa.png',
    },
    {
      id: '03',
      title: 'Meet, Eat and Enjoy the true test',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit...',
      imgUrl: 'https://res.cloudinary.com/dwlggaakr/image/upload/v1744588027/images/slider03_zwldng.png',
    }
  ];

  currentSlide = 0;

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.sliderData.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.sliderData.length) % this.sliderData.length;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }
}