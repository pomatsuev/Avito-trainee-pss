import React from "react";

interface IPaginatorProps {
  total: number;
  currentPage: number;
  changePage: (page: number) => void;
}

export const Paginator: React.FC<IPaginatorProps> = ({
  total,
  currentPage,
  changePage,
}) => {
  const pageNumberFromArray = currentPage - 1;
  const allPages = Math.ceil(total / 10);
  const pagesArray = Array.from(Array(allPages).keys());
  const prev = pagesArray.slice(
    pageNumberFromArray - 3 > 0 ? pageNumberFromArray - 3 : 0,
    pageNumberFromArray
  );
  const next = pagesArray.slice(pageNumberFromArray, pageNumberFromArray + 4);
  const pagesToPrint = prev.concat(next);
  return (
    <div className="paginator content__paginator">
      <ul className="paginator__ul">
        {pagesToPrint &&
          pagesToPrint.map((i) => {
            const classLi = ["paginator__li"];
            if (pageNumberFromArray === i) classLi.push("paginator__li_active");
            return (
              <li
                className={classLi.join(" ")}
                key={i}
                onClick={changePage.bind(null, i + 1)}
              >
                {i + 1}
              </li>
            );
          })}
      </ul>
    </div>
  );
};
