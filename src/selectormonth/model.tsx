import { createRoot, Root } from 'react-dom/client';
import type { TConditionNode, ApiRequestor, IWidget, WidgetArgs, ApprTab } from 'pa-typings';

import { SelectorMonth } from './view';

import * as css from './styles.module.css';

// import styles from './main.lazy.css';

class SelectorMonthWidget implements IWidget {
  private requestor: ApiRequestor | null = null;
  private root: Root | null = null;
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

    // styles.use({ target: this.shadowRoot });

    // const styleTags = document.getElementsByTagName('style');

    this.root = createRoot(this.shadowRoot);
    this.updateContainer();
  }

  private updateContainer() {
    if (this.root && this.requestor)
      this.root.render(<SelectorMonth
        requestor={this.requestor}
        args={this.args}
        shadowRoot={this.shadowRoot!}
      />);
  }

  getApprSchema(): ApprTab[] | undefined {
    return undefined;
  }

  dispose(): void { }
}

export const create = (args: WidgetArgs) => new SelectorMonthWidget(args);
