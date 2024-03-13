export interface Template {
  name: string;
  displayName: string;
  collection?: string;
  type?: string;
  editors: Editor[];
  templateType: string;
  normalizedName?: string;
  disableURL?: boolean;
  archived?: boolean;
  icon?: string;
  hint?: string;
  searchFields?: string[];
  filterFields?: string[];
}

export interface Editor {
  label: string;
  description?: string;
  editor: {
    name: string;
    propertyName: string;
    type?: string;
    attributes?: {
      autofocus?: boolean;
      required?: boolean;
      width?: number;
      height?: number;
      format?: string;
      multiSelect?: boolean;
      switches?: boolean;
      validationText?: string;
      templateId?: string;
      placeholder?: string;
    };
    options?: {
      availableTypes?: string[];
      allowedCollections?: string[];
      autoCheck?: {
        csrf: string;
        src: string;
      };
      label?: string;
    };
  };
  searchable?: boolean;
  filterable?: boolean;
  protected?: boolean;
}

const home: Template = {
  name: 'home',
  displayName: 'Home',
  collection: 'Homes',
  type: 'Home',
  editors: [
    {
      label: 'Heading',
      editor: {
        name: 'str-input',
        propertyName: 'heading',
        type: 'text',
        attributes: {
          autofocus: false,
        },
      },
      searchable: true,
    },
    {
      label: 'Introduction',
      editor: {
        name: 'str-textarea',
        propertyName: 'introduction',
        type: 'html',
      },
      searchable: true,
    },
    {
      label: 'Avatar',
      editor: {
        name: 'str-image',
        type: 'image',
        propertyName: 'avatar',
        attributes: {
          required: true,
          width: 400,
          height: 400,
          format: 'webp',
        },
      },
      searchable: false,
    },
    {
      label: 'Featured Posts',
      editor: {
        name: 'str-chapters',
        type: 'chapters',
        propertyName: 'featured',
        options: {
          availableTypes: ['featured-post'],
        },
      },
      searchable: false,
    },
    {
      label: 'My assets',
      description: '',
      editor: {
        name: 'str-assets',
        type: 'assets',
        propertyName: 'assets',
      },
      searchable: true,
    },
    {
      label: 'Navigation',
      description: '',
      editor: {
        name: 'str-related',
        type: 'related',
        propertyName: 'navigation',
        options: {
          allowedCollections: ['Navigations'],
        },
      },
    }
  ],
  templateType: 'dt',
  normalizedName: 'home',
  disableURL: false,
  archived: false,
  icon: 'home',
  hint: 'The home page of the site',
};

const article: Template = {
  name: 'article',
  displayName: 'Article',
  collection: 'Articles',
  type: 'Article',
  editors: [
    {
      label: 'Heading',
      editor: {
        name: 'str-input',
        propertyName: 'heading',
        type: 'text',
        attributes: {},
      },
      searchable: true,
    },
    {
      label: 'Summary',
      editor: {
        name: 'str-textarea',
        propertyName: 'summary',
        type: 'html',
        attributes: {},
      },
      searchable: true,
    },
    {
      label: 'Entry',
      editor: {
        name: 'str-textarea',
        propertyName: 'text',
        type: 'html',
        attributes: {},
      },
      searchable: true,
    },
  ],
  templateType: 'dt',
  normalizedName: 'article',
  disableURL: false,
  archived: false,
  icon: 'article',
  hint: 'A single article',
};

const journal: Template = {
  name: 'journal',
  displayName: 'Journal',
  collection: 'Journals',
  type: 'Journal',
  editors: [],
  templateType: 'dt',
  normalizedName: 'journal',
  disableURL: false,
  archived: false,
  icon: 'journal',
  hint: 'A journal entry',
};

