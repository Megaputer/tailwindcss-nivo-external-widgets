import * as React from 'react';
import type { ApiRequestor, ApprValue, DatasetInfo } from 'pa-typings';
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

interface Props {
  requestor: ApiRequestor;
  getApprValue: (key: string) => ApprValue | undefined;
}

export const RadialBarChart: React.FC<Props> = ({ requestor, getApprValue }) => {
  const wrapperGuid = React.useRef<{ wrapperGuid: string }>({ wrapperGuid: '' });
  const [dsInfo, setDsInfo] = React.useState<DatasetInfo>();
  const [data, setData] = React.useState<Data[]>([]);

  const colNames = getApprValue('columns') as unknown as string[];

  React.useEffect(() => {
    const fetchData = async () => {
      const guid = wrapperGuid.current = await requestor.wrapperGuid();
      const dsInfo = await requestor.info(guid);
      setDsInfo(dsInfo);
    };
    fetchData();
  }, [requestor]);

  React.useEffect(() => {
    const getValues = async () => {
      if (dsInfo == undefined)
        return;

      const columnIndexes = dsInfo.columns
        .filter(({ title }) => colNames.includes(title))
        .map(c => c.id);

      const { table = [] } = await requestor.values({
        offset: 0,
        rowCount: 1,
        columnIndexes,
        wrapperGuid: wrapperGuid.current.wrapperGuid
      });

      const newData: Data[] = [];
      let id = 0;
      for (const name of colNames) {
        const title = name || 'Unknown column';
        const data = [{ x: title, y: Number(table[0][id]) }];
        newData.push({ id: title, data });
        id += 1;
      }
      setData(newData);
    };
    getValues();
  }, [dsInfo, colNames.length]);

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
    const legendData = data.map(({ id, data }) => ({ id, label: `${data[0]?.y.toFixed(2)} %` }));

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

  if (!colNames.length) {
    return <div className={css.selectColumn}>Select column in the appearance</div>;
  }

  const colors: Record<string, string> = {};
  for (const col of colNames) {
    colors[`${col}.${col}`] = getApprValue(`colors/${col}`)?.toString() || '#ccc';
  }

  return (
    <div className={css.main}>
      <ResponsiveRadialBar
        data={data}
        theme={demoTheme}
        colors={d => colors[d.id] || '#ccc'}
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
