import { useEffect, useState } from 'react';
import { Store } from './api/store';
import { StrapiClient } from './api/api.strapi';
import {
  Container,
  Text,
  MantineProvider,
  Skeleton
} from '@mantine/core';
import '@mantine/core/styles.css';
import './styles/blocks.scss';
import { Page } from './api/page';
import config from './config';
import { PostHogProvider } from 'posthog-js/react'

import HomePage from './components/home.page';

const POSTHOG_API_KEY = process.env.REACT_APP_POSTHOG_KEY as string;

/**
 * Landing page component
 * - Displays store basics, and home page content
 *
 * @returns React.ReactElement
 */
function App() {
  const [store, setStore] = useState<Store | null>(null);
  const [homePage, setHomePage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pathSegments = window?.location?.hash?.replace('#/', '')?.split('/') || [];
    const store_slug = pathSegments[0] || config.store_slug;
    const page_slug = pathSegments[1] || 'home';

    const fetchData = async () => {
      try {
        const client = new StrapiClient();
        const result = await client.getStore(store_slug);
        const store = result?.data?.[0];

        const pageresult = await client.getPage(page_slug, store_slug);
        const homePage = pageresult?.data?.[0];

        setHomePage(homePage);
        setStore(store);
      } catch (error) {
        console.error('Failed to fetch store:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <MantineProvider>
        <Container size="md" py="xl">
          <Skeleton height={200} radius="md" mb="xl" />
          <Skeleton height={50} radius="md" mb="md" />
          <Skeleton height={100} radius="md" />
        </Container>
      </MantineProvider>
    );
  }

  if (!store) {
    return (
      <MantineProvider>
        <Container size="md">
          <Text>Store not found</Text>
        </Container>
      </MantineProvider>
    );
  }

  if (POSTHOG_API_KEY) {
    return (
      <PostHogProvider apiKey={POSTHOG_API_KEY}>
        <MantineProvider>
          <HomePage homePage={homePage} store={store} />
        </MantineProvider>
      </PostHogProvider>
    );
  }

  return (
    <MantineProvider>
      <HomePage homePage={homePage} store={store} />
    </MantineProvider>
  )
};

export default App;
