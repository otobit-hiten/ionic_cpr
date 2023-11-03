import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { GoogleMap } from '@capacitor/google-maps';
import { ActivatedRoute, NavigationExtras, ParamMap, Router, RouterModule } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { LatLng, Marker } from '@capacitor/google-maps/dist/typings/definitions';
import { animate } from '@angular/animations';
import { Locations } from '../services/user';
import { map } from 'rxjs';

@Component({

  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  imports: [IonicModule, CommonModule, FormsModule,RouterModule]
})
export class LocationPage implements OnInit {

  @ViewChild('map')
  mapRef!:ElementRef <HTMLElement>;
  newMap!: GoogleMap;
  marker :any;
  cordinates: LatLng = {lat: 0, lng: 0}
  drag:boolean = false;
  from_map: string = ''
  int_number: number = -1
  current:LatLng =  {lat: 0, lng: 0}

  constructor(private route : ActivatedRoute, private ngZone: NgZone, private changeRef: ChangeDetectorRef,private router: Router, private navCtrl: NavController) {

  }

   async ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.from_map = params.get('map')!
      if(this.from_map === 'towCompanyOther'){
        this.int_number = +params.get('id1')!
      }
      console.log('Hello',this.from_map)
      console.log('Hello',this.int_number)

   });

    const permissionStatus = await Geolocation.checkPermissions();
    console.log('Permission status: ', permissionStatus.location);
    if(permissionStatus?.location != 'granted') {
      await Geolocation.requestPermissions();
    }
   }

   openSettings(app = false){
    console.log('open settings...');
   }

  ionViewDidEnter(){
    this.currentPosition()
    
  }
   currentPosition = async () => {
    const coordinates = await Geolocation.getCurrentPosition();
    console.log('Current position:', coordinates);
    this.cordinates = {lat : coordinates.coords.latitude, lng : coordinates.coords.longitude}
    this.current = {lat : coordinates.coords.latitude, lng : coordinates.coords.longitude}
    console.log('Current position:', this.cordinates);
    this.createMap()
  };

  async createMap() {
    this.newMap = await GoogleMap.create({
      id: 'my-cool-map',
      element: this.mapRef?.nativeElement,
      apiKey: 'AIzaSyCz_7nUaWof9wvkUG-1x7SnecvG5eLx95Y',
      config: {
        center: this.cordinates,
        zoom: 15,
      },
    });

    await this.newMap.addMarker({
      coordinate: this.cordinates,
      draggable : true,
    });

    await this.newMap.setCamera({
      coordinate: this.cordinates,
      animate:true
    });



     await this.newMap.setOnMarkerDragListener((event) => {
      this.drag = true;
         this.cordinates = {lat: event.latitude, lng: event.longitude}
        console.log('click',this.cordinates);
        this.changeRef.detectChanges();
        this.newMap.setCamera({
          coordinate: this.cordinates,
          animate:true
        });
    });

    await this.newMap.setOnMapClickListener((event) => {
      // console.log('click',event);
      // this.cordinates = {lat : event.latitude, lng : event.longitude};
      // this.newMap.addMarker({
      //   coordinate: this.cordinates,
      //   draggable : true,
      // });
    })

  }



   async ngOnDestroy(){
    await this.newMap.destroy();
   }

   async getLocation(){
    console.log("Geo",this.cordinates)
    let location: Locations = {lat:this.cordinates.lat, lng:this.cordinates.lng};
    this.router.navigate(['/tabs/dashboard/form'],{
      queryParams:{lat:location.lat, lng:location.lng, map: this.from_map, int:this.int_number},
    })
    await this.newMap.destroy();
   }
   async navigate(){
    console.log("Nav",this.cordinates)
    this.router.navigate(['/tabs/dashboard/form'],{
      queryParams:{lat:this.current.lat, lng:this.current.lng,  map: this.from_map, int:this.int_number},
    })
    await this.newMap.destroy();
   }
}


