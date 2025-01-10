import { createRoot, Root } from 'react-dom/client';
import type { TConditionNode, ApiRequestor, IWidget, WidgetArgs, ApprTab, Value } from 'pa-typings';

import { RadialBarChart } from './view';

import * as css from './styles.module.css';

class RadialBarChartWidget implements IWidget {
  private requestor: ApiRequestor | null = null;
  private root: Root | null = null;
  private condition: TConditionNode | undefined = undefined;

  constructor(private args: WidgetArgs) {}

  updateData(requestor: ApiRequestor): void {
    this.requestor = requestor;
    this.updateContainer();
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
    if (this.root && this.requestor)
      this.root.render(<RadialBarChart
        requestor={this.requestor}
        getApprValue={this.args.getApprValue}
      />);
  }

  private async getColumnOptions() {
    const { wrapperGuid } = await this.requestor!.wrapperGuid();

    if (!this.requestor)
      return [];

    const { columns = [] } = await this.requestor.info({ wrapperGuid });
    return columns.map(c => ({ label: c.title, value: c.id })) as unknown as Value[];
  }

  async updateApprSchema(schema: ApprTab[]): Promise<ApprTab[]> {
    schema = structuredClone(schema);

    const options = await this.getColumnOptions();
    const item = schema[0].items.find(i => i.apprKey === 'columns');
    if (item?.props?.options) {
      item.props.options = [...item.props.options, ...options];
    }
    return schema;
  }

  getApprSchema(): ApprTab[] | undefined {
    return undefined;
  }

  dispose(): void { }
}

export const create = (args: WidgetArgs) => new RadialBarChartWidget(args);
