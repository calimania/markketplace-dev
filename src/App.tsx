import { useEffect, useState } from 'react';
import { Store } from './api/store';
import { StrapiClient } from './api/api.strapi';
import {
  Container,
  Title,
  Image,
  Text,
  Stack,
  Paper,
  Group,
  Button,
  MantineProvider,
  Skeleton
} from '@mantine/core';
import { IconWorld } from '@tabler/icons-react';
import ReactMarkdown from 'react-markdown';
import '@mantine/core/styles.css';
import { Page } from './api/page';
import PageContent from './components/page.content';


function App() {
  const [store, setStore] = useState<Store | null>(null);
  const [homePage, setHomePage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const client = new StrapiClient();
        const result = await client.getStore();
        const store = result?.data?.[0];

        const pageresult = await client.getPage('home');
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

  return (
    <MantineProvider >
      <Container size="md" py="xl" >
        <Paper shadow="md" radius="md" p="xl" mb="xl">
          <Stack align="center">
            {store.Logo && (
              <Image
                src={store.Logo.formats?.small?.url || store.Logo.url}
                alt={store.title}
                width={200}
                height={200}
                fit="contain"
              />
            )}

            <Title order={1}>
              {store.title}
            </Title>

            {store.Description && (
              <Text size="lg" maw={600}>
                <ReactMarkdown>
                  {store.Description}
                </ReactMarkdown>
              </Text>
            )}

            {store.URLS && store.URLS.length > 0 && (
              <Group mt="md">
                {store.URLS.map((url) => (
                  <Button
                    key={url.id}
                    component="a"
                    href={url.URL}
                    target="_blank"
                    variant="light"
                  >
                    <IconWorld size={18} />{` `}
                    {url.Label}
                  </Button>
                ))}
              </Group>
            )}
          </Stack>
        </Paper>

      </Container >

      <Container>
        {homePage && (
          <PageContent params={{ page: homePage }} />
        )}
      </Container>
    </MantineProvider >
  );
}

export default App;
