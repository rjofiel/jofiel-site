import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiRootModule, TUI_SANITIZER } from '@taiga-ui/core';
import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import { CommonModule } from '@angular/common';
import { PageViewComponent } from '@pages/container';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, PageViewComponent, TuiRootModule, HttpClientModule],
  providers: [{ provide: TUI_SANITIZER, useClass: NgDompurifySanitizer }],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {}
