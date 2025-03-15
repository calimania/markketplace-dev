const STRAPI_URL = process.env.REACT_APP_STRAPI_URL || 'https://api.markket.place';
const STORE_SLUG = process.env.REACT_APP_STORE_SLUG || 'markket';

const config = {
  api_url: STRAPI_URL,
  store_slug: STORE_SLUG,
};

export default config;
