import * as React from 'react';
import type { ApiRequestor, ApprValue, DatasetInfo } from 'pa-typings';

import { Progress } from '@nextui-org/progress';
import { NextUIProvider } from '@nextui-org/system';

import * as css from './progress.css';

const colors = ['#6b6ef8', '#c654f3', '#3b94fd'];

type Data = {
  title: string;
  value: number;
  color: string;
};

interface Props {
  requestor: ApiRequestor;
  getApprValue: (key: string) => ApprValue | undefined;
}

export const ProgressIndicator: React.FC<Props> = ({ requestor, getApprValue }) => {
  const wrapperGuid = React.useRef<{ wrapperGuid: string }>({ wrapperGuid: '' });

  const [dsInfo, setDsInfo] = React.useState<DatasetInfo>();
  const [data, setData] = React.useState<Data[]>([]);
  const colIds = getApprValue('columns') as unknown as number[];

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

      const { table = [] } = await requestor.values({
        offset: 0,
        rowCount: dsInfo.rowCount,
        columnIndexes: colIds,
        wrapperGuid: wrapperGuid.current.wrapperGuid
      });

      const newData: any[] = [];
      let id = 0;
      for (const colId of colIds) {
        const title = dsInfo.columns[colId].title || 'Unknown column';
        newData.push({
          title,
          value: table[0][id],
          color: colors[id] || 'white'
        });
        id += 1;
      }
      setData(newData);
    };
    getValues();
  }, [dsInfo, colIds.length]);

  if (!colIds.length) {
    return <div className={css.selectColumn}>Select column in the appearance</div>;
  }

  return (
    <div>
      {data.map(({ title, value, color }) => (
        <ProgressBlock
          key={value}
          color={color}
          title={title}
          value={value}
        />))}
    </div>
  );
};

const ProgressBlock: React.FC<Data> = ({ title, value, color }) => {
  const style = { '--custom-bg': color } as React.CSSProperties;
  return (
    <NextUIProvider className='dark'>
      <div className='flex flex-col gap-1 w-full max-w-md text-white pb-[15px]'>
        <div className='grid grid-cols-7 gaps-4'>
          <div className='col-span-3'>{title}</div>
          <div className='col-span-2'>
            <div className='flex flex-row justify-between items-center px-2.5'>
              <TriangleIcon dir={'down'} />
              <span>{`${value.toFixed(2)} ppt`}</span>
            </div>
          </div>
          <div
            className='col-span-1'
            style={{
              display: 'flex',
              justifyContent: 'end'
            }}
          >
            {value.toFixed(2) + '%'}
          </div>
        </div>
        <Progress
          aria-label='Progress'
          value={value}
          color={undefined}
          style={style}
          classNames={{
            indicator: css.bgCustom,
          }}
        />
      </div>
    </NextUIProvider>
  );
};

const TriangleIcon = ({ dir }: { dir: 'up' | 'down' }) => {
  const classesUp = `w-0 h-0
    border-l-[6px] border-l-transparent
    border-b-[10px] border-b-blue-300
    border-r-[6px] border-r-transparent`;

  const classesDown = `w-0 h-0
  border-l-[6px] border-l-transparent
  border-t-[10px] border-t-red-300
  border-r-[6px] border-r-transparent`;

  return (<div className={`${dir == 'up' ? classesUp : classesDown}`} />);
};
