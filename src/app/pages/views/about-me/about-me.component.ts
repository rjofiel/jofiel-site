import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiIslandModule } from '@taiga-ui/kit';

@Component({
  selector: 'app-about-me',
  standalone: true,
  templateUrl: './about-me.component.html',
  imports: [TuiIslandModule],
  styleUrls: ['./about-me.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutMeComponent {}
