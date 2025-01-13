import * as React from 'react';
import type { ApiRequestor, TConditionNode, WidgetArgs } from 'pa-typings';
import { Selector } from 'components/selector';
import { variantToDate } from 'helper';

type Data = {
  key: number;
  label: string;
};

interface Props {
  requestor: ApiRequestor;
  args?: WidgetArgs;
  shadowRoot?: ShadowRoot;
}

const months = [
  { key: 1, label: 'Январь' },
  { key: 2, label: 'Февраль' },
  { key: 3, label: 'Март' },
];

export const SelectorMonth: React.FC<Props> = ({ requestor, args, shadowRoot }) => {
  const wrapperGuid = React.useRef<{ wrapperGuid: string }>({ wrapperGuid: '' });

  const [data, setData] = React.useState<Data[]>([]);
  // const [isView, setIsView] = React.useState(false);

  React.useEffect(() => {
    // const link = document.createElement('link');
    // link.setAttribute('rel', 'stylesheet');
    // link.setAttribute(
    //   'href',
    //   'https://localhost:9943/$Externals$/widgets/a64b6543-6c5e-4a91-be62-3f7ae8af5877/main.css'
    // );
    // shadowRoot.appendChild(link);

    // import('./main.lazy.css').then((style) => {
    //   if (style?.default?.use) {
    //     styles.use({ target: shadowRoot });
    //     setIsView(true);
    //     // const styleTags = document.getElementsByTagName('style');
    //     // if (styleTags.length !== 0) {
    //     //   shadowDom.append((styleTags as any)['tailwindcss']);
    //     // }
    //   }
    // });
  }, [shadowRoot]);

  React.useEffect(() => {
    const fetchData = async () => {
      const guid = wrapperGuid.current = await requestor.wrapperGuid();
      const dsInfo = await requestor.info(guid);

      const { table = [] } = await requestor.values({
        offset: 0,
        rowCount: dsInfo.rowCount,
        wrapperGuid: guid.wrapperGuid
      });

      const setMonth = new Set<number>();
      table.forEach(v => {
        const month = variantToDate(+v[1]).getMonth();
        setMonth.add(month);
      });

      const format = new Intl.DateTimeFormat('ru-RU', { month: 'long' });
      const newData: Data[] = [];
      Array.from(setMonth)
        .sort((a, b) => a - b)
        .forEach((v) => {
          const date = new Date(1990, v, 1);
          const month = format.format(date);
          newData.push({
            key: v + 1,
            label: month.charAt(0).toUpperCase() + month.slice(1)
          });
        });

      setData(newData);
    };
    fetchData();
  }, [requestor]);

  const onDrillDown = (value: number) => {
    if (value == undefined) {
      return;
    }

    const condition: TConditionNode = {
      dVal: value,
      columnName: 'Month'
    };

    args?.openDrillDown(condition);
  };

  // if (!isView)
  //   return null;

  return (
    <Selector
      placeholder='Выбрать месяц'
      values={data}
      // onDrillDown={onDrillDown}
      shadowRoot={shadowRoot}
    />
  );
};
