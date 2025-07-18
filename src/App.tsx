'use client'

import { useEffect } from 'react'

import {
  AppShell,
  Container,
  Title,
  Text,
  Paper,
  Group,
  Badge,
  Stack,
  Center,
  Burger,
  ScrollArea,
  UnstyledButton,
  ThemeIcon,
  Divider,
  Button,
} from '@mantine/core'
import { useDisclosure, useLocalStorage } from '@mantine/hooks'
import SumToNSolutions from './components/SumToNSolution'
import CurrencySwapForm from './components/CurrencySwapForm'
import ReactAnalysis from './components/ReactAnalysis'
import {
  Calculator,
  Code,
  DataTransferBoth,
  Github,
  Linkedin,
} from 'iconoir-react'
import { GITHUB_REPO_URL, LINKEDIN_PROFILE_URL, PROBLEM_ID } from './constants'
import type { ProblemIdType } from './types'

const problemAttributes = {
  [PROBLEM_ID.problem1]: {
    id: PROBLEM_ID.problem1,
    navbar: {
      label: 'Sum to N',
      description: 'Three approaches',
      icon: Calculator,
      color: 'blue',
    },
    solutionDetail: {
      themeColor: 'blue',
      title: 'Three Ways to Sum to N',
      description: 'Approaches with performance analysis',
      component: <SumToNSolutions />,
    },
  },
  [PROBLEM_ID.problem2]: {
    id: PROBLEM_ID.problem2,
    navbar: {
      label: 'Currency Swap',
      description: 'Swap tokens with real-time prices',
      icon: DataTransferBoth,
      color: 'green',
    },
    solutionDetail: {
      themeColor: 'green',
      title: 'Currency Swap',
      description: 'Swap tokens with real-time prices',
      component: <CurrencySwapForm />,
    },
  },
  [PROBLEM_ID.problem3]: {
    id: PROBLEM_ID.problem3,
    navbar: {
      label: 'Code Analysis',
      description: 'React optimization review',
      icon: Code,
      color: 'violet',
    },
    solutionDetail: {
      themeColor: 'violet',
      title: 'Code Analysis',
      description: 'React optimization review',
      component: <ReactAnalysis />,
    },
  },
}

function App() {
  const [activeTab, setActiveTab] = useLocalStorage<ProblemIdType>({
    key: PROBLEM_ID.problem1,
    defaultValue: PROBLEM_ID.problem1,
  })
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure()
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true)

  const {
    solutionDetail: { themeColor, title, description, component },
  } = problemAttributes[activeTab]

  useEffect(() => {
    if (!Object.values(PROBLEM_ID).includes(activeTab)) {
      setActiveTab(PROBLEM_ID.problem1)
    }
  }, [activeTab, setActiveTab])

  const handleNavigation = (tabId: ProblemIdType) => {
    setActiveTab(tabId)
    if (mobileOpened) toggleMobile()
  }

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      aside={{
        width: 250,
        breakpoint: 'md',
        collapsed: { desktop: false, mobile: true },
      }}
      padding={{ base: 'xs', sm: 'md' }}
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Group>
            <Burger
              opened={mobileOpened}
              onClick={toggleMobile}
              hiddenFrom="sm"
              size="sm"
            />
            <Burger
              opened={desktopOpened}
              onClick={toggleDesktop}
              visibleFrom="sm"
              size="sm"
            />
            <Group gap="xs">
              <ThemeIcon
                size="lg"
                radius="md"
                variant="gradient"
                gradient={{ from: 'blue', to: 'cyan' }}
              >
                <Code width="20px" height="20px" color="white" />
              </ThemeIcon>
              <div>
                <Title order={3} size="h4">
                  99Tech Code Challenge
                </Title>
                <Text size="xs" c="dimmed">
                  Nguyen Duy Nguyen
                </Text>
              </div>
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section grow my="md" component={ScrollArea}>
          <Stack gap="xs">
            <Text size="xs" tt="uppercase" fw={700} c="dimmed" px="sm">
              Problems
            </Text>
            {Object.values(problemAttributes).map(
              ({ id, navbar: { color, label, description, icon: Icon } }) => (
                <UnstyledButton
                  key={id}
                  onClick={() => handleNavigation(id)}
                  p="sm"
                  style={(theme) => ({
                    borderRadius: theme.radius.md,
                    backgroundColor:
                      activeTab === id ? theme.colors[color][0] : 'transparent',
                    border:
                      activeTab === id
                        ? `1px solid ${theme.colors[color][3]}`
                        : '1px solid transparent',
                    '&:hover': {
                      backgroundColor: theme.colors.gray[0],
                    },
                  })}
                >
                  <Group>
                    <ThemeIcon
                      size="md"
                      radius="md"
                      variant={activeTab === id ? 'filled' : 'light'}
                      color={color}
                    >
                      <Icon
                        width="20px"
                        height="20px"
                        color={activeTab === id ? 'white' : 'currentColor'}
                      />
                    </ThemeIcon>
                    <div style={{ flex: 1 }}>
                      <Text size="sm" fw={500}>
                        {label}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {description}
                      </Text>
                    </div>
                    {activeTab === id && (
                      <Badge size="xs" variant="filled" color={color}>
                        Active
                      </Badge>
                    )}
                  </Group>
                </UnstyledButton>
              )
            )}
          </Stack>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Aside p="md">
        <Stack gap="md">
          <div>
            <Text size="sm" fw={500} mb="xs">
              Tech Stack
            </Text>
            <Stack gap="xs">
              <Badge variant="light" color="blue" size="sm">
                Vite
              </Badge>
              <Badge variant="light" color="cyan" size="sm">
                React 18
              </Badge>
              <Badge variant="light" color="indigo" size="sm">
                TypeScript
              </Badge>
              <Badge variant="light" color="violet" size="sm">
                Mantine v7
              </Badge>
              <Badge variant="light" color="green" size="sm">
                Iconoir
              </Badge>
            </Stack>
          </div>

          <Divider />

          <div>
            <Stack gap="xs">
              <Button
                variant="gradient"
                component="a"
                href={GITHUB_REPO_URL}
                leftSection={<Github width="16px" height="16px" />}
                target="_blank"
                rel="noopener noreferrer"
              >
                Github Repository
              </Button>
              <Button
                variant="outline"
                component="a"
                href={LINKEDIN_PROFILE_URL}
                leftSection={<Linkedin width="16px" height="16px" />}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn Profile
              </Button>
            </Stack>
          </div>
        </Stack>
      </AppShell.Aside>

      <AppShell.Main>
        <Container size="xl" px={{ base: 'xs', sm: 'md' }}>
          <Stack gap="xl">
            <Paper
              shadow="sm"
              p={{ base: 'sm', sm: 'xl' }}
              radius="md"
              bg="linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)"
            >
              <Center>
                <Stack gap="md" align="center">
                  <Title
                    order={1}
                    size="2.5rem"
                    ta="center"
                    c="blue"
                    style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}
                  >
                    Code Challenge Solutions
                  </Title>
                </Stack>
              </Center>
            </Paper>

            <Paper shadow="sm" p={{ base: 'sm', sm: 'xl' }} radius="md">
              <Stack gap="md">
                <Group>
                  <ThemeIcon size="lg" radius="md" color={themeColor}>
                    <Calculator width="20px" height="20px" color="white" />
                  </ThemeIcon>
                  <div>
                    <Title order={2}>{title}</Title>
                    <Text c="dimmed">{description}</Text>
                  </div>
                </Group>
                {component}
              </Stack>
            </Paper>
          </Stack>
        </Container>
      </AppShell.Main>
    </AppShell>
  )
}

export default App
