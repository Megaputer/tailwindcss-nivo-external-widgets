import * as React from 'react';

import type { ApiRequestor, ApprValue, DatasetInfo, Table } from 'pa-typings';
import { variantToDate } from 'helper';

import { ResponsiveLine } from '@nivo/line';

import * as css from './styles.module.css';

const colorByGroupId = {
  'col_0': '#6b6ef8',
  'col_1': '#c654f3',
  'col_2': '#3b94fd'
};

type Data = {
  id: string;
  color?: string;
  data: { x: string | number | Date; y: number }[];
};

// const data = [
//   {
//     'id': 'col_0',
//     'color': 'hsl(179, 70%, 50%)',
//     'data': [
//       {
//         'x': 'plane',
//         'y': 143
//       },
//       {
//         'x': 'helicopter',
//         'y': 114
//       },
//       {
//         'x': 'boat',
//         'y': 49
//       },
//       {
//         'x': 'train',
//         'y': 52
//       },
//       {
//         'x': 'subway',
//         'y': 248
//       },
//       {
//         'x': 'bus',
//         'y': 284
//       },
//       {
//         'x': 'car',
//         'y': 10
//       },
//       {
//         'x': 'moto',
//         'y': 6
//       },
//       {
//         'x': 'bicycle',
//         'y': 207
//       },
//       {
//         'x': 'horse',
//         'y': 156
//       },
//       {
//         'x': 'skateboard',
//         'y': 119
//       },
//       {
//         'x': 'others',
//         'y': 66
//       }
//     ]
//   },
//   {
//     'id': 'col_1',
//     'color': 'hsl(61, 70%, 50%)',
//     'data': [
//       {
//         'x': 'plane',
//         'y': 198
//       },
//       {
//         'x': 'helicopter',
//         'y': 69
//       },
//       {
//         'x': 'boat',
//         'y': 67
//       },
//       {
//         'x': 'train',
//         'y': 168
//       },
//       {
//         'x': 'subway',
//         'y': 21
//       },
//       {
//         'x': 'bus',
//         'y': 233
//       },
//       {
//         'x': 'car',
//         'y': 263
//       },
//       {
//         'x': 'moto',
//         'y': 54
//       },
//       {
//         'x': 'bicycle',
//         'y': 152
//       },
//       {
//         'x': 'horse',
//         'y': 175
//       },
//       {
//         'x': 'skateboard',
//         'y': 219
//       },
//       {
//         'x': 'others',
//         'y': 131
//       }
//     ]
//   },
//   {
//     'id': 'col_2',
//     'color': 'hsl(5, 70%, 50%)',
//     'data': [
//       {
//         'x': 'plane',
//         'y': 111
//       },
//       {
//         'x': 'helicopter',
//         'y': 147
//       },
//       {
//         'x': 'boat',
//         'y': 151
//       },
//       {
//         'x': 'train',
//         'y': 147
//       },
//       {
//         'x': 'subway',
//         'y': 64
//       },
//       {
//         'x': 'bus',
//         'y': 14
//       },
//       {
//         'x': 'car',
//         'y': 184
//       },
//       {
//         'x': 'moto',
//         'y': 218
//       },
//       {
//         'x': 'bicycle',
//         'y': 10
//       },
//       {
//         'x': 'horse',
//         'y': 2
//       },
//       {
//         'x': 'skateboard',
//         'y': 144
//       },
//       {
//         'x': 'others',
//         'y': 201
//       }
//     ]
//   }
// ];

interface Props {
  requestor: ApiRequestor;
  getApprValue: (key: string) => ApprValue | undefined;
}

export const LineChartWidget: React.FC<Props> = ({ requestor, getApprValue }) => {
  const wrapperGuid = React.useRef<{ wrapperGuid: string }>({ wrapperGuid: '' });
  const [dsInfo, setDsInfo] = React.useState<DatasetInfo>();
  const [data, setData] = React.useState<Data[]>([]);

  const xAxis = getApprValue('xAxis') as number;
  const yAxis = getApprValue('yAxis') as unknown as number[];

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

      const values = await requestor.values({
        offset: 0,
        columnIndexes: [xAxis, ...yAxis],
        rowCount: dsInfo.rowCount,
        wrapperGuid: wrapperGuid.current.wrapperGuid
      });

      const newData: Data[] = [];
      let id = 0;
      for (let i = 1; i <= yAxis.length; i++) {
        const data = [];
        for (const vals of values.table?.slice(0, 20) || []) {
          data.push({
            x: +vals[0],
            y: Number(vals[i])
          });
        }
        newData.push({ id: 'col_' + id, color: 'hsl(179, 70%, 50%)', data });
        id += 1;
      }
      setData(newData);
    };
    getValues();
  }, [dsInfo, xAxis, yAxis.length]);

  return (
    <div className={css.main}>
      <ResponsiveLine
        theme={{
          text: {
            fill: '#fff',
          },
          axis: {
            ticks: {
              text: {
                opacity: 0.5
              }
            }
          },
          grid: {
            line: {
              strokeOpacity: 0.5,
              strokeDasharray: '4',
              strokeWidth: 1
            },
          },
        }}
        data={data}
        margin={{ top: 20, right: 20, bottom: 30, left: 20 }}
        xScale={{ type: 'point' }}
        yScale={{
          type: 'linear',
          min: -20,
          max: 120,
          clamp: true,
          stacked: false,
          reverse: false,
        }}
        yFormat=' >-.2f'
        curve='monotoneX'
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legendOffset: 36,
          legendPosition: 'middle',
          truncateTickAt: 0,

          format: (val) => {
            const date = variantToDate(val);
            const str = new Intl.DateTimeFormat('en-US', { month: '2-digit', year: '2-digit' }).format(date);
            return str;
          }
        }}
        axisLeft={null}
        enableGridY={false}
        colors={d => colorByGroupId[d.id as keyof typeof colorByGroupId]}
        pointSize={8}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        enablePointLabel={true}
        pointLabel='data.yFormatted'
        pointLabelYOffset={-12}
        enableTouchCrosshair={true}
        crosshairType='top-left'
        legends={[]}
        motionConfig={{
          duration: 600
        }}
      />
    </div>
  );
};
