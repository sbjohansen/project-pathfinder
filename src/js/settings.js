export const select = {
  templateOf: {
    aboutPage: '#template-about-page',
    finderPage: '#template-finder-page',

  },
  containerOf: {
    pages: '#pages',
    aboutPage: '.about-page-wrapper',
    finderPage: '.finder-page-wrapper',
  },
  nav: {
    links: '.navigation-bar a',
  },
};

export const classNames = {
  nav: {
    active: 'active',
  },
  pages: {
    active: 'active',
  },
};

export const settings = {
  
};

export const templates = {
  aboutPage: Handlebars.compile(document.querySelector(select.templateOf.aboutPage).innerHTML),
  finderPage: Handlebars.compile(document.querySelector(select.templateOf.finderPage).innerHTML),

};

export default settings;