import * as React from 'react';
import { createRoot, Root } from 'react-dom/client';
import type { TConditionNode, ApiRequestor, IWidget, WidgetArgs, ApprTab, ApprCtrl, ApprValue } from 'pa-typings';

import { LineChartWidget } from './view';

import * as css from './styles.module.css';

type ColumnType = {
  label: string;
  value: string;
};

class LineChartWidgetWidget implements IWidget {
  private requestor: ApiRequestor | null = null;
  private root: Root | null = null;
  private condition: TConditionNode | undefined = undefined;
  private columns: ColumnType[] = [];

  constructor(private args: WidgetArgs) {}

  updateData(requestor: ApiRequestor) {
    this.requestor = requestor;
    this.getColumnOptions()
      .then((columns) => {
        this.columns = columns;
        this.updateContainer();
      });
  }

  onUpdateAppearance() {
    this.updateContainer();
  }

  render(parent: HTMLElement) {
    parent.classList.add(css.container);
    this.root = createRoot(parent);
    this.updateContainer();
  }

  private updateContainer() {
    if (this.root && this.requestor && this.columns.length)
      this.root.render(<LineChartWidget
        requestor={this.requestor}
        getApprValue={this.args.getApprValue}
      />);
  }

  private async getColumnOptions(): Promise<ColumnType[]> {
    const { wrapperGuid } = await this.requestor!.wrapperGuid();

    if (!this.requestor)
      return [];

    const { columns = [] } = await this.requestor.info({ wrapperGuid });
    return columns.map(c => ({ label: c.title, value: c.title }));
  }

  private updateColorAppr(schema: ApprTab[]) {
    const apprItem = schema[0].items.find(i => i.type == 'group' && i.apprKey === 'colors');
    if (apprItem?.items) {
      const columns = this.args.getApprValue('yAxis') as unknown as string[];
      const newItems: Omit<ApprCtrl, 'items'>[] = (columns || []).map((label) => {
        return ({
          label,
          apprKey: `colors/${label}`,
          type: 'color',
          defaultValue: '#ccc'
        });
      });

      apprItem.hidden = !columns.length;
      apprItem.items = newItems;
    }
  }

  async updateApprSchema(schema: ApprTab[]): Promise<ApprTab[]> {
    schema = structuredClone(schema);

    const options = await this.getColumnOptions();
    let item = schema[0].items.find(i => i.apprKey === 'xAxis');
    if (item?.props?.options) {
      item.props.options = options;
    }

    item = schema[0].items.find(i => i.apprKey === 'yAxis');
    if (item?.props?.options) {
      item.props.options = options;
    }

    this.updateColorAppr(schema);
    return schema;
  }

  getApprSchema(): ApprTab[] | undefined {
    return undefined;
  }

  dispose(): void { }
}

export const create = (args: WidgetArgs) => new LineChartWidgetWidget(args);
