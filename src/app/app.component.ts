import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapComponentComponent } from './map-component/map-component.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MapComponentComponent, HttpClientModule,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-prognoza';
}