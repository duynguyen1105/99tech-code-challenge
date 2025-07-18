'use client'

import { useState, useEffect } from 'react'
import {
  Button,
  NumberInput,
  Select,
  Group,
  Stack,
  Text,
  Badge,
  Divider,
  ActionIcon,
  Alert,
  Loader,
  Center,
  Box,
  Transition,
  Card,
  ComboboxLikeRenderOptionInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import {
  Check,
  CoinsSwap,
  DataTransferBoth,
  Refresh,
  WarningTriangleSolid,
} from 'iconoir-react'

interface Token {
  id: string
  name: string
  symbol: string
  price?: number
  change24h?: number
  icon?: string
}

interface CurrencyPrice {
  currency: string
  date: string
  price: number
}

interface FormValues {
  fromToken: string
  toToken: string
  fromAmount: number | string
  toAmount: number | string
}

const API_URL = 'https://interview.switcheo.com/prices.json'
const iconUrl = (currency: string) =>
  `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${currency}.svg`

const TokenIcon = ({
  symbol,
  iconUrl,
}: {
  symbol: string
  iconUrl?: string
}) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  if (!iconUrl || imageError) {
    return (
      <Box
        w={24}
        h={24}
        bg="var(--mantine-color-blue-6)"
        bdrs="50%"
        display="flex"
        fz="12px"
        fw="bold"
        c="white"
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {symbol.slice(0, 2).toUpperCase()}
      </Box>
    )
  }

  return (
    <Box style={{ position: 'relative', width: 24, height: 24 }}>
      {imageLoading && (
        <Box
          w={24}
          h={24}
          bg="var(--mantine-color-gray-3)"
          bdrs="50%"
          display="flex"
          fz="12px"
          fw="bold"
          top={0}
          left={0}
          pos="absolute"
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Loader size={12} />
        </Box>
      )}
      <img
        src={iconUrl}
        alt={`${symbol} icon`}
        style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          opacity: imageLoading ? 0 : 1,
          transition: 'opacity 0.2s',
        }}
        onLoad={() => setImageLoading(false)}
        onError={() => {
          setImageError(true)
          setImageLoading(false)
        }}
      />
    </Box>
  )
}

const TokenSelect = ({
  data,
  value,
  onChange,
  placeholder,
  excludeValue,
  error,
}: {
  data: Token[]
  value: string
  onChange: (value: string) => void
  placeholder: string
  excludeValue?: string
  error?: string
}) => {
  const filteredData = data.filter((token) => token.id !== excludeValue)
  const selectedToken = data.find((token) => token.id === value)
  const selectValue = value && value.trim() !== '' ? value : null

  const selectData = filteredData.map((token) => ({
    value: token.id,
    label: token.symbol,
    icon: token.icon,
  }))

  const renderOption = ({
    option,
    checked,
  }: ComboboxLikeRenderOptionInput<{
    value: string
    label: string
    icon?: string
  }>) => {
    return (
      <Group w="100%">
        <TokenIcon symbol={option.label} iconUrl={option.icon} />
        <Text flex={1}>{option.label}</Text>
        {checked && <Check />}
      </Group>
    )
  }

  return (
    <Select
      data={selectData}
      value={selectValue}
      onChange={(val) => onChange(val || '')}
      placeholder={placeholder}
      w={{
        base: '100%',
        sm: 'auto',
      }}
      leftSection={
        selectedToken ? (
          <TokenIcon
            symbol={selectedToken.symbol}
            iconUrl={selectedToken.icon}
          />
        ) : null
      }
      leftSectionWidth={32}
      renderOption={renderOption}
      error={error}
      clearable={false}
    />
  )
}

