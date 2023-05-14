import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GitFacade } from '@app/core/git.facade';
import { GitState } from '@app/core/git.state';
import { GitCardComponent } from '@app/shared/components/git-card/git-card.component';

@Component({
  selector: 'app-github-proyects',
  standalone: true,
  imports: [GitCardComponent, NgIf, NgFor, AsyncPipe],
  providers: [GitFacade, GitState],
  templateUrl: './github-projects.component.html',
  styleUrls: ['./github-projects.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GithubProjectsComponent implements OnInit {
  repositories$ = this._gitFacade.repositories$;
  repositoriesInProgress$ = this._gitFacade.repositoriesInProgress$;
  repositoriesLoaded$ = this._gitFacade.repositoriesLoaded$;

  constructor(private _gitFacade: GitFacade) {}

  ngOnInit(): void {
    this._gitFacade.loadGitPage();
  }
}
