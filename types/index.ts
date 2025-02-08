interface Actor {
  id: number;
  login: string;
  display_login: string;
  gravatar_id: string;
  url: string;
  avatar_url: string;
}

interface Repo {
  id: number;
  name: string;
  url: string;
}

interface Payload {
  action: string;
}

interface Org {
  id: number;
  login: string;
  gravatar_id: string;
  url: string;
  avatar_url: string;
}

export interface GitHubEvent {
  id: string;
  type: string;
  actor: Actor;
  repo: Repo;
  payload: Payload;
  public: boolean;
  created_at: string;
  org: Org;
}

export interface GitHubRepo {
  name: string;
  description: string;
  topics: string[];
  pushed_at: string;
  language: string;
  html_url: string;
  homepage: string;
}

export interface Project {
  name: string;
  summary: string;
  tags: string[];
  repository: string;
  site: string | undefined;
  updatedAt: string;
}
