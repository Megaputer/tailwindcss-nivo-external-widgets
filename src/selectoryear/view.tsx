import * as React from 'react';
import type { ApiRequestor, Table, TConditionNode, WidgetArgs } from 'pa-typings';

import { Selector } from 'components/selector';
import { variantToDate } from 'helper';

import styles from './main.lazy.css';
import '../main.css';

type Data = {
  key: number;
  label: string;
};

interface Props {
  requestor: ApiRequestor;
  args?: WidgetArgs;
  shadowRoot: ShadowRoot;
  parentElement?: HTMLElement;
}

export const SelectorYear: React.FC<Props> = ({ requestor, args, shadowRoot }) => {
  const wrapperGuid = React.useRef<{ wrapperGuid: string }>({ wrapperGuid: '' });
  const [data, setData] = React.useState<Data[]>([]);
  const [isView, setIsView] = React.useState(false);

  React.useEffect(() => {
    // const link = document.createElement('link');
    // link.setAttribute('rel', 'stylesheet');
    // link.setAttribute(
    //   'href',
    //   'https://localhost:9943/$Externals$/widgets/a64b6543-6c5e-4a91-be62-3f7ae8af5877/main.css'
    // );
    // shadowRoot.appendChild(link);

    import('./main.lazy.css').then((style) => {
      if (style?.default?.use) {
        styles.use({ target: shadowRoot });
        setIsView(true);
        console.log('dss');
        // const styleTags = document.getElementsByTagName('style');
        // if (styleTags.length !== 0) {
        //   shadowDom.append((styleTags as any)['tailwindcss']);
        // }
      }
    });
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

      const set = new Set<number>();
      table.forEach(v => {
        const year = variantToDate(+v[1]).getFullYear();
        set.add(year);
      });
      const newData: Data[] = [];
      set.forEach((v) => {
        newData.push({ key: v, label: v.toString() });
      });
      setData(newData);
    };
    fetchData();
  }, [requestor]);

  const onDrillDown = (value: number) => {
    if (value == undefined)
      return;

    const condition: TConditionNode = {
      dVal: value,
      columnName: 'Year'
    };

    args?.openDrillDown(condition);
  };

  if (!isView)
    return null;

  return (
    <Selector
      placeholder='Выбрать год'
      values={data}
      onDrillDown={onDrillDown}
      shadowRoot={shadowRoot}
    />
  );
};
