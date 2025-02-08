import { KVNamespace } from "@cloudflare/workers-types";
import dayjs from "dayjs";
import { ofetch } from "ofetch";
import { GitHubEvent, GitHubRepo } from "~~/types";

declare const CACHE_KV: KVNamespace;
const IGNORE_EVENTS_TYPE = ["WatchEvent"];
const CACHE_KEY = "projects";

export default defineEventHandler(async () => {
  const cache = await CACHE_KV.get(CACHE_KEY);

  if (cache) return JSON.parse(cache);

  const events = await ofetch<GitHubEvent[]>(
    "https://api.github.com/users/SatooRu65536/events",
    {
      parseResponse: JSON.parse,
    },
  ).catch(() => []);

  const recentEventRepoUrls = events
    .filter(
      (event) =>
        !IGNORE_EVENTS_TYPE.includes(event.type) &&
        dayjs(event.created_at).isAfter(dayjs().subtract(2, "week")),
    )
    .map((event) => event.repo.url);

  const uniqueRepoUrls = Array.from(new Set(recentEventRepoUrls));

  const projectsWithNull = await Promise.all(
    uniqueRepoUrls.map((url) =>
      ofetch<GitHubRepo>(url, { parseResponse: JSON.parse })
        .then((repo) => {
          const tags = repo.topics.map((t) => t.toLowerCase());

          const { name } = repo;
          const summary = repo.description;
          const repository = repo.html_url;
          const site = repo.homepage;
          const updatedAt = repo.pushed_at;
          return {
            name,
            summary,
            tags,
            repository,
            site,
            updatedAt,
          };
        })
        .catch(() => undefined),
    ),
  );

  const projects = projectsWithNull.filter((p) => p !== undefined);
  CACHE_KV.put(CACHE_KEY, JSON.stringify(projects), {
    expirationTtl: 60 * 60, // 1 hour
  });

  return projects;
});
