import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, take, tap } from 'rxjs';
import { GitInfo } from './git-model';
import { GitState } from './git.state';

@Injectable({ providedIn: 'root' })
export class GitService {
  private _baseUrl = 'https://api.github.com/users/Fazeludox';

  constructor(private _httpClient: HttpClient, private _gitState: GitState) {}

  getRepository(id: string): void {
    this._httpClient
      .get<GitInfo>(this._baseUrl)
      .pipe(
        take(1),
        catchError(err => {
          throw err;
        }),
        finalize(() => console.log('GET'))
      )
      .subscribe();
  }

  getAllRepositories(): void {
    this._httpClient
      .get<GitInfo[]>(`${this._baseUrl}/repos`)
      .pipe(
        tap(console.log),
        take(1),
        catchError(err => {
          throw err;
        }),
        finalize(() => console.log('GET ALL'))
      )
      .subscribe((repositories: GitInfo[]) => this._gitState.setGitRepositories(repositories));
  }
}
