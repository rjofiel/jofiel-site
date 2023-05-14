import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToolbarComponent } from '@app/pages/components';

@Component({
  standalone: true,
  selector: 'app-page-view',
  templateUrl: './page-view.component.html',
  styleUrls: ['./page-view.component.scss'],
  imports: [RouterOutlet, ToolbarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageViewComponent {}
