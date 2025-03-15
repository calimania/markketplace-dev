import { StrapiResponse, FetchOptions } from '.';
import { Store } from './store';
import { Page } from './page';
import qs from 'qs';
import Config from '../config';

export type { StrapiResponse, FetchOptions };

interface FilterOperator {
  operator: '$eq' | '$contains' | '$in' | '$gt' | '$lt' | '$gte' | '$lte' | '$ne';
  value: string | number | boolean | Array<any>;
};

interface FilterValue {
  [key: string]: string | number | boolean | FilterOperator | { [key: string]: FilterValue };
};

interface EnhancedFetchOptions extends Omit<FetchOptions, 'filters'> {
  filters?: {
    [key: string]: FilterValue | string | number | boolean;
  };
};

export class StrapiClient {
  private baseUrl: string;
  private storeSlug: string;

  constructor() {
    this.baseUrl = Config.api_url;
    this.storeSlug = Config.store_slug;
  }

  private buildFilterString(filters: any): string {
    return qs.stringify({ filters }, {
      arrayFormat: 'brackets',
      encodeValuesOnly: true,
    });
  };


  private buildUrl(options: EnhancedFetchOptions): string {
    const { contentType, filters, populate, paginate, sort } = options;
    const params = new URLSearchParams();

    const filterString = this.buildFilterString(filters);

    if (populate) {
      const fields = Array.isArray(populate) ? populate : populate.split(',');
      fields.forEach(field => params.append('populate[]', field.trim()));
    }

    if (paginate?.limit) params.append('pagination[limit]', paginate.limit.toString());
    if (paginate?.page) params.append('pagination[page]', paginate.page.toString());
    if (paginate?.pageSize) params.append('pagination[pageSize]', paginate.pageSize.toString());
    if (sort) params.append('sort', sort);

    const url = new URL(`api/${contentType}?${filterString}&${params.toString()}`, this.baseUrl);

    return url.toString();
  }

  async fetch<T>(options: FetchOptions): Promise<StrapiResponse<T>> {
    const url = this.buildUrl(options);

    console.info({ url });

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${options.contentType}`);
    }

    return response.json();
  };


  async getProduct(product_slug: string, store_slug: string) {
    return this.fetch({
      contentType: 'products',
      filters:
      {
        stores: {
          slug: {
            $eq: store_slug || this.storeSlug,
          }
        },
        slug: {
          $eq: product_slug
        }
      },
      populate: 'SEO.socialImage,Thumbnail,Slides,PRICES,stores'
    });
  }

  async getProducts(paginate: { page: number; pageSize: number }, options: { filter: string, sort: string }, store_slug: string) {
    const { sort } = options;

    return this.fetch({
      contentType: 'products',
      filters:
      {
        stores: {
          slug: {
            $eq: store_slug,
          }
        }
      },
      sort,
      paginate,
      populate: 'SEO.socialImage,Thumbnail,Slides,PRICES,stores'
    });
  }

  async getEvents(store_slug: string = this.storeSlug) {
    return this.fetch({
      contentType: 'events',
      filters: {
        stores: {
          slug: {
            $eq: store_slug,
          }
        }
      },
      populate: 'SEO,SEO.socialImage,Tag,Thumbnail,Slides,stores'
    });
  }

  async getEventBySlug(event_slug: string, store_slug: string = this.storeSlug) {
    return this.fetch({
      contentType: 'events',
      filters: {
        stores: {
          slug: {
            $eq: store_slug,
          }
        },
        slug: {
          $eq: event_slug
        }
      },
      populate: 'SEO,SEO.socialImage,Tag,Thumbnail,Slides,stores'
    });
  }

  async getStore(slug = this.storeSlug) {
    return await this.fetch<Store>({
      contentType: `stores`,
      filters: { slug },
      populate: 'Logo,SEO.socialImage,Favicon,URLS,Cover',
    });
  }


  /**
   * Returns a page by its slug
   * @param slug
   * @returns
   */
  async getPages(store_slug: string = this.storeSlug) {

    return this.fetch<Page>({
      contentType: `pages`,
      filters: {
        Active: {
          $eq: true
        },
        store: {
          slug: {
            $eq: store_slug
          }
        }
      },
      populate: 'SEO.socialImage'
    });
  };

  /**
   * Returns a page by its slug
   * @param slug
   * @returns
   */
  async getPage(slug: string, store_slug: string = this.storeSlug) {

    return await this.fetch<Page>({
      contentType: `pages`,
      filters: {
        store: {
          slug: {
            $eq: store_slug
          }
        },
        slug: {
          $eq: slug
        },
      },
      paginate: { page: 1, pageSize: 10 },
      populate: 'SEO.socialImage,store,albums,albums.cover,albums.SEO,albums.tracks'
    });
  };

  /**
   * Requests stores from the strapi / markket api, including pagination, to display in our /stores ,
   * including filters to search for by some attributes like name, slug, title or description using the same keyword
   */
  async getStores(paginate: { page: number; pageSize: number }, options: { filter: string, sort: string }) {
    const { sort } = options;

    return await this.fetch<Store>({
      contentType: 'stores',
      populate: 'Logo,SEO,SEO.socialImage,Favicon,URLS',
      filters: {
        active: {
          $eq: true
        }
      },
      paginate,
      sort,
    });
  };

  async getPosts(paginate: { page: number; pageSize: number }, options: { filter?: string, sort: string }, store_slug?: string) {
    const { sort } = options;

    return this.fetch({
      contentType: 'articles',
      sort,
      filters: {
        store: {
          slug: {
            $eq: store_slug || this.storeSlug
          },
        }
      },
      paginate,
      populate: 'SEO.socialImage,Tags,cover,store',
    });
  }

  async getPost(article_slug: string, store_slug?: string) {

    return await this.fetch({
      contentType: 'articles',
      filters: {
        slug: {
          $eq: article_slug
        },
        store: {
          slug: {
            $eq: store_slug || this.storeSlug
          },
        }
      },
      populate: 'SEO.socialImage,Tags,cover,store',
      sort: 'createdAt:desc',
    });
  }

  /** Requests related Album */
  async getAlbum(album_slug: string, store_slug?: string) {

    return await this.fetch({
      contentType: 'albums',
      filters: {
        slug: {
          $eq: album_slug,
        },
        store: {
          slug: {
            $eq: store_slug || this.storeSlug
          },
        }
      },
      populate: 'SEO.socialImage,tracks,tracks.SEO,tracks.SEO.socialImage,tracks.media,tracks.urls,cover',
      sort: 'createdAt:desc',
    });
  };
};

export const strapiClient = new StrapiClient();
