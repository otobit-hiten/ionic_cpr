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

  constructor( private router: Router) { }

  ngOnInit() {
  }

  gotoDashboard(){
    this.router.navigateByUrl('', { replaceUrl: true })
  }

}
