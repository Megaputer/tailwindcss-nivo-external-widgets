import { createRoot, Root } from 'react-dom/client';
import type { TConditionNode, ApiRequestor, IWidget, WidgetArgs, ApprTab } from 'pa-typings';

import { SelectorYear } from './view';

import * as css from './styles.module.css';

// import styles from './main.lazy.css';

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
    // parent.classList.add(css.container);
    parent.style.position = 'relative';
    parent.style.height = '100%';
    parent.style.width = '100%';

    this.shadowRoot = parent.attachShadow({ mode: 'open' });

    // styles.use({ target: this.shadowRoot });

    // const link = document.createElement('link');
    // link.setAttribute('rel', 'stylesheet');
    // link.setAttribute('href', `${this.args.getUrlStatics()}/main.css`);
    // this.shadowRoot.appendChild(link);

    this.root = createRoot(this.shadowRoot);
    this.updateContainer();
  }

  private updateContainer() {
    if (this.root && this.requestor)
      this.root.render(<SelectorYear
        requestor={this.requestor}
        args={this.args}
        parentElement={this.parent!}
        shadowRoot={this.shadowRoot!}
      />);
  }

  getApprSchema(): ApprTab[] | undefined {
    return undefined;
  }

  dispose(): void {
    // styles.default.unuset();
  }
}

export const create = (args: WidgetArgs) => new SelectorYearWidget(args);
