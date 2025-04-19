import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  footerQuickLinks = [
    { display: 'Terms & Conditions', url: '#' },
    { display: 'Privacy Policy', url: '#' },
    { display: 'Return & Refund', url: '#' },
    { display: 'Payment Method', url: '#' }
  ];

  footerLinks = [
    { display: 'About Us', url: '#' },
    { display: 'Menu', url: '#' },
    { display: 'Recipes', url: '#' },
    { display: 'Contact', url: '#' }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
