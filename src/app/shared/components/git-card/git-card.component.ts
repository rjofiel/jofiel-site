import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GitInfo } from '@app/core/git-model';
import { TuiIslandModule } from '@taiga-ui/kit';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-git-card',
  standalone: true,
  imports: [CommonModule, TuiIslandModule],
  templateUrl: './git-card.component.html',
  styleUrls: ['./git-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GitCardComponent {
  @Input() isLoaded$: Observable<boolean> | undefined
  @Input() info!: GitInfo | undefined;
}
