import * as React from 'react';
import type { ApiRequestor, ApprValue, DatasetInfo } from 'pa-typings';

import { NextUIProvider } from '@nextui-org/system';
import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/card';

type Data = {
  title: string;
  value: number;
  lastYear: number;
  fact: number;
};

interface Props {
  requestor: ApiRequestor;
  getApprValue: (key: string) => ApprValue | undefined;
}

export const CardWidget: React.FC<Props> = ({ requestor, getApprValue }) => {
  const wrapperGuid = React.useRef<{ wrapperGuid: string }>({ wrapperGuid: '' });
  const [data, setData] = React.useState<Data[]>([]);

  const [dsInfo, setDsInfo] = React.useState<DatasetInfo>();
  const columnIndexes = getApprValue('columns') as unknown as number[];

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
        columnIndexes,
        rowCount: 1,
        wrapperGuid: wrapperGuid.current.wrapperGuid
      });

      const newData: any[] = [];
      for (let idx = 0; idx < columnIndexes.length; idx++) {
        const value = Number(table[0][idx]);
        const id = columnIndexes[idx];
        const title = dsInfo.columns[id].title || 'Unknown column';
        newData.push({
          title,
          value: value,
          lastYear: value / 2,
          fact: value / 3
        });
      }
      setData(newData);
    };
    getValues();
  }, [dsInfo, columnIndexes.length]);

  const styles: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    gap: '13px',
    alignItems: 'center',
    fontWeight: 700
  };

  return (
    <NextUIProvider className='dark'>
      <div style={styles}>
        {data.map(({ title, value, lastYear, fact }, i) => (
          <CardComponent
            key={i}
            title={title}
            value={value.toFixed(2)}
            lastYear={lastYear.toFixed(2)}
            fact={fact.toFixed(2)}
          />))
        }
      </div>
    </NextUIProvider>
  );
};

interface CardComponentProps {
  title: string;
  value: string;
  lastYear: string;
  fact: string;
}

const CardComponent: React.FC<CardComponentProps> = ({ title, value, lastYear, fact }) => {
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
        <div>{value + ' ppt'}</div>
      </CardBody>
      <CardFooter>
        <div className='grid grid-rows-2 grid-cols-2 w-full'>
          <div className='text-lg'>{lastYear + '%'}</div>
          <div className='text-lg'>{fact + '%'}</div>
          <div>Last year</div>
          <div>Fact</div>
        </div>
      </CardFooter>
    </Card>
  );
};
