import "./FeedPage.css";
import { useEffect, useState, type FC } from "react";
import { Button, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../Routes";
import { SignVideo } from "../../components/SignMedia/SignMedia";
import { getFeedCard } from "../../modules/dehydrationApi";
import type { SignFeedItem } from "../../modules/types";

/** Страница «Лента»: одна услуга на весь экран с видео */
export const FeedPage: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Загруженная карточка и :id, для которого она загружена
  const [loaded, setLoaded] = useState<{
    id?: string;
    sign: SignFeedItem | null;
    failed?: boolean;
  }>();
  // Пока карточка для текущего :id не пришла — показываем загрузку
  const loading = !loaded || loaded.id !== id;
  const sign = loaded?.sign ?? null;

  // Загружаем карточку при открытии страницы и при смене :id в адресе
  useEffect(() => {
    let ignore = false;

    const fromId = id === undefined ? undefined : Number(id);
    getFeedCard(Number.isInteger(fromId) ? fromId : undefined)
      .then((card) => {
        if (!ignore) setLoaded({ id, sign: card });
      })
      .catch((error: unknown) => {
        console.error("Не удалось загрузить услугу", error);
        if (!ignore) setLoaded({ id, sign: null, failed: true });
      });

    // Ответ на устаревший запрос (если :id успел смениться) игнорируется
    return () => {
      ignore = true;
    };
  }, [id]);

  // Стрелка «Следующая запись»: после последней услуги лента начинается сначала
  const handleNext = () => {
    getFeedCard(sign?.id, Boolean(sign))
      .then((next) => {
        // navigate может вернуть Promise — результат перехода не нужен
        if (next) void navigate(`${ROUTES.FEED}/${next.id}`);
      })
      .catch((error: unknown) => {
        console.error("Не удалось перейти к следующей услуге", error);
      });
  };

  if (loading) {
    return (
      <div className="screen screen--flush feed-loader">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="screen screen--flush">
      <article className="sign-card">
        <SignVideo
          key={sign?.id ?? "empty"}
          className="sign-video"
          src={sign?.vidSrc ?? ""}
          poster={sign?.imgSrc ?? ""}
        />

        <div className="sign-bottom">
          <div className="sign-info">
            {sign ? (
              <>
                <h2>{sign.title}</h2>
                <p>{sign.description}</p>
              </>
            ) : (
              <h2>
                {loaded?.failed ? "Не удалось загрузить услугу" : "Лента пуста"}
              </h2>
            )}
          </div>

          <div className="sign-actions">
            {sign && (
              <div className="sign-tags">
                <span className="tag" title="Коэффициент обезвоживания">
                  <span>💧</span>
                  <span>{sign.dehydratingCoefficient ?? "—"}</span>
                </span>
                <span
                  className="tag"
                  title="Максимальный коэффициент обезвоживания"
                >
                  <span>🔺</span>
                  <span>{sign.maxDehydratingCoefficient}</span>
                </span>
              </div>
            )}

            {sign && (
              // Гость не может ставить лайки — кнопка неактивна
              <Button
                className={`icon-btn heart${sign.isLiked ? " liked" : ""}`}
                disabled
                aria-label="В избранное (нужен вход)"
                title="Войдите, чтобы ставить лайки"
              >
                <svg viewBox="0 0 24 24" width="22" height="22">
                  <path d="M12 21s-8-5.5-8-11a5 5 0 0110-1 5 5 0 0110 1c0 5.5-8 11-8 11z" />
                </svg>
              </Button>
            )}

            <Button
              className="icon-btn arrow"
              onClick={handleNext}
              disabled={!sign}
              aria-label="Следующая запись"
              title="Следующая запись"
            >
              <svg viewBox="0 0 24 24" width="22" height="22">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </Button>
          </div>
        </div>
      </article>
    </div>
  );
};
