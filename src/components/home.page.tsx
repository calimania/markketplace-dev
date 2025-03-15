import React from 'react'
import { Container, Paper, Stack, Image, Title, Button, Group } from '@mantine/core'
import { IconHeartbeat } from '@tabler/icons-react'
import ReactMarkdown from 'react-markdown'
import PageContent  from './page.content'
import { Page } from '../api/page'
import { Store } from '../api/store'

interface PageProps {
  homePage: Page | null;
  store: Store | null;
}


const PageComponent = ({homePage, store} : PageProps) => {
  return (
    <>
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

          </Container >

          <Container>
            <div className="blocks-content">
              {homePage && (
                <PageContent params={{ page: homePage }} />
              )}
            </div>
          </Container>
        </>
  )
};

export default PageComponent;
