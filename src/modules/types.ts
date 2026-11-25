// Типы повторяют ответы веб-сервиса (ветка spa-backend, src/signs/sign-response.ts)

export type SignStatus = "Черновик" | "Опубликован" | "Удален";

export interface Sign {
  id: number;
  title: string;
  description: string | null;
  dehydratingCoefficient: number | null;
  maxDehydratingCoefficient: number;
  vidSrc: string;
  imgSrc: string;
  status: SignStatus;
  createdAt: string;
  updatedAt: string;
}

/** Элемент списка GET /api/dehydration/signs */
export type SignListItem = Sign & {
  isMine: 0 | 1;
  likesCount: number;
};

/** Ответ GET /api/dehydration/feed[/:id] */
export type SignFeedItem = Sign & { isLiked: 0 | 1 };

export interface SignList {
  signs: SignListItem[];
}

/** Query-параметры GET /api/dehydration/signs */
export interface SignFilters {
  search?: string;
  min?: number;
  max?: number;
}
