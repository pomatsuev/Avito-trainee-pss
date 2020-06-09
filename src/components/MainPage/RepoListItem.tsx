import React from "react";
import { MinRepoType } from "./MainPage";

import { motion } from "framer-motion";

interface IRepoListItemProps {
  repo: MinRepoType;
  goRepo: (repo: MinRepoType) => void;
  index: number;
}

const motionLiVariants = {
  from: {
    x: 20,
    opacity: 0,
  },
  to: (index: number) => ({
    x: 0,
    opacity: 1,
    transition: {
      delay: ((index || 0) + 1) * 0.05,
    },
  }),
};

export const RepoListItem: React.FC<IRepoListItemProps> = ({
  repo,
  goRepo,
  index,
}) => (
  <motion.li
    variants={motionLiVariants}
    initial="from"
    animate="to"
    custom={index}
    className="content__item"
    onClick={goRepo.bind(null, repo)}
  >
    <span>{repo.name}</span>
    <span className="content__text_lighter">
      {repo.stargazers_count}⭐ / Last update:
      {new Date(repo.pushed_at).toLocaleDateString()} /
      <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
        link
      </a>
    </span>
  </motion.li>
);
