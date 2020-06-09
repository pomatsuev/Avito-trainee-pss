import React, { useEffect, useState } from "react";
import { useRouteMatch, Link } from "react-router-dom";

import { MinRepoType } from "../MainPage/MainPage";

export const CardPage: React.FC = () => {
  const match = useRouteMatch<{ user: string; reponame: string }>();
  const [repo, setRepo] = useState<MinRepoType | null>(null);
  const [lang, setLang] = useState<{ [langName: string]: number }>({});
  const [contrib, setContrib] = useState<
    | {
        id: string;
        login: string;
        html_url: string;
        contributions: number;
      }[]
    | null
  >(null);
  useEffect(() => {
    fetch(getRepoUrl(match.params.user, match.params.reponame))
      .then((res) => res.ok && res.json())
      .then((data) => {
        fetch((data as MinRepoType).languages_url)
          .then((res) => res.ok && res.json())
          .then((langData) => setLang(langData));
        fetch((data as MinRepoType).contributors_url)
          .then((res) => res.ok && res.json())
          .then((contribData) => setContrib(contribData));
        setRepo(data);
      });
    // eslint-disable-next-line
  }, []);
  return (
    <div className="block container__block">
      <div className="header block__header">
        Repo info / <Link to="/">Back to search</Link>
      </div>
      <div className="content block__content">
        <div className="repo-card">
          <div className="row repo-card__row">
            <div className="row__caption">Репозиторий:</div>
            <div>
              {repo?.name} - {repo?.stargazers_count}⭐ -
              {repo && new Date(repo.pushed_at).toLocaleDateString()}
            </div>
          </div>
          <div className="row repo-card__row">
            <img
              src={repo?.owner.avatar_url}
              alt="avatar"
              width="100"
              height="100"
            />
          </div>
          <div className="row repo-card__row">
            <div className="row__caption">Владелец:</div>
            <div>
              <a
                target="_blank"
                href={repo?.owner.html_url}
                rel="noopener noreferrer"
              >
                {repo?.owner.login}
              </a>
            </div>
          </div>
          <div className="row repo-card__row">
            <div className="row__caption">Языки:</div>
            <ul>
              {Object.keys(lang)
                .slice(0, 5)
                .map((key) => {
                  return (
                    <li key={key}>
                      {key}: {lang[key]}{" "}
                    </li>
                  );
                })}
            </ul>
          </div>
          <div className="row repo-card__row">
            <div className="row__caption">Описание:</div>
            <div>{repo?.description}</div>
          </div>
          <div className="row repo-card__row">
            <div className="row__caption">Контрибьютеры:</div>
            <ul>
              {contrib?.slice(0, 10).map((contributor) => {
                return (
                  <li key={contributor.id}>
                    <a
                      href={contributor.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {contributor.login} / {contributor.contributions}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

function getRepoUrl(user: string, repoName: string) {
  return `https://api.github.com/repos/${user}/${repoName}`;
}
