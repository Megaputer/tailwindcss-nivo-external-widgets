import * as React from 'react';
import type { ApiRequestor, Table } from 'pa-typings';
import { RadialBarCustomLayerProps, ResponsiveRadialBar } from '@nivo/radial-bar';
import { BoxLegendSvg } from '@nivo/legends';

import * as css from './styles.module.css';
import { Theme } from '@nivo/core';

const colorByGroupId = {
  'col_0': '#6b6ef8',
  'col_1': '#c654f3',
  'col_2': '#3b94fd'
};

type Data = {
  id: string;
  data: { x: string; y: number }[];
};

// const data = [
//   {
//     id: 'traf',
//     data: [
//       {
//         x: 'LFL ТРАФИК',
//         y: 60,
//       },
//     ],
//   },
//   {
//     id: 'check',
//     data: [
//       {
//         x: 'LFL СРЕДНИЙ ЧЕК',
//         y: 70,
//       },
//     ],
//   },
//   {
//     id: 'ptd',
//     data: [
//       {
//         x: 'LFL PTD',
//         y: 80,
//       },
//     ],
//   }
// ];

interface Props {
  requestor: ApiRequestor;
}

export const RadialBarChart: React.FC<Props> = ({ requestor }) => {
  const wrapperGuid = React.useRef<{ wrapperGuid: string }>({ wrapperGuid: '' });
  const [data, setData] = React.useState<Data[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const guid = wrapperGuid.current = await requestor.wrapperGuid();
      const dsInfo = await requestor.info(guid);

      const values = await requestor.values({
        offset: 0,
        rowCount: dsInfo.rowCount,
        wrapperGuid: guid.wrapperGuid
      });

      const newData: Data[] = [];
      let id = 0;
      for (const col of dsInfo.columns) {
        if (col.type === 'Numeric') {
          const data = [];
          for (const vals of values.table?.slice(0, 1) || []) {
            data.push({
              x: col.title,
              y: Number(vals[col.id])
            });
          }
          newData.push({ id: 'col_' + id, data });
          id += 1;
        }
      }
      setData(newData);
    };
    fetchData();
  }, [requestor]);

  const CustomLayer = ({ center }: RadialBarCustomLayerProps) => {
    const lines = 'Выполнение плана'.toUpperCase().split(' ');
    return (
      <g transform={`translate(${center[0]}, ${center[1] - 20})`}>
        {lines.map((line, index) => (
          <text
            key={index}
            textAnchor='middle'
            dominantBaseline='central'
            style={{
              fontSize: 14,
              fontWeight: 400,
              fill: '#eeeeee',
            }}
            y={index * 20}
          >
            <tspan>{line}</tspan>
          </text>
        ))}
      </g>
    );
  };

  const CustomLegendLayer = ({ center }: RadialBarCustomLayerProps) => {
    const legendData = data.map(({ id, data }) => ({ id, label: `${data[0].y.toFixed(2)} %` }));

    return (
      <BoxLegendSvg
        containerWidth={center[0] * 2}
        containerHeight={center[1] * 2}
        data={legendData}
        padding={10}
        anchor='bottom'
        direction='column'
        toggleSerie={true}
        justify={false}
        translateX={60}
        translateY={0}
        itemsSpacing={6}
        itemHeight={18}
        itemWidth={10}
        itemDirection='left-to-right'
        itemTextColor='#fff'
        symbolSize={0}
      />
    );
  };

  const demoTheme: Theme = {
    legends: {
      text: {
        fontSize: 12,
        fontWeight: 500,
        fill: '#fff',
      },
    }
  };

  return (
    <div className={css.main}>
      <ResponsiveRadialBar
        data={data}
        theme={demoTheme}
        colors={d => colorByGroupId[d.groupId as keyof typeof colorByGroupId]}
        valueFormat=' >-.2f'
        padding={0.6}
        cornerRadius={20}
        enableTracks={true}
        maxValue={100}
        enableRadialGrid={false}
        enableCircularGrid={false}
        circularAxisOuter={{ tickSize: 1, tickPadding: 12, tickRotation: 45 }}
        isInteractive={false}
        startAngle={0}
        endAngle={360}
        layers={['tracks', 'labels', 'bars', 'legends', CustomLegendLayer, CustomLayer]}
        legends={[
          {
            padding: 10,
            toggleSerie: true,
            anchor: 'bottom-left',
            direction: 'column',
            justify: false,
            translateX: 30,
            translateY: 0,
            itemsSpacing: 6,
            itemDirection: 'left-to-right',
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: '#fff',
            symbolSize: 18,
            symbolShape: 'circle',
          },
        ]}
      />
    </div>
  );
};
