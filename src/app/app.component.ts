import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Bienvenido a mi app de angular';
  curso: string = 'Spring y angular';
  profesor: string = 'Andres whatever';
}
