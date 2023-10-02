import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-important-tips',
  templateUrl: './important-tips.page.html',
  styleUrls: ['./important-tips.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ImportantTipsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
