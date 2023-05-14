import { Injectable } from '@angular/core';
import { GitState } from './git.state';
import { GitInfo, GitLanguages, GitThumbnail } from './git-model';
import { HttpClient } from '@angular/common/http';
import { take, catchError, finalize, map, forkJoin, filter, switchMap, Observable } from 'rxjs';

@Injectable()
export class GitFacade {
  private _repositoriesByLanguage = new Map<string, GitInfo[]>(); //TODO Move to State?
  private _baseUrl = 'https://api.github.com/users/Fazeludox';
  private _imageUrl = (repositoryName: string) => `https://api.github.com/repos/Fazeludox/${repositoryName}/contents/thumbnails`;
  private _languageRepository = (repositoryName: string) => `https://api.github.com/repos/Fazeludox/${repositoryName}/languages`;

  repository$ = this._gitState.getGitRepository$;

  repositories$ = this._gitState.getGitRepositories$;
  repositoriesInProgress$ = this._gitState.getGitRepositoriesInProgress$;
  repositoriesLoaded$ = this._gitState.getGitRepositoriesLoaded$;

  constructor(private _gitState: GitState, private _httpClient: HttpClient) {}

  loadGitPage(): void {
    if (!this._gitState.getGitRepositoriesValue()) {
      this.getAllRepositories();
    } else {
      console.log('TODO: LOCALSTORAGE, CACHE, COOKIE');
      this._gitState.getGitRepositoriesValue()?.forEach(repo => this.setupLanguagesAvailable(repo, repo.language));
    }
  }

  getAllLanguages(): string[] {
    return Array.from(this._repositoriesByLanguage.keys());
  }

  getRepositoriesByLanguage(key: string): void {
    const repositories = this._repositoriesByLanguage.get(key);
    this._gitState.setGitRepositories(repositories || []);
  }

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

  private getLanguage$(repositoryName: string): Observable<GitLanguages> {
    return this._httpClient.get<GitLanguages>(this._languageRepository(repositoryName));
  }

  private getThumbnail$(repositoryName: string): Observable<GitThumbnail> {
    return this._httpClient.get<GitThumbnail>(this._imageUrl(repositoryName)).pipe();
  }

  //TODO: RATE LIMIT - LOCAL STORAGE | CACHE | COOKIE
  private getAllRepositories(): void {
    this._gitState.setGitRepositoriesInProgress(true);
    this._gitState.setGitRepositoriesLoaded(false);

    this._httpClient
      .get<GitInfo[]>(`${this._baseUrl}/repos`)
      .pipe(
        take(1),
        map(repositories => {
          return repositories.map(repository =>
            forkJoin([this.getLanguage$(repository?.name), this.getThumbnail$(repository.name)]).pipe(
              filter(([languages, thumbnail]) => !!languages && !!thumbnail),
              map(([languages, thumbnail]) => {
                const repositoryUpdated = { ...repository, language: languages, thumbnail: thumbnail?.download_url } as GitInfo;
                this.setupLanguagesAvailable(repositoryUpdated, languages);
                return repositoryUpdated;
              })
            )
          );
        }),
        switchMap(repositories => forkJoin(repositories)),
        catchError(err => {
          this._gitState.setGitRepositoriesInProgress(false);
          this._gitState.setGitRepositoriesLoaded(true);
          throw err;
        }),
        finalize(() => {
          this._gitState.setGitRepositoriesInProgress(false);
          this._gitState.setGitRepositoriesLoaded(true);
        })
      )
      .subscribe((repositories: GitInfo[]) => this._gitState.setGitRepositories(repositories));
  }

  private setupLanguagesAvailable(repository: GitInfo, content: GitLanguages): void {
    let repos = [repository];
    Object.keys(content).forEach(key => {
      if (this._repositoriesByLanguage.has(key)) {
        const repositories = this._repositoriesByLanguage.get(key);
        if (repositories) {
          repos = repositories;
          repos.push(repository);
        }
      }

      this._repositoriesByLanguage.set(key, repos);
    });
  }
}
