import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-thank',
  templateUrl: './thank.page.html',
  styleUrls: ['./thank.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class ThankPage implements OnInit {
   timeoutId : ReturnType<typeof setTimeout> 
    countdown = 5;
    timer = 0
    constructor( private router: Router) { 
      setInterval(() => {
        this.countdown = --this.countdown <= 0 ? 5 : this.countdown;
      
        this.timer = this.countdown;
      }, 1000);
    this.timeoutId = setTimeout(() => {
    this.router.navigateByUrl('', { replaceUrl: true })
    }, 5000);

    
  }
  

  ngOnInit() {

  }


  gotoDashboard(){
    clearTimeout(this.timeoutId)
    this.router.navigateByUrl('', { replaceUrl: true })
  }

}
