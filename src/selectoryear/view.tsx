import * as React from 'react';
import type { ApiRequestor, ApprValue, DatasetInfo, TConditionNode, WidgetArgs } from 'pa-typings';

import { Selector } from 'components/selector';
import { variantToDate } from 'helper';

type Data = {
  key: number;
  label: string;
};

interface Props {
  requestor: ApiRequestor;
  args?: WidgetArgs;
  getApprValue: (key: string) => ApprValue | undefined;
  shadowRoot: ShadowRoot;
  parentElement?: HTMLElement;
}

export const SelectorYear: React.FC<Props> = (props) => {
  const { requestor, args, getApprValue, shadowRoot } = props;

  const wrapperGuid = React.useRef<{ wrapperGuid: string }>({ wrapperGuid: '' });
  const [dsInfo, setDsInfo] = React.useState<DatasetInfo | undefined>();
  const [data, setData] = React.useState<Data[]>([]);

  const columnId = getApprValue('column');
  const placeholder = getApprValue('placeholder')?.toString();
  const period = getApprValue('period')?.toString();

  React.useEffect(() => {
    const fetchData = async () => {
      const guid = wrapperGuid.current = await requestor.wrapperGuid();
      const dsInfo = await requestor.info(guid);
      setDsInfo(dsInfo);
    };
    fetchData();
  }, [requestor]);

  React.useEffect(() => {
    const getValue = async () => {
      const column = dsInfo?.columns.find(c => c.id === +columnId!);
      if (column == undefined || dsInfo == undefined || !period)
        return;

      const { table = [] } = await requestor.values({
        offset: 0,
        columnIndexes: [column.id],
        rowCount: dsInfo.rowCount,
        wrapperGuid: wrapperGuid.current.wrapperGuid
      });

      const set = new Set<number>();
      table.forEach(v => {
        const value = +v[0];
        const val = column.type == 'Integer' ? value : getPeriodValue(period, value);
        set.add(val);
      });

      const newData: Data[] = [];
      set.forEach((v) => {
        const data = getPeriodName(period, v, column.type);
        newData.push(data);
      });
      setData(newData.sort((a, b) => a.key - b.key));
    };
    getValue();
  }, [dsInfo, period, columnId]);

  const onDrillDown = (value?: number) => {
    const column = dsInfo?.columns.find(c => c.id === +columnId!);
    if (column == undefined)
      return;

    if (value == undefined) {
      args?.openDrillDown({});
      return;
    }

    const condition: TConditionNode = {
      dVal: value,
      columnName: column.title
    };

    args?.openDrillDown(condition);
  };

  return (
    <Selector
      placeholder={placeholder}
      values={data}
      onDrillDown={onDrillDown}
      shadowRoot={shadowRoot}
    />
  );
};

function getPeriodValue(period: string, val: number) {
  switch (period) {
    case 'year':
      return variantToDate(val).getFullYear();
    case 'month':
      return variantToDate(val).getMonth();
    case 'weekday':
      return variantToDate(val).getDay();
    default:
      return NaN;
  }
}

const formatMonth = new Intl.DateTimeFormat('ru-RU', { month: 'long' });
const formatWeekDay = new Intl.DateTimeFormat('ru-RU', { weekday: 'long' });
function getPeriodName(period: string, value: number, type: string) {
  switch (period) {
    case 'year':
      return ({ key: value, label: value.toString() });

    case 'month': {
      if (type == 'Integer') {
        value -= 1;
      }
      const date = new Date(1990, value, 1);
      const month = formatMonth.format(date);
      return ({
        key: value + 1,
        label: month.charAt(0).toUpperCase() + month.slice(1)
      });
    }

    case 'weekday': {
      const date = new Date(1990, value, 1);
      const weekDay = formatWeekDay.format(date);
      return ({
        key: value + 1,
        label: weekDay.charAt(0).toUpperCase() + weekDay.slice(1)
      });
    }

    default:
      return { key: -1, label: '' };
  }
}
