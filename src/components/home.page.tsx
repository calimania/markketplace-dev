import React from 'react'
import { Container, Paper, Stack, Image, Title, Button, Group } from '@mantine/core'
import { IconHeartbeat } from '@tabler/icons-react'
import ReactMarkdown from 'react-markdown'
import PageContent  from './page.content'
import { Page } from '../api/page'
import { Store } from '../api/store'
import Albums from './albums.grid'
import { Album } from '../api/album'

interface PageProps {
  page: Page | null;
  store: Store | null;
}


const PageComponent = ({ page, store }: PageProps) => {
  return (
          <Container size="md" py="xl" id={window.location.hash?.replace('#', '')}>
            <Paper shadow="md" radius="md" p="xl" mb="xl">
              <Stack align="center">
                {store?.Logo && (
                  <Image
                    src={store.Logo.formats?.small?.url || store.Logo.url}
                    alt={store.title}
                    width={200}
                    height={200}
                    fit="contain"
                  />
                )}

                <Title order={1}>
                  {store?.title}
                </Title>

                {store?.Description && (
                  <div className="blocks-content">
                    <ReactMarkdown >
                      {store.Description}
                    </ReactMarkdown>
                  </div>
                )}

                {store?.URLS?.length && (
                  <Group mt="md">
                    {store.URLS.map((url) => (
                      <Button
                        key={url.id}
                        component="a"
                        href={url.URL}
                        target="_blank"
                        variant="light"
                      >
                        <IconHeartbeat size={18} />{` `}
                        {url.Label}
                      </Button>
                    ))}
                  </Group>
                )}
              </Stack>
      </Paper>
      {page && (
        <Paper className='blocks-content' shadow="md" radius="md" p="xl" mb="xl">
          <PageContent params={{ page: page }} />
        </Paper>
      )}

      <Albums store_slug={store?.slug as string} albums={page?.albums as Album[]} />
    </Container >
  )
};

export default PageComponent;
