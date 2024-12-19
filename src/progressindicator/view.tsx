import * as React from 'react';
import type { ApiRequestor, Table } from 'pa-typings';
import { Progress } from '@nextui-org/progress';

import * as css from './styles.module.css';

const colors = ['#6b6ef8', '#c654f3', '#3b94fd'];

type Data = {
  title: string;
  value: number;
  color: string;
};

interface Props {
  requestor: ApiRequestor;
}

export const ProgressIndicator: React.FC<Props> = ({ requestor }) => {
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

      const newData: any[] = [];
      let id = 0;
      for (const col of dsInfo.columns) {
        if (col.type === 'Numeric') {
          for (const vals of values.table?.slice(0, 1) || []) {
            newData.push({
              title: col.title,
              value: Number(vals[col.id]),
              color: colors[id]
            });
          }
          id += 1;
        }
      }
      setData(newData);
    };
    fetchData();
  }, [requestor]);

  return (
    <div className={css.main}>
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
  return (
    <div className='flex flex-col gap-3 w-full max-w-md text-white'>
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
        classNames={{
          indicator: `bg-[${color}]`,
        }}
      />
    </div>
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
