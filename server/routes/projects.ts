import dayjs from "dayjs";
import { ofetch } from "ofetch";
import { GitHubEvent, GitHubRepo } from "~~/types";

const EVENTS_API_URL = import.meta.env.NITRO_GITHUB_EVENTS_API_URL;

const IGNORE_EVENTS_TYPE = ["WatchEvent"];

if (EVENTS_API_URL === undefined)
  throw new Error("Missing env var NITRO_GITHUB_EVENTS_API_URL");

export default defineEventHandler(async () => {
  const events = await ofetch<GitHubEvent[]>(EVENTS_API_URL, {
    parseResponse: JSON.parse,
  }).catch(() => []);

  const recentEventRepoUrls = events
    .filter(
      (event) =>
        !IGNORE_EVENTS_TYPE.includes(event.type) &&
        dayjs(event.created_at).isAfter(dayjs().subtract(2, "week")),
    )
    .map((event) => event.repo.url);

  const uniqueRepoUrls = Array.from(new Set(recentEventRepoUrls));

  const projects = await Promise.all(
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

  return projects.filter((p) => p !== undefined);
});
