import * as React from 'react';
import type { ApiRequestor, Table } from 'pa-typings';
import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/react';

import * as css from './styles.module.css';

type Data = {
  title: string;
  value1: number;
  value2: number;
  value3: number;
};

interface Props {
  requestor: ApiRequestor;
}

export const CardWidget: React.FC<Props> = ({ requestor }) => {
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
              value1: Number(vals[2]),
              value2: Number(vals[3]),
              value3: Number(vals[4])
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
      {data.map(({ title, value1, value2, value3 }, i) => (
        <CardComponent
          key={i}
          title={title}
          value1={value1.toFixed(2)}
          value2={value2.toFixed(2)}
          value3={value3.toFixed(2)}
        />))
      }
    </div>
  );
};

interface CardComponentProps {
  title: string;
  value1: string;
  value2: string;
  value3: string;
}

const CardComponent: React.FC<CardComponentProps> = ({ title, value1, value2, value3 }) => {
  const classes = `bg-transparent opacity-55 hover:opacity-100 hover:bg-sky-500 shadow-xl text-white
    transform transition duration-200 hover:scale-110
    shadow-[0_0_2px_#fff,inset_0_0_2px_#fff,0_0_5px_#08f,0_0_15px_#08f,0_0_30px_#08f]`;

  return (
    <Card
      className={classes}
      shadow='lg'
      fullWidth={true}
    >
      <CardHeader className='h-full text-xl'>
        <div>{title}</div>
      </CardHeader>
      <CardBody className='text-xl'>
        <div>{value1 + 'ppt'}</div>
      </CardBody>
      <CardFooter>
        <div className='grid grid-rows-2 grid-cols-2 w-full'>
          <div className='text-lg'>{value2 + '%'}</div>
          <div className='text-lg'>{value3 + '%'}</div>
          <div>First</div>
          <div>Second</div>
        </div>
      </CardFooter>
    </Card>
  );
};
