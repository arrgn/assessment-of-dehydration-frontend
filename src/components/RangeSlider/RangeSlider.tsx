import "./RangeSlider.css";
import type { FC } from "react";
import { Form } from "react-bootstrap";

interface Props {
  min: number;
  max: number;
  sliderMax: number;
  onChange: (min: number, max: number) => void;
}

/** Слайдер диапазона с двумя ползунками «от» и «до» */
export const RangeSlider: FC<Props> = ({ min, max, sliderMax, onChange }) => {
  const fillLeft = sliderMax ? (min / sliderMax) * 100 : 0;
  const fillRight = sliderMax ? 100 - (max / sliderMax) * 100 : 0;

  // Ползунки нельзя перетянуть друг через друга
  const handleMin = (value: number) => onChange(Math.min(value, max), max);
  const handleMax = (value: number) => onChange(min, Math.max(value, min));

  return (
    <div className="range">
      <div className="range-label">
        <span>💧 {min}</span>
        <span>💧 {max}</span>
      </div>
      <div className="range-track">
        <div
          className="range-fill"
          style={{ left: `${fillLeft}%`, right: `${fillRight}%` }}
        />
        <Form.Range
          min={0}
          max={sliderMax}
          step={1}
          value={min}
          disabled={!sliderMax}
          onChange={(event) => handleMin(Number(event.target.value))}
          aria-label="Коэффициент от"
        />
        <Form.Range
          min={0}
          max={sliderMax}
          step={1}
          value={max}
          disabled={!sliderMax}
          onChange={(event) => handleMax(Number(event.target.value))}
          aria-label="Коэффициент до"
        />
      </div>
    </div>
  );
};
