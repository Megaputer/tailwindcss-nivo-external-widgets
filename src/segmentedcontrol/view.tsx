import { useEffect, useState, useRef, type FC } from 'react';

import { NextUIProvider } from '@nextui-org/system';

import { SegmentedControlBase } from 'components/segemented-control-base';

import type { ApiRequestor, Table } from 'pa-typings';

interface Props {
  requestor: ApiRequestor;
}

export const SegmentedControl: FC<Props> = ({ requestor }) => {
  const wrapperGuid = useRef<{ wrapperGuid: string }>({ wrapperGuid: '' });
  const [rowCount, setRowCount] = useState(0);
  const [rowColumn, setColumnCount] = useState(0);
  const [values, setValues] = useState<Table>({ rowIDs: [] });

  const [_, setSelectedValue] = useState('complete');

  useEffect(() => {
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
    <NextUIProvider className='dark'>
      <SegmentedControlBase
        name='group'
        callback={(v: string) => setSelectedValue(v)}
        controlRef={useRef<HTMLDivElement | null>(null)}
        segments={[
          {
            label: 'Month',
            value: 'month',
            ref: useRef<HTMLDivElement | null>(null)
          },
          {
            label: 'Week',
            value: 'week',
            ref: useRef<HTMLDivElement | null>(null)
          },
          {
            label: 'Day',
            value: 'day',
            ref: useRef<HTMLDivElement | null>(null)
          }
        ]}
      />
    </NextUIProvider>
  );
};
