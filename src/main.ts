import { FormsModule } from '@angular/forms';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage-angular';
import { MaskitoModule } from '@maskito/angular';


export function createTranslate(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}


if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    importProvidersFrom(IonicModule.forRoot({
      backButtonText: '',
    }), FormsModule),
    importProvidersFrom(HttpClientModule,MaskitoModule),
    importProvidersFrom(IonicStorageModule.forRoot()),
     importProvidersFrom(TranslateModule.forRoot(
      {
        loader:{
          provide: TranslateLoader,
          useFactory: createTranslate,
          deps: [HttpClient]
        }

      }
    )),
    provideRouter(routes),
  ],
});