export default function CurrencySwapForm() {
  const [isSwapping, setIsSwapping] = useState(false)
  const [swapAnimation, setSwapAnimation] = useState(false)
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    mode: 'uncontrolled',
    initialValues: {
      fromToken: '',
      toToken: '',
      fromAmount: 1,
      toAmount: 0,
    },
  })

  const fetchCurrencyData = async () => {
    setLoading(true)
    setApiError(null)

    try {
      const response = await fetch(API_URL)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: CurrencyPrice[] = await response.json()

      const uniqueCurrencies = new Map<string, CurrencyPrice>()
      data.forEach((item) => {
        const currencyKey = item.currency.toLowerCase()
        if (
          !uniqueCurrencies.has(currencyKey) ||
          new Date(item.date) >
            new Date(uniqueCurrencies.get(currencyKey)!.date)
        ) {
          uniqueCurrencies.set(currencyKey, item)
        }
      })

      const processedTokens: Token[] = Array.from(
        uniqueCurrencies.values()
      ).map((item) => ({
        id: item.currency.toLowerCase(),
        name: item.currency,
        symbol: item.currency,
        price: item.price,
        icon: iconUrl(item.currency),
      }))

      setTokens(processedTokens)

      if (!form.values.fromToken && processedTokens.length > 0) {
        form.setFieldValue('fromToken', processedTokens[0].id)
      }
      if (!form.values.toToken && processedTokens.length > 1) {
        form.setFieldValue('toToken', processedTokens[1].id)
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch currency data'
      setApiError(errorMessage)

      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCurrencyData()
  }, [])

  const fromTokenData = tokens.find((t) => t.id === form.values.fromToken)
  const toTokenData = tokens.find((t) => t.id === form.values.toToken)

  useEffect(() => {
    if (fromTokenData?.price && toTokenData?.price && form.values.fromAmount) {
      const fromValue =
        typeof form.values.fromAmount === 'string'
          ? Number.parseFloat(form.values.fromAmount)
          : form.values.fromAmount
      if (!isNaN(fromValue) && fromValue > 0) {
        const exchangeRate = fromTokenData.price / toTokenData.price
        const calculatedToAmount = fromValue * exchangeRate
        form.setFieldValue(
          'toAmount',
          Number.parseFloat(calculatedToAmount.toFixed(8))
        )
      } else {
        form.setFieldValue('toAmount', 0)
      }
    }
  }, [
    form.values.fromToken,
    form.values.toToken,
    form.values.fromAmount,
    fromTokenData,
    toTokenData,
  ])

  const handleSwapTokens = () => {
    setSwapAnimation(true)
    setTimeout(() => {
      const tempToken = form.values.fromToken
      form.setFieldValue('fromToken', form.values.toToken)
      form.setFieldValue('toToken', tempToken)
      form.setFieldValue('fromAmount', form.values.toAmount)
      setSwapAnimation(false)
    }, 150)
  }

  const handleSwap = async (values: FormValues) => {
    setIsSwapping(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    const success = Math.random() > 0.2

    if (success) {
      notifications.show({
        title: 'Swap Successful!',
        message: `Successfully swapped ${values.fromAmount} ${fromTokenData?.symbol} for ${values.toAmount} ${toTokenData?.symbol}!`,
        color: 'green',
      })

      form.setFieldValue('fromToken', '')
      form.setFieldValue('toToken', '')
      form.setFieldValue('fromAmount', '')
      form.setFieldValue('toAmount', 0)
    } else {
      notifications.show({
        title: 'Swap Failed',
        message: 'Transaction failed. Please try again.',
        color: 'red',
      })
    }

    setIsSwapping(false)
  }

  const exchangeRate =
    fromTokenData?.price && toTokenData?.price
      ? (fromTokenData.price / toTokenData.price).toFixed(8)
      : '0'

  if (loading) {
    return (
      <Center>
        <Card
          shadow="lg"
          padding="xl"
          px={{ base: 'md', sm: 'xl' }}
          py={{ base: 'md', sm: 'xl' }}
          radius="lg"
          maw={500}
          w="100%"
          withBorder
        >
          <Stack gap="lg" align="center">
            <Loader size="lg" />
            <Text>Loading currency data...</Text>
          </Stack>
        </Card>
      </Center>
    )
  }

  if (apiError) {
    return (
      <Center>
        <Card
          shadow="lg"
          padding="xl"
          px={{ base: 'md', sm: 'xl' }}
          py={{ base: 'md', sm: 'xl' }}
          radius="lg"
          maw={500}
          w="100%"
          withBorder
        >
          <Stack gap="lg">
            <Alert icon={<WarningTriangleSolid />} color="red" variant="light">
              <Text c="red">Failed to load currency data: {apiError}</Text>
            </Alert>
            <Button
              onClick={fetchCurrencyData}
              leftSection={<Refresh width={16} height={16} />}
              variant="outline"
            >
              Retry
            </Button>
          </Stack>
        </Card>
      </Center>
    )
  }

  return (
    <Center>
      <Card
        shadow="lg"
        padding="xl"
        px={{ base: 'md', sm: 'xl' }}
        py={{ base: 'md', sm: 'xl' }}
        radius="lg"
        maw={500}
        w="100%"
        withBorder
      >
        <form onSubmit={form.onSubmit(handleSwap)}>
          <Stack gap="lg">
            <Group justify="space-between">
              <Text size="lg" fw={600}>
                Currency Swap
              </Text>
              <Button
                variant="light"
                size="sm"
                onClick={fetchCurrencyData}
                leftSection={<Refresh width={16} height={16} />}
                type="button"
              >
                Refresh Prices
              </Button>
            </Group>

            <Card
              shadow="xs"
              padding="md"
              px={{ base: 'sm', sm: 'md' }}
              py={{ base: 'sm', sm: 'md' }}
              radius="md"
              withBorder
            >
              <Stack gap="xs">
                <Text size="sm" fw={500}>
                  From
                </Text>
                <Group>
                  <TokenSelect
                    data={tokens}
                    value={form.values.fromToken}
                    onChange={(value) => form.setFieldValue('fromToken', value)}
                    placeholder="Select currency"
                    excludeValue={form.values.toToken}
                    error={
                      typeof form.errors.fromToken === 'string'
                        ? form.errors.fromToken
                        : undefined
                    }
                  />
                  <NumberInput
                    placeholder="0.00"
                    value={form.values.fromAmount}
                    onChange={(value) =>
                      form.setFieldValue('fromAmount', value)
                    }
                    min={0}
                    decimalScale={8}
                    flex={1}
                    error={form.errors.fromAmount}
                  />
                </Group>
                {fromTokenData && (
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">
                      ${fromTokenData.price?.toLocaleString()}
                    </Text>
                    <Text size="sm" c="dimmed">
                      Total: $
                      {(() => {
                        const amount =
                          typeof form.values.fromAmount === 'string'
                            ? Number.parseFloat(form.values.fromAmount)
                            : form.values.fromAmount
                        const total = (amount || 0) * (fromTokenData.price || 0)
                        return total.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      })()}
                    </Text>
                  </Group>
                )}
              </Stack>
            </Card>

            <Center>
              <Transition
                mounted={!swapAnimation}
                transition="rotate-left"
                duration={300}
              >
                {(styles) => (
                  <ActionIcon
                    variant="filled"
                    size="lg"
                    radius="xl"
                    onClick={handleSwapTokens}
                    style={styles}
                    color="blue"
                    type="button"
                  >
                    <DataTransferBoth width={16} height={16} />
                  </ActionIcon>
                )}
              </Transition>
            </Center>

            <Card
              shadow="xs"
              padding="md"
              px={{ base: 'sm', sm: 'md' }}
              py={{ base: 'sm', sm: 'md' }}
              radius="md"
              withBorder
            >
              <Stack gap="xs">
                <Text size="sm" fw={500}>
                  To
                </Text>
                <Group>
                  <TokenSelect
                    data={tokens}
                    value={form.values.toToken}
                    onChange={(value) => form.setFieldValue('toToken', value)}
                    placeholder="Select currency"
                    excludeValue={form.values.fromToken}
                    error={
                      typeof form.errors.toToken === 'string'
                        ? form.errors.toToken
                        : undefined
                    }
                  />
                  <NumberInput
                    placeholder="0.00"
                    value={form.values.toAmount}
                    readOnly
                    flex={1}
                  />
                </Group>
                {toTokenData && (
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">
                      ${toTokenData.price?.toLocaleString()}
                    </Text>
                  </Group>
                )}
              </Stack>
            </Card>

            <Divider />

            <Card
              shadow="xs"
              padding="md"
              px={{ base: 'sm', sm: 'md' }}
              py={{ base: 'sm', sm: 'md' }}
              radius="md"
              withBorder
              bg="gray.0"
            >
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">
                    Exchange Rate
                  </Text>
                  <Text size="sm" fw={500}>
                    1 {fromTokenData?.symbol} = {exchangeRate}{' '}
                    {toTokenData?.symbol}
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">
                    Network Fee
                  </Text>
                  <Badge variant="light" color="blue">
                    Free
                  </Badge>
                </Group>
              </Stack>
            </Card>

            <Button
              type="submit"
              disabled={
                isSwapping ||
                !form.values.fromAmount ||
                (typeof form.values.fromAmount === 'number' &&
                  form.values.fromAmount <= 0) ||
                !form.values.fromToken ||
                !form.values.toToken ||
                !form.isValid()
              }
              size="lg"
              leftSection={
                isSwapping ? (
                  <Loader size={16} />
                ) : (
                  <CoinsSwap width={16} height={16} />
                )
              }
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan' }}
            >
              {isSwapping ? 'Swapping...' : 'Swap Tokens'}
            </Button>
          </Stack>
        </form>
      </Card>
    </Center>
  )
}
