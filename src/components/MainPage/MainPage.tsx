import React, { useEffect, useState, useCallback } from "react";
import { debounce } from "../../lib/DebAndThro";
import { useHistory } from "react-router-dom";
import { RepoListItem } from "./RepoListItem";
import { Paginator } from "../Paginator";

export const MainPage: React.FC = () => {
  const history = useHistory();
  const [reposCount, setReposCount] = useState(0);
  const [repos, setRepos] = useState<MinRepoType[]>([]);
  const [searchString, setSearchString] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  function updateStateData(search: string, page: number) {
    setLoading(true);
    setSearchString(search);
    setCurrentPage(page);
    debouncedFetch(getUrl(search, page));
  }

  function changeSearchStringHandler(evt: React.ChangeEvent<HTMLInputElement>) {
    localStorage.setItem("search", evt.target.value);
    localStorage.setItem("page", "1");
    updateStateData(evt.target.value, 1);
  }

  function changePageHandler(page: number) {
    setLoading(true);
    setCurrentPage(page);
    localStorage.setItem("page", page.toString());
    debouncedFetch(getUrl(searchString, page));
  }

  function goRepoHandler(repo: MinRepoType) {
    history.push(`/card/${repo.full_name}`);
  }

  const debouncedFetch = useCallback(
    debounce((url: string) => {
      fetch(url)
        .then((res) => res.ok && res.json())
        .then((data) => {
          setRepos(data.items);
          setReposCount(data.total_count);
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
        });
    }, 1000),
    []
  );

  useEffect(() => {
    const searchFromStorage = localStorage.getItem("search") || "";
    const pageFromStorage = +(localStorage.getItem("page") || 1);
    updateStateData(searchFromStorage, pageFromStorage);
    // eslint-disable-next-line
  }, []);

  return (
    <div className="block container__block">
      <div className="header block__header">Github search board</div>
      <div className="content block__content">
        <div className="content__search">
          <input
            type="text"
            className="search-input"
            value={searchString}
            onChange={changeSearchStringHandler}
            placeholder="search repo..."
          />
        </div>
        <ul className="content__list">
          {loading ? (
            <li>Loading...</li>
          ) : (
            <>
              {repos &&
                repos.map((repo, index) => (
                  <RepoListItem
                    repo={repo}
                    goRepo={goRepoHandler}
                    key={repo.id}
                    index={index}
                  />
                ))}
            </>
          )}
        </ul>
        {repos.length > 0 && (
          <Paginator
            total={reposCount}
            currentPage={currentPage}
            changePage={changePageHandler}
          />
        )}
      </div>
    </div>
  );
};

export type MinGithubUserType = {
  id: string;
  login: string;
  avatar_url: string;
  html_url: string;
};

export type MinRepoType = {
  id: string;
  full_name: string;
  name: string;
  stargazers_count: number;
  pushed_at: string;
  html_url: string;
  description: string;
  owner: MinGithubUserType;
  languages_url: string;
  contributors_url: string;
};

function getUrl(search: string, page: number) {
  return `https://api.github.com/search/repositories?q=${
    search ? `${search} in:name` : "stars:>0"
  }&page=${page}&per_page=10&sort=stars&order=desc`;
}
