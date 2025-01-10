import { createRoot, Root } from 'react-dom/client';
import type { TConditionNode, ApiRequestor, IWidget, WidgetArgs, ApprTab, Value } from 'pa-typings';

import { SelectorYear } from './view';

import '../tailwind.css';

import * as css from './styles.module.css';

class SelectorYearWidget implements IWidget {
  private requestor: ApiRequestor | null = null;
  private root: Root | null = null;
  private parent: HTMLElement | null = null;
  private shadowRoot: ShadowRoot | null = null;
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

    this.shadowRoot = parent.attachShadow({ mode: 'open' });
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', this.args.getUrlStatics('main.css'));
    this.shadowRoot?.appendChild(link);

    link.onload = () => {
      this.root = createRoot(this.shadowRoot!);
      this.updateContainer();
    };
  }

  private updateContainer() {
    if (this.root && this.requestor)
      this.root.render(<SelectorYear
        requestor={this.requestor}
        args={this.args}
        parentElement={this.parent!}
        shadowRoot={this.shadowRoot!}
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
    const item = schema[0].items.find(i => i.apprKey === 'column');
    if (item?.props?.options) {
      item.props.options = options;
    }
    return schema;
  }

  getApprSchema(): ApprTab[] | undefined {
    return undefined;
  }

  dispose(): void {
  }
}

export const create = (args: WidgetArgs) => new SelectorYearWidget(args);
