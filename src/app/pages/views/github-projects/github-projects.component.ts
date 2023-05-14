import { AsyncPipe, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GitFacade } from '@app/core/git.facade';
import { GitService } from '@app/core/git.service';
import { GitState } from '@app/core/git.state';
import { GitCardComponent } from '@app/shared/components/git-card/git-card.component';

@Component({
  selector: 'app-github-proyects',
  standalone: true,
  imports: [GitCardComponent, NgFor, AsyncPipe],
  providers: [GitFacade, GitService, GitState],
  templateUrl: './github-projects.component.html',
  styleUrls: ['./github-projects.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GithubProjectsComponent implements OnInit {
  repositories$ = this._gitFacade.repositories$;

  constructor(private _gitFacade: GitFacade) {}

  ngOnInit(): void {
    this._gitFacade.getAllRepositories();
  }
}
