import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import * as  Parse from 'parse';
import { Swiper } from 'swiper'

@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonicModule, CommonModule, FormsModule]
})
export class FormPage implements OnInit {

  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;
  swiper?: Swiper


  ionViewDidEnter() {
    console.log("a = ", this.swiperRef);
 }
  constructor() {
    console.log(this.swiperRef?.nativeElement.swiper);
    console.log(this.swiperRef);
    Parse.initialize('4fJYYN0bBUsmOumrcXWZolpXm0OCBId8S0lKr45l', 'RRTqRi9mWSC3Udfu6RQglRK3MDx7N1hjSOQs0RPj');
    (Parse as any).serverURL = "https://parseapi.back4app.com/";

  }
  step :number[]=[1,2,3,4,5];
  steps = {
    email: "hitenchandora21@gmail.com",
    name: "",
    location: "",
    injured: [
      {
        name: "",
        images: [
          {
            url: "",
            name: "image1"
          },
          {
            url: "",
            name: "image1"
          }
        ]
      }
    ],
    witness: [
      {
        name: "",
        images: []
      }
    ],
    policeOfficer: {
      name: "",
      reportNumber: ""
    },
    audio: [
      {
        base64: "",
        name: ""
      }
    ],
    images: [
      {
        url: "http://res.cloudinary.com/dbdfrtxli/image/upload/v1695960777/qn0gqv0sagb15ndzppa1.jpg",
        name: "image1"
      },
      {
        url: "http://res.cloudinary.com/dbdfrtxli/image/upload/v1695960777/apzx7udrexbdi35atkit.jpg",
        name: "image2"
      }
    ]
  }
  ngOnInit() {
    
  }

  async call() {
    try {
      console.log("Calling...")
      var Parse = require('parse');
      const query = await Parse.Cloud.run('result',this.steps)
      console.log(query)
    } catch (error) {
      console.log(error);
    }
  }


  swiperReady() {
    this.swiper = this.swiperRef?.nativeElement.swiper;
    console.log("rready")
  }

  goNext() {
    console.log('changed: ');
    this.swiper?.slideNext(500);
  }

  goPrev() {
    console.log('changed: ');
    this.swiper?.slidePrev(500);
  }

  swiperSlideChanged(e: any) {
    console.log('changed: ', e);
  }
   
}
