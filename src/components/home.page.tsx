import React from 'react'
import {
  Container, Paper, Stack, Title, Button, Box, Overlay, Group
} from '@mantine/core'
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
    <Container size="md" py="xl">
      <Box pos="relative" h={300} mb={50}>
        <Box
          style={{
            backgroundImage: `url(${store?.Cover?.url || store?.SEO?.socialImage?.url || ''})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100%',
            width: '100%',
          }}
        >
          <Overlay
            gradient="linear-gradient(180deg, rgba(36, 85, 214, 0.2) 0%, rgba(36, 85, 214, 0.4) 100%)"
            opacity={0.6}
            zIndex={1}
          />
        </Box>

        <Paper
          pos="absolute"
          left="50%"
          style={{ transform: 'translate(-50%, 50%)' }}
          bottom={0}
          shadow="xl"
          p="xs"
          withBorder
          radius="md"
          bg="white"
          className="z-10"
        >
          {store?.Logo?.url && (
            <img
              src={store.Logo.url}
              alt={store.SEO?.metaTitle}
              width={150}
              height={150}
              className="rounded-md object-contain"
            />
          )}
        </Paper>
      </Box>
      <Paper shadow="md" radius="md" p="xl" mb="xl">
        <Container size="lg" className="pb-20 pt-10">
          <Stack gap="xl">
            <Title className="text-4xl text-center md:text-5xl mb-4">
              {store?.title || store?.SEO?.metaTitle}
            </Title>
          </Stack>
        </Container>
        <Stack align="center">
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
