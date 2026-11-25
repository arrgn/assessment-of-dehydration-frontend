import "./SignTile.css";
import type { FC } from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ROUTES } from "../../Routes";
import { SignImage } from "../SignMedia/SignMedia";

interface Props {
  id: number;
  title: string;
  imgSrc: string;
  dehydratingCoefficient: number | null;
  likesCount: number;
}

/** Карточка услуги в плитке. По нажатию открывает услугу в ленте. */
export const SignTile: FC<Props> = ({
  id,
  title,
  imgSrc,
  dehydratingCoefficient,
  likesCount,
}) => (
  <Card as={Link} to={`${ROUTES.FEED}/${id}`} className="tile">
    <div className="tile-img">
      <SignImage className="tile-img-el" src={imgSrc} alt={title} />
      <div className="tile-badges">
        <span className="tile-badge" title="Коэффициент обезвоживания">
          💧 {dehydratingCoefficient ?? "—"}
        </span>
        <span className="tile-badge like" title="Лайки">
          <svg viewBox="0 0 24 24">
            <path d="M12 21s-8-5.5-8-11a5 5 0 0110-1 5 5 0 0110 1c0 5.5-8 11-8 11z" />
          </svg>
          {likesCount}
        </span>
      </div>
    </div>
    <Card.Body className="tile-title">{title}</Card.Body>
  </Card>
);
