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

interface Props {
  requestor: ApiRequestor;
  getApprValue: (key: string) => ApprValue | undefined;
}

export const LineChartWidget: React.FC<Props> = ({ requestor, getApprValue }) => {
  const wrapperGuid = React.useRef<{ wrapperGuid: string }>({ wrapperGuid: '' });
  const [dsInfo, setDsInfo] = React.useState<DatasetInfo>();
  const [data, setData] = React.useState<Data[]>([]);

  const minYAxis = getApprValue('minYAxis') as number;
  const maxYAxis = getApprValue('maxYAxis') as number;
  const [yScale, setYScale] = React.useState({ min: minYAxis, max: maxYAxis });

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
      if (dsInfo == undefined || !yAxis.length)
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

  React.useEffect(() => {
    if (minYAxis !== yScale.min) {
      setYScale({ ...yScale, min: minYAxis });
    }

    if (maxYAxis !== yScale.max) {
      setYScale({ ...yScale, max: maxYAxis });
    }
  }, [minYAxis, maxYAxis]);

  if (!yAxis.length) {
    return <div className={css.selectColumn}>Select column in the appearance</div>;
  }

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
          min: yScale.min,
          max: yScale.max,
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
