'use client'

import { useState } from 'react'
import {
  Button,
  TextInput,
  Paper,
  Group,
  Stack,
  Title,
  Text,
  Badge,
  Grid,
  Code,
  Loader,
  Progress,
  Card,
  RingProgress,
  Center,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { Clock, InfoCircle, Play, Refresh } from 'iconoir-react'

const sum_to_n_a = (n: number): number => {
  let sum = 0
  for (let i = 1; i <= n; i++) {
    sum += i
  }
  return sum
}

const sum_to_n_b = (n: number): number => {
  return (n * (n + 1)) / 2
}

const sum_to_n_c = (n: number): number => {
  if (n <= 1) {
    return n
  }
  return n + sum_to_n_c(n - 1)
}

interface SolutionResult {
  result: number
  executionTime: number
  method: string
  complexity: string
  description: string
}

export default function SumToNSolutions() {
  const [input, setInput] = useState<string>('5')
  const [results, setResults] = useState<SolutionResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)

  const runSolutions = async () => {
    const n = Number.parseInt(input)
    if (isNaN(n) || n < 0) {
      notifications.show({
        title: 'Invalid Input',
        message: 'Please enter a valid positive integer',
        color: 'red',
      })
      return
    }

    if (n > 10000) {
      notifications.show({
        title: 'Large Number Warning',
        message:
          'Large numbers may cause performance issues with recursive approach',
        color: 'yellow',
      })
    }

    setIsRunning(true)
    setProgress(0)
    const newResults: SolutionResult[] = []

    const methods = [
      {
        func: sum_to_n_a,
        name: 'Iterative Loop',
        complexity: 'O(n)',
        description: 'Simple and readable',
      },
      {
        func: sum_to_n_b,
        name: 'Math Formula (n * (n + 1) / 2)',
        complexity: 'O(1)',
        description: 'Most efficient',
      },
      {
        func: sum_to_n_c,
        name: 'Recursive',
        complexity: 'O(n)',
        description: 'Pretty good approach but might crash with big numbers 😅',
      },
    ]

    for (let i = 0; i < methods.length; i++) {
      const method = methods[i]
      setProgress(((i + 1) / methods.length) * 100)

      const startTime = performance.now()
      const result = method.func(n)
      const endTime = performance.now()

      newResults.push({
        result,
        executionTime: endTime - startTime,
        method: method.name,
        complexity: method.complexity,
        description: method.description,
      })

      await new Promise((resolve) => setTimeout(resolve, 300))
    }

    setResults(newResults)
    setIsRunning(false)
    setProgress(100)

    notifications.show({
      title: 'Solutions Complete',
      message: `All three methods calculated sum to ${n} successfully!`,
      color: 'green',
    })
  }

  const reset = () => {
    setResults([])
    setInput('5')
    setProgress(0)
  }

  return (
    <Stack gap="xl">
      <Paper shadow="xs" p={{ base: 'sm', sm: 'md' }} radius="md" bg="gray.0">
        <Group align="flex-end" justify="space-between">
          <TextInput
            label="Enter a number (n)"
            placeholder="Enter a positive integer"
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
            type="number"
            w={{
              base: '100%',
              sm: '400px',
            }}
          />
          <Group
            grow
            w={{
              base: '100%',
              sm: '400px',
            }}
            justify="flex-end"
          >
            <Button
              onClick={runSolutions}
              disabled={isRunning}
              leftSection={
                isRunning ? (
                  <Loader size={16} />
                ) : (
                  <Play width="16px" height="16px" />
                )
              }
              w="max-content"
            >
              {isRunning ? 'Running...' : 'Run Solutions'}
            </Button>
            <Button
              variant="outline"
              onClick={reset}
              leftSection={<Refresh width="16px" height="16px" />}
              w="max-content"
            >
              Reset
            </Button>
          </Group>
        </Group>

        {isRunning && <Progress value={progress} animated mt="md" />}
      </Paper>

      {results.length > 0 && (
        <Grid>
          {results.map((result, index) => (
            <Grid.Col key={index} span={{ base: 12, md: 4 }}>
              <Card
                shadow="sm"
                padding="lg"
                px={{ base: 'sm', sm: 'lg' }}
                py={{ base: 'sm', sm: 'lg' }}
                radius="md"
                withBorder
                h="100%"
              >
                <Stack gap="sm">
                  <Group justify="space-between">
                    <Title order={4}>
                      Method {String.fromCharCode(65 + index)}
                    </Title>
                    <Badge
                      variant="light"
                      leftSection={<Clock width="16px" height="16px" />}
                      color="blue"
                    >
                      {result.executionTime.toFixed(3)}ms
                    </Badge>
                  </Group>

                  <Text size="sm" c="dimmed">
                    {result.method}
                  </Text>

                  <Center>
                    <RingProgress
                      size={120}
                      thickness={8}
                      sections={[{ value: 100, color: 'blue' }]}
                      label={
                        <Text size="xl" fw={700} ta="center" c="blue">
                          {result.result.toLocaleString()}
                        </Text>
                      }
                    />
                  </Center>

                  <Group gap="xs" justify="center">
                    <Badge variant="outline" size="sm">
                      {result.complexity}
                    </Badge>
                    <Text size="xs" c="dimmed" ta="center">
                      {result.description}
                    </Text>
                  </Group>
                </Stack>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      )}

      <Paper shadow="sm" p={{ base: 'md', sm: 'xl' }} radius="md" bg="gray.0">
        <Stack gap="lg">
          <Group>
            <InfoCircle color="var(--mantine-color-blue-6)" />
            <Title order={3}>Implementation Details</Title>
          </Group>

          <Stack gap="md">
            <Card
              shadow="xs"
              padding="md"
              px={{ base: 'sm', sm: 'md' }}
              py={{ base: 'sm', sm: 'md' }}
              radius="md"
              withBorder
            >
              <Title order={5} mb="xs">
                Method A: Loop
              </Title>
              <Code block>
                {`var sum_to_n_a = function(n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};`}
              </Code>
            </Card>

            <Card
              shadow="xs"
              padding="md"
              px={{ base: 'sm', sm: 'md' }}
              py={{ base: 'sm', sm: 'md' }}
              radius="md"
              withBorder
            >
              <Title order={5} mb="xs">
                Method B: Math Formula
              </Title>
              <Code block>
                {`var sum_to_n_b = function(n) {
  // Sum = n * (n + 1) / 2
  return (n * (n + 1)) / 2;
};`}
              </Code>
            </Card>

            <Card
              shadow="xs"
              padding="md"
              px={{ base: 'sm', sm: 'md' }}
              py={{ base: 'sm', sm: 'md' }}
              radius="md"
              withBorder
            >
              <Title order={5} mb="xs">
                Method C: Recursive
              </Title>
              <Code block>
                {`var sum_to_n_c = function(n) {
  if (n <= 1) {
    return n;
  }
  return n + sum_to_n_c(n - 1);
};`}
              </Code>
            </Card>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  )
}
