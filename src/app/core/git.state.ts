import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GitInfo } from './git-model';

@Injectable({ providedIn: 'root' })
export class GitState {
  mock: GitInfo[] = [
    {
      id: '1',
      name: 'Mock card',
      description: 'Mock description',
      git_url: 'git_url',
      html_url: 'html_url',
      commits_url: 'commits_url',
      thumbnail: 'image.png',
      language: {
        java: 1,
        python: 2
      }
    },
    {
      id: '2',
      name: 'Mock card 2',
      description: 'Mock description 2',
      git_url: 'git_url',
      html_url: 'html_url',
      commits_url: 'commits_url',
      thumbnail: 'image.png',
      language: {
        java: 1,
        python: 2
      }
    }
  ];

  private _gitRepository = new BehaviorSubject<GitInfo | null>(null);
  private _gitRepositoryInProgress = new BehaviorSubject<boolean>(false);
  private _gitRepositoryLoaded = new BehaviorSubject<boolean>(false);

  private _gitRepositories = new BehaviorSubject<GitInfo[] | null>(this.mock);
  private _gitRepositoriesInProgress = new BehaviorSubject<boolean>(false);
  private _gitRepositoriesLoaded = new BehaviorSubject<boolean>(false);

  //GET - REPOSITORIES
  readonly getGitRepositories$ = this._gitRepositories.asObservable();
  readonly getGitRepositoriesInProgress$ = this._gitRepositoriesInProgress.asObservable();
  readonly getGitRepositoriesLoaded$ = this._gitRepositoriesLoaded.asObservable();
  readonly getGitRepositoriesValue = () => this._gitRepositories.getValue();

  // SET - REPOSITORIES
  readonly setGitRepositories = (value: GitInfo[] | null) => this._gitRepositories.next(value);
  readonly setGitRepositoriesInProgress = (value: boolean) => this._gitRepositoriesInProgress.next(value);
  readonly setGitRepositoriesLoaded = (value: boolean) => this._gitRepositoriesLoaded.next(value);

  //GET - REPOSITORY
  readonly getGitRepository$ = this._gitRepository.asObservable();
  readonly getGitRepositoryInProgress$ = this._gitRepositoryInProgress.asObservable();
  readonly getGitRepositoryLoaded$ = this._gitRepositoryLoaded.asObservable();
  readonly getGitRepositoryValue = () => this._gitRepositoryLoaded.getValue();

  //SET - REPOSITORY
  readonly setGitRepository$ = (value: GitInfo | null) => this._gitRepository.next(value);
  readonly setGitRepositoryInProgress$ = (value: boolean) => this._gitRepositoryInProgress.next(value);
  readonly setGitRepositoryLoaded$ = (value: boolean) => this._gitRepositoryLoaded.next(value);
}
