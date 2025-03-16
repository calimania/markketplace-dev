const STRAPI_URL = process.env.REACT_APP_STRAPI_URL || 'https://api.markket.place';
const STORE_SLUG = process.env.REACT_APP_STORE_SLUG || 'markket';
const MARKKET_URL = process.env.REACT_APP_MARKKET_URL || 'https://de.markket.place/';

const config = {
  api_url: STRAPI_URL,
  store_slug: STORE_SLUG,
  markket_url: MARKKET_URL,
};

export default config;
