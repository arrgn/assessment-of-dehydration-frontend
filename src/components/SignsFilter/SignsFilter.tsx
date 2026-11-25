import "./SignsFilter.css";
import type { FC, SubmitEvent } from "react";
import { Button, Form } from "react-bootstrap";
import { RangeSlider } from "../RangeSlider/RangeSlider";

interface Props {
  search: string;
  min: number;
  max: number;
  sliderMax: number;
  onSearchChange: (value: string) => void;
  onRangeChange: (min: number, max: number) => void;
  onSubmit: () => void;
}

/**
 * Фильтр плитки: поиск по названию и диапазон коэффициента обезвоживания.
 * Значения хранятся в состоянии родителя, фильтр применяется по кнопке.
 */
export const SignsFilter: FC<Props> = ({
  search,
  min,
  max,
  sliderMax,
  onSearchChange,
  onRangeChange,
  onSubmit,
}) => {
  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <Form className="filters" onSubmit={handleSubmit}>
      <Form.Control
        type="search"
        className="search-input"
        placeholder="Поиск по названию"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
      />
      <RangeSlider
        min={min}
        max={max}
        sliderMax={sliderMax}
        onChange={onRangeChange}
      />
      <Button
        type="submit"
        className="filter-btn"
        aria-label="Применить фильтр"
      >
        <svg viewBox="0 0 24 24">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </Button>
    </Form>
  );
};
