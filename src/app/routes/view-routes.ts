import { Route } from '@angular/router';

export const viewRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'about-me',
    pathMatch: 'full'
  },
  {
    path: 'about-me',
    loadComponent: () => import('../pages/views/about-me/about-me.component').then(c => c.AboutMeComponent)
  },
  {
    path: 'projects',
    loadComponent: () => import('../pages/views/github-projects/github-projects.component').then(c => c.GithubProjectsComponent)
  }
];
