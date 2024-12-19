import * as React from 'react';
import type { ApiRequestor, Table } from 'pa-typings';

import { ResponsiveBar } from '@nivo/bar';

import * as css from './styles.module.css';

const colorByGroupId = {
  'hot dog': '#6b6ef8',
  'burger': '#c654f3',
  'sandwich': '#3b94fd'
};

const data = [
  {
    'country': 'AD',
    'hot dog': 125,
    'hot dogColor': 'hsl(108, 70%, 50%)',
    'burger': 48,
    'burgerColor': 'hsl(329, 70%, 50%)',
    'sandwich': 170,
    'sandwichColor': 'hsl(177, 70%, 50%)'
  },
  {
    'country': 'AE',
    'hot dog': 186,
    'hot dogColor': 'hsl(274, 70%, 50%)',
    'burger': 102,
    'burgerColor': 'hsl(286, 70%, 50%)',
    'sandwich': 70,
    'sandwichColor': 'hsl(322, 70%, 50%)'
  },
  {
    'country': 'AF',
    'hot dog': 166,
    'hot dogColor': 'hsl(30, 70%, 50%)',
    'burger': 3,
    'burgerColor': 'hsl(229, 70%, 50%)',
    'sandwich': 183,
    'sandwichColor': 'hsl(63, 70%, 50%)'
  },
  {
    'country': 'AG',
    'hot dog': 57,
    'hot dogColor': 'hsl(52, 70%, 50%)',
    'burger': 137,
    'burgerColor': 'hsl(265, 70%, 50%)',
    'sandwich': 92,
    'sandwichColor': 'hsl(279, 70%, 50%)',
  }
];

interface Props {
  requestor: ApiRequestor;
}

export const BarChartWidget: React.FC<Props> = ({ requestor }) => {
  const wrapperGuid = React.useRef<{ wrapperGuid: string }>({ wrapperGuid: '' });
  const [rowCount, setRowCount] = React.useState(0);
  const [rowColumn, setColumnCount] = React.useState(0);
  const [values, setValues] = React.useState<Table>({ rowIDs: [] });

  React.useEffect(() => {
    const fetchData = async () => {
      const guid = wrapperGuid.current = await requestor.wrapperGuid();
      const dsInfo = await requestor.info(guid);

      setColumnCount(dsInfo.columns.length);
      setRowCount(dsInfo.rowCount);

      const values = await requestor.values({
        offset: 0,
        rowCount: dsInfo.rowCount,
        wrapperGuid: guid.wrapperGuid
      });
      setValues(values);
    };
    fetchData();
  }, [requestor]);

  return (
    <div className={css.main}>
      <ResponsiveBar
        theme={{
          text: {
            fill: '#fff'
          },
        }}
        colors={d => colorByGroupId[d.id as keyof typeof colorByGroupId]}
        data={data}
        keys={[
          'hot dog',
          'burger',
          'sandwich'
        ]}
        indexBy='country'
        margin={{ bottom: 20 }}
        innerPadding={6}
        groupMode='grouped'
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        defs={[
          {
            id: 'lines',
            type: 'patternLines',
            background: 'inherit',
            color: '#eed312',
            rotation: -45,
            lineWidth: 6,
            spacing: 10
          }
        ]}
        borderWidth={5}
        borderColor={{
          from: 'color',
          modifiers: [
            [
              'brighter',
              0.3
            ],
            [
              'opacity',
              0.8
            ]
          ]
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 3,
          tickRotation: 0,
          legendPosition: 'middle',
          legendOffset: 32,
          truncateTickAt: 0
        }}
        axisLeft={null}
        enableGridY={false}
        enableLabel={false}
        labelSkipWidth={22}
        labelSkipHeight={12}
        labelTextColor={{
          from: 'color',
          modifiers: [
            [
              'darker',
              1.6
            ]
          ]
        }}
        legends={[]}
        role='application'
      />
    </div>
  );
};
