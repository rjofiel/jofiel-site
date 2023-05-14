import { Injectable } from '@angular/core';
import { GitService } from './git.service';
import { GitState } from './git.state';

@Injectable()
export class GitFacade {
  repository$ = this._gitState.getGitRepository$;
  repositories$ = this._gitState.getGitRepositories$;

  constructor(private _gitService: GitService, private _gitState: GitState) {}

  getAllRepositories(): void {
    if (!this._gitState.getGitRepositoriesValue()) {
      console.log('RELOADED');
      this._gitService.getAllRepositories();
    }
  }

  getRepositories(id: string): void {
    if (!this._gitState.getGitRepositoryValue()) {
      this._gitService.getRepository(id);
    }
  }
}
