import { SIGNS_MOCK } from "./mock";
import type { SignFeedItem, SignFilters, SignList } from "./types";

// В этой лабораторной данные берутся только из mock-объектов, без бэкенда.
// Функции повторяют контракт методов веб-сервиса, поэтому при подключении
// к API достаточно заменить их тело на fetch(`/api/dehydration/...`).

const published = () =>
  SIGNS_MOCK.filter((sign) => sign.status === "Опубликован").sort(
    (a, b) => a.id - b.id,
  );

const matchesSearch = (title: string, search?: string) =>
  !search || title.toLowerCase().includes(search.toLowerCase());

/** Максимальный коэффициент среди услуг, найденных по названию */
const getMaxCoefficient = (search?: string): number =>
  Math.max(
    0,
    ...published()
      .filter((sign) => matchesSearch(sign.title, search))
      .map((sign) => sign.dehydratingCoefficient ?? 0),
  );

/** GET /api/dehydration/signs?search&min&max */
export const getSigns = async (
  filters: SignFilters = {},
): Promise<SignList> => {
  const search = filters.search?.trim() || undefined;
  const sliderMax = getMaxCoefficient(search);
  const clamp = (n: number) => Math.min(Math.max(n, 0), sliderMax);
  const from = clamp(filters.min ?? 0);
  const to = clamp(filters.max ?? sliderMax);
  const min = Math.min(from, to);
  const max = Math.max(from, to);
  const hasFilter = min > 0 || max < sliderMax;

  const signs = published()
    .filter((sign) => matchesSearch(sign.title, search))
    .filter(
      (sign) =>
        !hasFilter ||
        (sign.dehydratingCoefficient !== null &&
          sign.dehydratingCoefficient >= min &&
          sign.dehydratingCoefficient <= max),
    );

  return { signs };
};

/**
 * GET /api/dehydration/feed[/:id][?next=true]
 * Без id — первая услуга, с id — первая с id >= :id, с next — следующая после :id.
 * После последней услуги возвращается первая. null — лента пуста (404).
 */
export const getFeedCard = async (
  id?: number,
  next = false,
): Promise<SignFeedItem | null> => {
  const list = published();
  const found =
    id === undefined
      ? list[0]
      : (list.find((sign) => (next ? sign.id > id : sign.id >= id)) ?? list[0]);

  if (!found) return null;

  const { isMine: _isMine, likesCount: _likesCount, ...sign } = found;
  return { ...sign, isLiked: 0 };
};
