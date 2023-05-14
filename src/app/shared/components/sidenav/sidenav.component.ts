import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiIslandModule } from '@taiga-ui/kit';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, TuiIslandModule],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidenavComponent {}
