import { useRef } from "react";
import "../BarChart.css";
import { CHART_DEFAULTS } from "../constants";
import { useDimensions } from "../../../utils/use-dimensions";
import { Chart } from "../../../types";
import { scaleBand, scaleLinear, scaleOrdinal } from "d3-scale";
import { lab } from "d3-color";

export interface BarChartProps<Datum> extends Chart<Datum> {
  /**
   * Sets both the inner and outer padding to the band.
   * The value ranges between 0 and 1.
   * @see https://d3js.org/d3-scale/band#band_padding
   */
  padding?: number;
}

export function BarChart<Datum>({
  marginTop = CHART_DEFAULTS.marginTop,
  marginRight = CHART_DEFAULTS.marginRight,
  marginBottom = CHART_DEFAULTS.marginBottom,
  marginLeft = CHART_DEFAULTS.marginLeft,
  padding = CHART_DEFAULTS.padding,
  colors = [],
  data = [],
  labelAccessor,
  valueAccessor,
}: BarChartProps<Datum>) {
  const ref = useRef<SVGSVGElement>(null);
  const { width: rootWidth, height: rootHeight } = useDimensions(ref);

  const boundedWidth = rootWidth - marginRight - marginLeft;
  const boundedHeight = rootHeight - marginTop - marginBottom;

  const discreteValues = data.map(labelAccessor);
  const discreteScale = scaleBand()
    .domain(discreteValues)
    .range([0, boundedWidth])
    .padding(padding);

  const linearScale = scaleLinear()
    .domain([0, Math.max(...data.map(valueAccessor))])
    .range([0, boundedHeight]);

  const getBandColor = scaleOrdinal(colors).domain(discreteScale.domain());

  return (
    <>
      <svg
        ref={ref}
        width={rootWidth}
        height={rootHeight}
        style={{
          width: "100%",
          height: "100%",
          border: "1px dashed lightgray",
          borderRadius: 5,
          fontFamily: '"Nunito Sans"',
        }}
      >
        <g
          data-name="bounds"
          width={boundedWidth}
          height={boundedHeight}
          transform={`translate(${marginLeft}, ${marginRight})`}
          fontSize={14}
        >
          <g data-name="bars">
            {data.map((d, i) => {
              const label = labelAccessor(d);
              const value = valueAccessor(d);
              const bandColor = getBandColor(label);
              return (
                <g className="bar" data-value={value} key={label}>
                  <rect
                    fill={bandColor}
                    x={discreteScale(label)}
                    y={boundedHeight - linearScale(value)}
                    width={discreteScale.bandwidth()}
                    height={linearScale(value)}
                  />
                </g>
              );
            })}
          </g>
          <g data-name="horizontal-axis">
            <line
              x1={0}
              y1={boundedHeight}
              x2={boundedWidth}
              y2={boundedHeight}
              fill="black"
              stroke="black"
            />
          </g>
        </g>
      </svg>
      <div
        style={{
          width: boundedWidth,
          height: 100,
          marginLeft: marginLeft,
          marginTop: -marginBottom,
          backgroundColor: "lightgray",
          position: "relative",
        }}
      >
        {discreteValues.map((label) => {
          const x = discreteScale(label);
          return (
            <div
              style={{
                width: discreteScale.bandwidth(),
                height: "100%",
                position: "absolute",
                left: x,
                top: 0,
                backgroundColor: "lightyellow",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                wordWrap: "break-word",
                textAlign: "center",
              }}
            >
              <span>{label}</span>
              <br></br>
              aks kjs akjs akjsa ksaj ska askj sjk askd jksks
            </div>
          );
        })}
      </div>
    </>
  );
}
