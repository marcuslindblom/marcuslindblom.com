import { subscribe } from '@strifeapp/strife';
// import { render as renderImage } from '@strifeapp/image';

const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(`
  img {
    --x: 0px;
    --y: 0px;
    --img-previewing-url: '';
    --img-previewing-size: 100%;
    --img-previewing-position: 0px 0px;
    background-image: var(--img-previewing-url);
    background-repeat: no-repeat;
    background-position: var(--img-previewing-position);
    background-size: var(--img-previewing-size);
  }
`);

subscribe((data) => {
  const state = data.avatar;
  const renderedSize = 1;
  const translateX = state.source.originalWidth * (state.source.crop.zoom * renderedSize) * state.source.crop.focusX;
  const translateY = state.source.originalHeight * (state.source.crop.zoom * renderedSize) * state.source.crop.focusY;
  const size = (state.source.originalWidth / 94) * (state.source.crop.zoom * renderedSize);
  // 1180 × 760 px
  // const size = (1180 / 94) * (state.source.crop.zoom * renderedSize);

  stylesheet.replaceSync(`
    img {
      --x: 0px;
      --y: 0px;
      --img-previewing-url: url(//cdn.strife.app/NmLQ0AQz6xPj5l-pgGIVseWRvYvwe0VjofZAQz7LdoA/q:70/aHR0cHM6Ly91cGxvYWRzLnN0cmlmZS5hcHAvTUFSL2NmYjhkOTVhLTQ0OTctNDI5Yy1hODQ1LWU1MDc0ZDc1YWJiMi9vcmlnaW5hbC5qcGVn.webp);
      --img-previewing-size: calc(100% * ${size});
      --img-previewing-position: calc(50% - var(--x)) calc(50% - var(--y));
      background-image: var(--img-previewing-url);
      background-repeat: no-repeat;
      background-position: var(--img-previewing-position);
      background-size: var(--img-previewing-size);
    }`);
  });

export default stylesheet