import * as React from 'react';
import type { ApiRequestor, Table } from 'pa-typings';

import { ResponsiveLine } from '@nivo/line';

import * as css from './styles.module.css';
import { variantToDate } from 'helper';

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
}

export const LineChartWidget: React.FC<Props> = ({ requestor }) => {
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
          for (const vals of values.table?.slice(0, 20) || []) {
            data.push({
              x: +vals[1],
              y: Number(vals[col.id])
            });
          }
          newData.push({ id: 'col_' + id, color: 'hsl(179, 70%, 50%)', data });
          id += 1;
        }
      }
      setData(newData);
    };
    fetchData();
  }, [requestor]);

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
            const str = new Intl.DateTimeFormat('en-US', { month: '2-digit', year: '2-digit' }).format(val);
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
