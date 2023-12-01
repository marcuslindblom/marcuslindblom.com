import { LitElement, html, css, unsafeCSS } from 'lit';
import { subscribe } from '@strifeapp/strife';
import sheet from '../../styles/global.css?inline' assert { type: 'css' };

export class HeroCard extends LitElement {
  static styles = css`
    ${unsafeCSS(sheet)}
  `;
  static properties = {
    heading: { type: String },
    introduction: { type: String },
    avatar: { type: Object },
  };
  constructor() {
    super();
    this.heading = '';
    this.introduction = '';
    this.avatar = {};
  }
  firstUpdated() {
    this.unsubscribe = subscribe(
      (data) =>
        ({ heading: this.heading, introduction: this.introduction, avatar: this.avatar } = data)
    );
  }
  disconnectedCallback() {
    this.unsubscribe();
  }
  render() {
    return html`
      <div class="flex items-center space-x-5 h-card">
        <div class="flex-shrink-0">
          <div class="relative">
            <img
              class="h-16 w-16 lg:h-24 lg:w-24 rounded-full border border-white/10 u-photo"
              src="${this.avatar?.source?.url}"
              is="str-img"
              data-field="avatar"
              alt="image"
              width="96"
              height="96"
            />
            <span
              class="absolute inset-0 rounded-full shadow-inner"
              aria-hidden="true"
            ></span>
          </div>
        </div>
        <div class="pt-1.5">
          <div class="flex items-center gap-2">
            <svg
              width="28"
              height="15"
              viewBox="0 0 33 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <style>
                @media (prefers-color-scheme: light) {
                  path {
                    stroke: #222;
                  }
                }
              </style>
              <path
                d="M27.1161 18.9389C27.1161 18.9389 22.005 19.0046 15.7019 18.9997C4.39963 18.9911 4.23598 18.9894 3.81584 18.8744C1.69263 18.2936 0.488512 16.0397 1.20981 13.9964C1.29857 13.7451 2.40306 11.8204 4.23557 8.72388C5.82294 6.04172 7.2739 3.58753 7.46 3.27011C8.24345 1.93373 9.12583 1.25256 10.3299 1.05461C11.5404 0.855616 12.7232 1.22734 13.5849 2.07761C14.0337 2.52043 14.1487 2.66329 16.187 6.08001M27.1161 18.9389C26.7836 18.9389 24.6014 17.58 24.6014 17.58M27.1161 18.9389C29.6518 18.9775 30.852 18.2279 31.3983 17.6517C31.7536 17.2769 31.8783 16.9659 32.0274 16.4714V16.4714C32.1352 16.1139 32.1301 15.5356 32.0508 15.1706C31.777 13.9107 31.3081 13.8399 26.2798 5.34774C24.4907 2.32612 24.5209 2.37211 24.0428 1.94406C23.2302 1.21672 21.9846 0.862253 20.8987 1.04941C19.9845 1.20691 19.0764 1.75696 18.5412 2.47726C18.4295 2.62766 18.0456 3.22839 17.6882 3.8122L17.0384 4.8737C17.0384 4.8737 16.5195 5.60891 16.187 6.08001M24.6014 17.58C22.4035 16.1817 21.0651 14.2746 17.418 8.14676M24.6014 17.58C21.2331 15.1787 20.4253 12.9501 17.418 8.14676M17.418 8.14676C16.9434 7.34935 16.5369 6.66645 16.187 6.08001"
                stroke="#F2F2F2"
                stroke-width="1.5"
              ></path>
            </svg>
            <h1 class="lg:text-xl text-black dark:text-white p-name">
              ${this.heading}
            </h1>
          </div>
          <p class="text-sm font-light text-neutral-500 p-note">
            Software Engineer in Kalmar, Sweden
          </p>
          <p>
            <a
              class="text-xs underline hover:no-underline duration-200 dark:text-white u-url"
              href="https://marcuslindblom.com/"
              rel="me"
              >marcuslindblom.com</a
            >
          </p>
        </div>
      </div>
    `;
  }
}

customElements.define('hero-card', HeroCard);
