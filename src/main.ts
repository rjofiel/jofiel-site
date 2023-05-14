import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { viewRoutes } from '@app/routes';
import { TUI_SANITIZER, TuiAlertModule, TuiDialogModule, TuiRootModule } from '@taiga-ui/core';
import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import { importProvidersFrom } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom([BrowserModule, BrowserAnimationsModule, TuiRootModule, TuiDialogModule, TuiAlertModule]),
    { provide: TUI_SANITIZER, useClass: NgDompurifySanitizer },
    provideRouter(viewRoutes)
  ]
}).catch(err => console.error(err));
