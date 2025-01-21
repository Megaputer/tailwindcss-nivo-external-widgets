import { createRoot, Root } from 'react-dom/client';
import type { TConditionNode, ApiRequestor, IWidget, WidgetArgs, ApprTab, Value, ApprCtrl } from 'pa-typings';

import { ProgressIndicator } from './view';

import '../tailwind.css';
import * as css from './styles.module.css';

class ProgressIndicatorWidget implements IWidget {
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
    this.updateContainer();

    const shadowRoot = parent.attachShadow({ mode: 'open' });
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', this.args.getUrlStatics('main.css'));
    shadowRoot.appendChild(link);

    link.onload = () => {
      this.root = createRoot(shadowRoot);
      this.updateContainer();
    };
  }

  private updateContainer() {
    if (this.root && this.requestor)
      this.root.render(<ProgressIndicator
        requestor={this.requestor}
        getApprValue={this.args.getApprValue}
      />);
  }

  private async getColumnOptions() {
    const { wrapperGuid } = await this.requestor!.wrapperGuid();

    if (!this.requestor)
      return [];

    const { columns = [] } = await this.requestor.info({ wrapperGuid });
    return columns.map(({ title }) => ({ label: title, value: title })) as unknown as Value[];
  }

  private updateColorAppr(schema: ApprTab[]) {
    const apprItem = schema[0].items.find(i => i.type == 'group' && i.apprKey === 'colors');
    if (apprItem?.items) {
      const columns = this.args.getApprValue('columns') as unknown as string[];
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
    const item = schema[0].items.find(i => i.apprKey === 'columns');
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

export const create = (args: WidgetArgs) => new ProgressIndicatorWidget(args);
