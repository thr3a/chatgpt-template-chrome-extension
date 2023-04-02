import browser from 'webextension-polyfill';
import { MantineProvider, Button, Box, Text } from '@mantine/core';
import { SendMessageWithValue } from '../types';
import { useEventListener } from '@mantine/hooks';

const sendPrompt = async (prompt: string): Promise<void> => {
  const [currentTab] = await browser.tabs.query({ active: true, currentWindow: true });
  if (!currentTab || !currentTab.id) {
    console.error('Could not find current tab');
    return;
  }

  const message: SendMessageWithValue<string> = {
    action: 'send_cs',
    value: prompt,
  };
  await browser.tabs.sendMessage(currentTab.id, message);
};

export const Popup = () => {
  const clickHandler = async () => {
    await sendPrompt('popup');
  };
  const ref = useEventListener('click', clickHandler);

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS
      theme={{
        colorScheme: 'light',
        defaultRadius: 'xs',
        fontFamily: '"Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif',
      }}
    >
      <Box sx={(theme) => ({minWidth: '500px', margin: theme.spacing.md})}>
        <Text>Hello popup!</Text>
        <Button ref={ref}>クリック</Button>
      </Box>
    </MantineProvider>
  );
};

// const handleClick = async (): Promise<void> => {
//   await browser.tabs.create({ url: 'https://example.com/' });
// };
