import { LitElement, html, css, unsafeCSS } from 'lit';
import { subscribe } from '@strifeapp/strife';
import sheet from '../../styles/global.css?inline' assert { type: 'css' };

export class FeaturedList extends LitElement {
  static styles = [
    css`
      ${unsafeCSS(sheet)}
    `,
  ];
  static properties = {
    items: { type: Array },
  };
  constructor() {
    super();
    this.items = [];
  }
  firstUpdated() {
    this.unsubscribe = subscribe((data) => this.items = data.featured);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.unsubscribe();
  }
  render() {
    return html`
      ${this.items.map(
        (item) => html`
          <div
            class="text-neutral-500 items-start grid grid-cols-1 md:grid-cols-3"
          >
            <div>
              <p class="text-neutral-500 dark:text-neutral-400">Ongoing</p>
            </div>
            <div class="md:col-span-2 w-full">
              <p class="text-black dark:text-white">
                <a
                  href="${item.link?.href}"
                  class="underline hover:no-underline duration-200 after:content-['_↗']"
                >
                  ${item.link?.text}
                </a>
              </p>
              <p>${item.description}</p>
            </div>
          </div>
        `
      )}
    `;
  }
}

customElements.define('featured-list', FeaturedList);
