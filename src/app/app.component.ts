import { LanguageService } from './services/language.service';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { register } from 'swiper/element/bundle';


register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule],
})
export class AppComponent {
  constructor(private languageService: LanguageService) { }
  async ngOnInit() {
    this.languageService.initialLanguage();
  }
}
