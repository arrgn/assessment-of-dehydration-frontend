import "./SignsPage.css";
import { useEffect, useState, type FC } from "react";
import { Spinner } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { SignTile } from "../../components/SignTile/SignTile";
import { SignsFilter } from "../../components/SignsFilter/SignsFilter";
import { getSigns } from "../../modules/dehydrationApi";
import type { SignListItem } from "../../modules/types";

const parseNumber = (raw: string | null): number | undefined => {
  if (raw === null || raw.trim() === "") return undefined;
  const n = Number(raw);
  return Number.isInteger(n) && n >= 0 ? n : undefined;
};

/** Страница «Плитка»: фильтр и сетка карточек услуг */
export const SignsPage: FC = () => {
  // Применённые фильтры хранятся в адресной строке: /signs?search=&min=&max=
  const [searchParams, setSearchParams] = useSearchParams();
  const appliedSearch = searchParams.get("search") ?? "";
  const appliedMin = parseNumber(searchParams.get("min"));
  const appliedMax = parseNumber(searchParams.get("max"));

  // Значения полей фильтра до нажатия кнопки «Применить»
  const [search, setSearch] = useState(appliedSearch);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const [sliderMax, setSliderMax] = useState(0);

  // Найденные карточки и набор фильтров, для которого они загружены
  const filtersKey = searchParams.toString();
  const [loaded, setLoaded] = useState<{
    key: string;
    signs: SignListItem[];
    failed?: boolean;
  }>();
  const loading = loaded?.key !== filtersKey;
  const signs = loaded?.signs ?? [];

  // Верхняя граница слайдера — максимальный коэффициент среди найденных по названию
  useEffect(() => {
    let ignore = false;

    getSigns({ search: appliedSearch })
      .then(({ signs: found }) => {
        if (ignore) return;
        const upper = Math.max(
          0,
          ...found.map((sign) => sign.dehydratingCoefficient ?? 0),
        );
        const clamp = (n: number) => Math.min(Math.max(n, 0), upper);
        const from = clamp(appliedMin ?? 0);
        const to = clamp(appliedMax ?? upper);

        setSliderMax(upper);
        setMin(Math.min(from, to));
        setMax(Math.max(from, to));
      })
      // Без границы слайдера фильтр остаётся с прежними значениями
      .catch((error: unknown) => {
        console.error("Не удалось получить границы фильтра", error);
      });

    return () => {
      ignore = true;
    };
  }, [appliedSearch, appliedMin, appliedMax]);

  // Загрузка карточек при каждом изменении применённых фильтров
  useEffect(() => {
    let ignore = false;

    getSigns({ search: appliedSearch, min: appliedMin, max: appliedMax })
      .then(({ signs: found }) => {
        if (!ignore) setLoaded({ key: filtersKey, signs: found });
      })
      .catch((error: unknown) => {
        console.error("Не удалось загрузить услуги", error);
        if (!ignore) setLoaded({ key: filtersKey, signs: [], failed: true });
      });

    return () => {
      ignore = true;
    };
  }, [filtersKey, appliedSearch, appliedMin, appliedMax]);

  const handleRangeChange = (from: number, to: number) => {
    setMin(from);
    setMax(to);
  };

  const handleSubmit = () => {
    const params: Record<string, string> = {};
    const query = search.trim();
    if (query) params.search = query;
    // Диапазон передаём, только если он уже всего слайдера
    if (min > 0 || max < sliderMax) {
      params.min = String(min);
      params.max = String(max);
    }
    setSearchParams(params);
  };

  return (
    <div className="screen">
      <SignsFilter
        search={search}
        min={min}
        max={max}
        sliderMax={sliderMax}
        onSearchChange={setSearch}
        onRangeChange={handleRangeChange}
        onSubmit={handleSubmit}
      />

      {loading ? (
        <div className="cards-loader">
          <Spinner animation="border" />
        </div>
      ) : (
        <div className="cards-grid">
          {signs.length ? (
            signs.map((sign) => <SignTile key={sign.id} {...sign} />)
          ) : (
            <p className="cards-empty">
              {loaded?.failed
                ? "Не удалось загрузить услуги"
                : "Ничего не найдено"}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
