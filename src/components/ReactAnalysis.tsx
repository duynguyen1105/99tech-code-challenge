'use client'

import { useState } from 'react'
import {
  Paper,
  Stack,
  Title,
  Text,
  Badge,
  Tabs,
  Alert,
  Grid,
  Code,
  Group,
  Card,
} from '@mantine/core'
import {
  CheckCircle,
  CheckCircleSolid,
  InfoCircle,
  WarningCircleSolid,
  Code as CodeIcon,
  LightBulb,
} from 'iconoir-react'
import { SeverityType } from '../types'
import { SEVERITY } from '../constants'

const ISSUES = [
  {
    id: 1,
    severity: SEVERITY.HIGH,
    category: 'Logic Error',
    title: 'Undefined Variable Reference',
    description:
      'lhsPriority is used but never defined. Should be balancePriority.',
    line: 'if (lhsPriority > -99)',
    fix: 'if (balancePriority > -99)',
  },
  {
    id: 2,
    severity: SEVERITY.HIGH,
    category: 'Logic Error',
    title: 'Incorrect Filter Logic',
    description:
      'Filtering balances <= 0 when priority > -99 seems backwards. Should filter positive balances.',
    line: 'if (balance.amount <= 0) { return true; }',
    fix: 'if (balance.amount > 0) { return true; }',
  },
  {
    id: 3,
    severity: SEVERITY.MEDIUM,
    category: 'Type Safety',
    title: 'Missing Interface Property',
    description:
      'blockchain property is used but not defined in WalletBalance interface.',
    line: 'balance.blockchain',
    fix: 'Add blockchain: string to WalletBalance interface',
  },
  {
    id: 4,
    severity: SEVERITY.MEDIUM,
    category: 'Performance',
    title: 'Unused Dependency in useMemo',
    description:
      'prices is listed as dependency but never used in the computation.',
    line: '[balances, prices]',
    fix: 'Remove prices from dependency array or use it in computation',
  },
  {
    id: 5,
    severity: SEVERITY.MEDIUM,
    category: 'Performance',
    title: 'Inefficient Data Transformation',
    description:
      'formattedBalances is created but never used. Mapping is done twice unnecessarily.',
    line: 'const formattedBalances = sortedBalances.map(...)',
    fix: 'Combine formatting with the final mapping or use formattedBalances',
  },
  {
    id: 6,
    severity: SEVERITY.LOW,
    category: 'Best Practices',
    title: 'Array Index as Key',
    description: 'Using array index as React key can cause rendering issues.',
    line: 'key={index}',
    fix: 'key={balance.currency} or use a unique identifier',
  },
  {
    id: 7,
    severity: SEVERITY.LOW,
    category: 'Logic Error',
    title: 'Incomplete Sort Function',
    description: 'Sort function missing return 0 for equal priorities.',
    line: 'Missing return statement',
    fix: 'Add return 0 after the if-else chain',
  },
  {
    id: 8,
    severity: SEVERITY.LOW,
    category: 'Type Safety',
    title: 'Type Mismatch in Mapping',
    description:
      'Mapping over sortedBalances but expecting FormattedWalletBalance type.',
    line: '(balance: FormattedWalletBalance, index: number)',
    fix: 'Use formattedBalances or change type to WalletBalance',
  },
]