const post: Template = {
  name: 'post',
  displayName: 'Post',
  collection: 'Posts',
  type: 'Post',
  editors: [
    {
      label: 'Heading',
      editor: {
        name: 'str-input',
        propertyName: 'heading',
        type: 'text',
        attributes: {},
      },
      searchable: true,
    },
    {
      label: 'Summary',
      editor: {
        name: 'str-textarea',
        propertyName: 'summary',
        type: 'html',
        attributes: {},
      },
      searchable: true,
    },
    {
      label: 'Entry',
      editor: {
        name: 'str-textarea',
        propertyName: 'text',
        type: 'html',
        attributes: {},
      },
      searchable: true,
    },
    {
      label: 'Related',
      description: '',
      editor: {
        name: 'str-related',
        type: 'related',
        attributes: {
          multiSelect: true,
        },
        propertyName: 'related',
        options: {
          allowedCollections: ['Posts','Forms'],
        },
      },
      searchable: true,
      filterable: true,
    },
  ],
  templateType: 'dt',
  normalizedName: 'post',
  disableURL: false,
  archived: false,
  icon: 'post',
  hint: 'A single post',
};

const redirect: Template = {
  name: 'redirect',
  displayName: 'Redirect',
  collection: 'Redirects',
  type: 'Redirect',
  editors: [
    {
      label: 'URL',
      editor: {
        name: 'str-input',
        propertyName: 'url',
        type: 'text',
        attributes: {
          required: true,
          validationText: 'URL cannot be empty',
        },
      },
      searchable: true,
    },
    {
      label: 'Destination',
      editor: {
        name: 'str-input',
        propertyName: 'destination',
        type: 'text',
        attributes: {
          required: true,
          validationText: 'Destination cannot be empty',
        },
      },
      searchable: true,
    },
  ],
  templateType: 'dt',
  normalizedName: 'redirect',
  disableURL: false,
  archived: false,
  icon: 'code',
  hint: 'A single redirect',
};

const file: Template = {
  name: 'file',
  displayName: 'File',
  collection: 'Files',
  editors: [],
  templateType: 'dt',
  normalizedName: 'file',
  disableURL: true,
  archived: false,
  icon: 'file',
  hint: 'A single file',
};

const featured_post: Template = {
  name: 'featured-post',
  collection: 'FeaturedPosts',
  displayName: 'Featured Post',
  editors: [
    {
      label: 'Title',
      description: 'An input for short texts',
      editor: {
        name: 'str-input',
        type: 'text',
        propertyName: 'title',
      },
      searchable: false,
    },
    {
      label: 'Description',
      description: '',
      editor: {
        name: 'str-textarea',
        type: 'text',
        attributes: {
          display: 'text',
        },
        propertyName: 'description',
      },
      searchable: false,
    },
    {
      label: 'Link',
      description: '',
      editor: {
        name: 'str-link',
        type: 'link',
        propertyName: 'link',
      },
      searchable: false,
    },
  ],
  templateType: 'ct',
  normalizedName: 'featured-post',
  disableURL: true,
  archived: false,
  icon: 'edit',
  hint: 'A single featured post',
};

const metadata: Template = {
  name: 'metadata',
  collection: 'Metadata',
  displayName: 'Metadata',
  editors: [
    {
      label: 'Display Name',
      editor: {
        name: 'str-input',
        propertyName: 'displayName',
        type: 'text',
        attributes: {
          required: true,
          validationText: 'Display name cannot be empty',
        },
      },
      protected: true,
    },
    {
      label: 'Slug',
      editor: {
        name: 'str-input',
        propertyName: 'slug',
        type: 'slug',
        attributes: {
          validationText: 'The slug is empty or in use by another page',
          required: true,
        },
        options: {
          autoCheck: {
            csrf: 'slug',
            src: '//api.wieldy.local:5003/content/urlvalidity',
          },
        },
      },
      protected: true,
    },
    {
      label: 'Page Settings',
      description: '',
      editor: {
        name: 'str-content-template',
        propertyName: 'page_settings',
        attributes: {
          templateId: 'page-settings',
        },
      },
    },
    {
      label: 'Published Date',
      editor: {
        name: 'str-input',
        type: 'datetime-local',
        propertyName: 'publishedDate',
        attributes: {},
      },
      protected: true,
    },
    {
      label: 'Search',
      description: '',
      editor: {
        name: 'str-content-template',
        propertyName: 'search_settings',
        attributes: {
          templateId: 'search-settings',
        },
      },
    },
    {
      label: 'Page Images',
      description: '',
      editor: {
        name: 'str-content-template',
        propertyName: 'page_images',
        attributes: {
          templateId: 'page-images',
        },
      },
    },
    {
      label: 'Labels',
      editor: {
        name: 'str-multi-select',
        propertyName: 'labels',
        type: 'label',
        attributes: {
          switches: false,
        },
        options: {
          label: 'Add label',
        },
      },
      protected: true,
    },
  ],
  templateType: 'mt',
  normalizedName: 'metadata',
  disableURL: true,
  archived: false,
  icon: 'pencil',
  hint: 'Metadata for a page',
};

