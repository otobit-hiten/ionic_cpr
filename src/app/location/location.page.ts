import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GoogleMap } from '@capacitor/google-maps';

@Component({

  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  imports: [IonicModule, CommonModule, FormsModule]
})
export class LocationPage implements OnInit {
  @ViewChild('map')mapRef!:ElementRef;
  newMap!: GoogleMap;



  ionViewDidEnter(){
    this.createMap()
  }

  async createMap() {
    this.newMap = await GoogleMap.create({
      id: 'my-cool-map',
      element: this.mapRef.nativeElement,
      apiKey: 'AIzaSyCz_7nUaWof9wvkUG-1x7SnecvG5eLx95Y',
      config: {
        center: {
          lat: 33.6,
          lng: -117.9,
        },
        zoom: 8,
      },
    });
  }
  constructor() {
  }

   ngOnInit() {
   }

  
}