export default function ReactAnalysis() {
  const [activeTab, setActiveTab] = useState<string | null>('issues')

  const getSeverityColor = (severity: SeverityType) => {
    switch (severity) {
      case SEVERITY.HIGH:
        return 'red'
      case SEVERITY.MEDIUM:
        return 'yellow'
      case SEVERITY.LOW:
        return 'blue'
      default:
        return 'gray'
    }
  }

  const getSeverityIcon = (severity: SeverityType) => {
    switch (severity) {
      case SEVERITY.HIGH:
        return <WarningCircleSolid width={16} height={16} />
      case SEVERITY.MEDIUM:
        return <CodeIcon width={16} height={16} />
      case SEVERITY.LOW:
        return <LightBulb width={16} height={16} />
      default:
        return <CodeIcon width={16} height={16} />
    }
  }

  return (
    <Stack gap="lg">
      <Alert
        icon={<CheckCircle width="16px" height="16px" />}
        color="green"
        variant="light"
      >
        Found {ISSUES.length} issues in the provided React code. Click through
        the tabs below to see detailed analysis and refactored code.
      </Alert>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List grow>
          <Tabs.Tab value="issues">Issues Found</Tabs.Tab>
          <Tabs.Tab value="original">Original Code</Tabs.Tab>
          <Tabs.Tab value="refactored">Refactored Code</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="issues" pt="md">
          <Grid>
            {ISSUES.map((issue) => (
              <Grid.Col key={issue.id} span={12}>
                <Card
                  shadow="sm"
                  padding="md"
                  px={{ base: 'sm', sm: 'md' }}
                  py={{ base: 'sm', sm: 'md' }}
                  radius="md"
                  withBorder
                >
                  <Stack gap="sm">
                    <Group justify="space-between">
                      <Group gap="xs">
                        {getSeverityIcon(issue.severity)}
                        <Title order={4}>{issue.title}</Title>
                      </Group>
                      <Group gap="xs">
                        <Badge
                          color={getSeverityColor(issue.severity)}
                          variant="light"
                        >
                          {issue.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">{issue.category}</Badge>
                      </Group>
                    </Group>

                    <Text size="sm" c="dimmed">
                      {issue.description}
                    </Text>

                    <Stack gap="xs">
                      <Paper
                        shadow="xs"
                        p="xs"
                        px={{ base: 'xs', sm: 'xs' }}
                        py={{ base: 'xs', sm: 'xs' }}
                        radius="sm"
                        bg="red.0"
                      >
                        <Text size="sm" fw={500} c="red">
                          Problematic Code:
                        </Text>
                        <Code color="red">{issue.line}</Code>
                      </Paper>
                      <Paper
                        shadow="xs"
                        p="xs"
                        px={{ base: 'xs', sm: 'xs' }}
                        py={{ base: 'xs', sm: 'xs' }}
                        radius="sm"
                        bg="green.0"
                      >
                        <Text size="sm" fw={500} c="green">
                          Suggested Fix:
                        </Text>
                        <Code color="green">{issue.fix}</Code>
                      </Paper>
                    </Stack>
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="original" pt="md">
          <Card
            shadow="sm"
            padding="md"
            px={{ base: 'sm', sm: 'md' }}
            py={{ base: 'sm', sm: 'md' }}
            radius="md"
            withBorder
          >
            <Stack gap="md">
              <Group>
                <InfoCircle color="var(--mantine-color-blue-6)" />
                <Title order={3}>Original Code (with issues highlighted)</Title>
              </Group>
              <Text c="dimmed">
                The problematic React component as provided
              </Text>
              <Code block>
                {`interface WalletBalance {
  currency: string;
  amount: number;
  // ❌ Missing: blockchain: string;
}

interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const getPriority = (blockchain: any): number => {
    switch (blockchain) {
      case 'Osmosis':
        return 100
      case 'Ethereum':
        return 50
      case 'Arbitrum':
        return 30
      case 'Zilliqa':
        return 20
      case 'Neo':
        return 20
      default:
        return -99
    }
  }

  const sortedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
      const balancePriority = getPriority(balance.blockchain);
      // ❌ lhsPriority is undefined
      if (lhsPriority > -99) {
        // ❌ Logic seems backwards - filtering amount <= 0?
        if (balance.amount <= 0) {
          return true;
        }
      }
      return false
    }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
      const leftPriority = getPriority(lhs.blockchain);
      const rightPriority = getPriority(rhs.blockchain);
      if (leftPriority > rightPriority) {
        return -1;
      } else if (rightPriority > leftPriority) {
        return 1;
      }
      // ❌ Missing return 0 for equal priorities
    });
    // ❌ prices dependency is unused
  }, [balances, prices]);

  // ❌ formattedBalances is created but never used
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed()
    }
  })

  // ❌ Mapping over sortedBalances but expecting FormattedWalletBalance
  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow 
        // ❌ classes.row is undefined
        className={classes.row}
        // ❌ Using index as key
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    )
  })

  return (
    <div {...rest}>
      {rows}
    </div>
  )
}`}
              </Code>
            </Stack>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="refactored" pt="md">
          <Stack gap="md">
            <Card
              shadow="sm"
              padding="md"
              px={{ base: 'sm', sm: 'md' }}
              py={{ base: 'sm', sm: 'md' }}
              radius="md"
              withBorder
            >
              <Stack gap="md">
                <Group>
                  <CheckCircleSolid color="var(--mantine-color-green-6)" />
                  <Title order={3}>Refactored Code</Title>
                </Group>
                <Text c="dimmed">
                  Clean, efficient, and properly typed React component
                </Text>
                <Code block>
                  {`interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; // ✅ Added missing property
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
  usdValue: number; // ✅ Added for better type safety
}

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // ✅ Moved outside component to prevent recreation
  const getPriority = useCallback((blockchain: string): number => {
    switch (blockchain) {
      case 'Osmosis':
        return 100
      case 'Ethereum':
        return 50
      case 'Arbitrum':
        return 30
      case 'Zilliqa':
        return 20
      case 'Neo':
        return 20
      default:
        return -99
    }
  }, []);

  // ✅ Combined filtering, sorting, and formatting in one operation
  const formattedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        // ✅ Fixed logic - only include positive balances with valid priority
        return balancePriority > -99 && balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
        return 0; // ✅ Added missing return for equal priorities
      })
      .map((balance: WalletBalance): FormattedWalletBalance => {
        // ✅ Safe price lookup with fallback
        const price = prices[balance.currency] || 0;
        return {
          ...balance,
          formatted: balance.amount.toFixed(6),
          usdValue: price * balance.amount
        };
      });
  }, [balances, prices, getPriority]); // ✅ Correct dependencies

  // ✅ Clean mapping with proper types and unique keys
  const rows = formattedBalances.map((balance: FormattedWalletBalance) => {
    return (
      <WalletRow 
        key={\`\${balance.currency}-\${balance.blockchain}\`} // ✅ Unique key
        amount={balance.amount}
        usdValue={balance.usdValue}
        formattedAmount={balance.formatted}
        currency={balance.currency}
        blockchain={balance.blockchain}
      />
    );
  });

  return (
    <div {...rest}>
      {rows}
    </div>
  );
};

export default WalletPage;`}
                </Code>
              </Stack>
            </Card>

            <Card
              shadow="sm"
              padding="md"
              px={{ base: 'sm', sm: 'md' }}
              py={{ base: 'sm', sm: 'md' }}
              radius="md"
              withBorder
            >
              <Stack gap="md">
                <Title order={4}>Key Improvements</Title>
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Paper
                      shadow="xs"
                      p="md"
                      px={{ base: 'sm', sm: 'md' }}
                      py={{ base: 'sm', sm: 'md' }}
                      radius="md"
                      bg="green.0"
                    >
                      <Stack gap="xs">
                        <Text fw={500} c="green">
                          ✅ Fixed Issues:
                        </Text>
                        <Text size="sm" c="dimmed">
                          • Fixed undefined variable reference
                          <br />• Corrected filter logic
                          <br />• Added missing interface properties
                          <br />• Fixed sort function completion
                        </Text>
                      </Stack>
                    </Paper>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Paper
                      shadow="xs"
                      p="md"
                      px={{ base: 'sm', sm: 'md' }}
                      py={{ base: 'sm', sm: 'md' }}
                      radius="md"
                      bg="blue.0"
                    >
                      <Stack gap="xs">
                        <Text fw={500} c="blue">
                          🚀 Performance Optimizations:
                        </Text>
                        <Text size="sm" c="dimmed">
                          • Combined operations in single useMemo
                          <br />• Removed unused formattedBalances
                          <br />• Used useCallback for getPriority
                          <br />• Proper dependency management
                        </Text>
                      </Stack>
                    </Paper>
                  </Grid.Col>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  )
}