const page_images: Template = {
  name: 'page-images',
  collection: 'PageImages',
  displayName: 'Page Images',
  editors: [
    {
      label: 'Social Image',
      description:
        'Appears when a link to the page is shared on social media. If not set, the social image set on General will be used instead. Recommended size is 1200 × 630 px.',
      editor: {
        name: 'str-image',
        propertyName: 'og_image',
        attributes: {
          width: 1200,
          height: 630,
          format: 'webp',
        },
      },
    },
  ],
  templateType: 'ct',
  normalizedName: 'page-images',
  disableURL: true,
  archived: false,
  icon: 'image',
  hint: 'Images for a page',
};

const search_settings: Template = {
  name: 'search-settings',
  collection: 'SearchSettings',
  displayName: 'Search Settings',
  editors: [
    {
      label: 'Show page in search engines',
      description: '',
      editor: {
        name: 'str-switch',
        type: 'checkbox',
        propertyName: 'show_page_in_search_engines',
      },
    },
    {
      label: 'Show page in Site Search',
      description: '',
      editor: {
        name: 'str-switch',
        type: 'checkbox',
        propertyName: 'show_page_in_site_search',
      },
    },
  ],
  templateType: 'ct',
  normalizedName: 'search-settings',
  disableURL: true,
  archived: false,
  icon: 'search',
  hint: 'Settings for search',
};

const page_settings: Template = {
  name: 'page-settings',
  collection: 'PageSettings',
  displayName: 'Page Settings',
  editors: [
    {
      label: 'Title',
      description: '',
      editor: {
        name: 'str-input',
        type: 'text',
        propertyName: 'title',
        attributes: {
          placeholder: 'My Strife Site',
        },
      },
    },
    {
      label: 'Page Description',
      description: '',
      editor: {
        name: 'str-input',
        type: 'text',
        propertyName: 'description',
        attributes: {
          placeholder: 'Made With Strife',
        },
      },
    },
  ],
  templateType: 'ct',
  normalizedName: 'page-settings',
  disableURL: true,
  archived: false,
  icon: 'settings',
  hint: 'Settings for a page',
};

const form: Template = {
  name: 'form',
  displayName: 'Form',
  collection: 'Forms',
  editors: [
    {
      label: 'Form Name',
      editor: {
        name: 'str-input',
        type: 'text',
        propertyName: 'formName',
        attributes: {
          required: true,
          validationText: 'Form name cannot be empty',
        },
      },
    }
  ],
  templateType: 'dt',
  normalizedName: 'form',
  disableURL: true,
  archived: false,
  icon: 'form',
  hint: 'A single form',
};

const navigation: Template = {
  name: 'navigation',
  displayName: 'Navigation',
  collection: 'Navigations',
  editors: [
    {
      label: 'Navigation Name',
      editor: {
        name: 'str-input',
        type: 'text',
        propertyName: 'navigationName',
        attributes: {
          required: true,
          validationText: 'Navigation name cannot be empty',
        },
      },
    }
  ],
  templateType: 'dt',
  normalizedName: 'navigation',
  disableURL: true,
  archived: false,
  icon: 'navigation',
  hint: 'A single navigation',
};

export const templates = [
  home,
  article,
  journal,
  post,
  redirect,
  file,
  featured_post,
  metadata,
  page_images,
  search_settings,
  page_settings,
  form,
  navigation,
];