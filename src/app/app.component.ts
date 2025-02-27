import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Restaurant';
  readonly user = JSON.parse(localStorage.getItem('user') || '{}');
  ngOnInit(): void {
    console.log(this.user);
  }
}
