import { useRef } from "react";
import { Chart } from "../../types";
import { CHART_DEFAULTS } from "./constants";
import { useDimensions } from "../../utils/use-dimensions";
import { scaleLinear, scaleOrdinal } from "d3-scale";
import { VerticalAxis } from "../../complete/bar-chart/Axes/VerticalAxis";
import { HorizontalAxis } from "../../complete/bar-chart/Axes/HorizontalAxis";
import { animated, useSprings } from "react-spring";

export interface ScatterPlotChartProps<Datum> extends Chart<Datum> {
  data: Array<Datum>;
}

export function ScatterPlotChart<Datum>({
  marginTop = CHART_DEFAULTS.marginTop,
  marginRight = CHART_DEFAULTS.marginRight,
  marginBottom = CHART_DEFAULTS.marginBottom,
  marginLeft = CHART_DEFAULTS.marginLeft,
  maxValue = CHART_DEFAULTS.maxValue,
  transitionDuration = CHART_DEFAULTS.transitionDuration,
  colors = [],
  data = [],
  valueAccessor,
  altValueAccessor,
  labelAccessor,
}: ScatterPlotChartProps<Datum>) {
  const ref = useRef<SVGSVGElement>(null);
  const { width: rootWidth, height: rootHeight } = useDimensions(ref);
  const boundedWidth = rootWidth - marginRight - marginLeft;
  const boundedHeight = rootHeight - marginTop - marginBottom;

  // Scales
  const yScale = scaleLinear().domain([0, maxValue]).range([boundedHeight, 0]);
  const xScale = scaleLinear().domain([0, maxValue]).range([0, boundedWidth]);
  const colorScale = scaleOrdinal().domain(data.map(labelAccessor)).range(colors);
  const horizontalAxisTransform = `translate(0, ${boundedHeight})`;

  const springs = useSprings(
    data.length,
    data.map(() => {
      return {
        from: {
          transform: "scale(0)",
          fillOpacity: 0,
        },
        to: {
          transform: "scale(1)",
          fillOpacity: 0.5,
        },
        config: {
          duration: transitionDuration,
        },
      };
    })
  );

  return (
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
        width={boundedWidth}
        height={boundedHeight}
        transform={`translate(${marginLeft}, ${marginTop})`}
      >
        <VerticalAxis
          data-name="linear-axis"
          tickScale={yScale}
          items={yScale.ticks()}
          range={yScale.range()}
          gridWidth={boundedWidth}
        />

        <HorizontalAxis
          data-name="discrete-axis"
          tickScale={xScale}
          transform={horizontalAxisTransform}
          items={xScale.ticks()}
          range={xScale.range()}
          gridHeight={boundedHeight}
        />

        {/* Circles */}
        {data.map((d, i) => {
          return (
            <g key={i}>
              <animated.circle
                r={13}
                cx={xScale(valueAccessor(d))}
                cy={yScale(altValueAccessor(d))}
                stroke={colorScale(labelAccessor(d))}
                fill={colorScale(labelAccessor(d))}
                opacity={1}
                strokeWidth={1}
                {...springs[i]}
              />
              <title>
                {labelAccessor(d)} ({valueAccessor(d)})
              </title>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
