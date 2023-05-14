export interface GitInfo {
  id: string;
  name: string;
  description: string;
  git_url: string;
  html_url: string;
  commits_url: string;
  thumbnail: string;
  language: GitLanguages;
}

export interface GitThumbnail {
  name: string;
  download_url: string;
}

export interface GitLanguages {
  [str: string]: number;
}
