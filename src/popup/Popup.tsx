import { useEffect } from 'react';
import browser from 'webextension-polyfill';
import { SendMessageWithValue, PromptProps } from '../types';
import { MantineProvider, Text, Group, ActionIcon, Textarea, Box, TextInput, Button } from '@mantine/core';
import { IconPlaylistAdd, IconPencil, IconTrash } from '@tabler/icons-react';
import { useListState } from '@mantine/hooks';
import { useForm, isNotEmpty } from '@mantine/form';

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

const sampleItem = {
  title: 'IT英語に翻訳',
  body: 'あなたは翻訳家です。入力された日本語をIT業界に特化した英語に翻訳をしてください。'
};

export const Popup = () => {

  const form = useForm({
    initialValues: {
      title: '',
      body: '',
      itemIndex: -1, // -1=new
    },
    validate: {
      title: isNotEmpty('Title is required'),
      body: isNotEmpty('Template is required')
    },
  });

  const [items, handlers] = useListState<PromptProps>([]);

  useEffect(() => {
    browser.storage.sync.get(['items']).then((res) => {
      if (res.items) {
        handlers.setState(res.items as PromptProps[]);
      } else {
        handlers.append(sampleItem);
      }
    })
      .catch((error) => {
        console.error('Error retrieving TODOs from Chrome storage:', error);
      });
  }, []);

  useEffect(() => {
    browser.storage.sync.set({items}).then(() => {
      console.log('saved');
    }).catch(error => {
      console.error(error);
    });
  }, [items]);

  const addOrUpdateItem = () => {
    const item:PromptProps = { title: form.values.title, body: form.values.body };
    if(form.values.itemIndex === -1) {
      handlers.append(item);
    } else {
      handlers.setItem(form.values.itemIndex, item);
    }
  };

  const deleteItem = (index:number) => {
    handlers.remove(index);
  };

  const editItem = (index:number) => {
    form.setValues({
      itemIndex: index,
      title: items[index].title,
      body: items[index].body
    });
  };

  const setPrompt = async (index:number): Promise<void> => {
    const prompt = items[index].body || 'error';
    await sendPrompt(prompt);
  };

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Box sx={(theme) => ({minWidth: '500px', margin: theme.spacing.md})}>
        {items.map((item, index) => (
          <Group position="apart" key={item.body} mb="xs">
            <Text fz="sm">{item.title}</Text>
            <Group spacing="xs">
              <ActionIcon onClick={() => setPrompt(index)} color="blue" variant="filled"><IconPlaylistAdd size="1rem" /></ActionIcon>
              <ActionIcon onClick={() => editItem(index)} color="blue" variant="filled"><IconPencil size="1rem" /></ActionIcon>
              <ActionIcon onClick={() => deleteItem(index)} color="red" variant="filled"><IconTrash size="1rem" /></ActionIcon>
            </Group>
          </Group>
        ))}

        <Box component="form" onSubmit={addOrUpdateItem}>
          <Textarea
            label="ChatGPT Prompt template"
            withAsterisk
            minRows={10}
            {...form.getInputProps('body')}
          />
          <TextInput label="Label" placeholder="Label displayed in the list" withAsterisk {...form.getInputProps('title')} />
          <Group position="right" mt="xs">
            { form.values.itemIndex === -1 &&
              <Button type="submit" size="xs" color="blue" variant="filled">Add</Button>
            }
            { form.values.itemIndex !== -1 &&
              <Button type="submit" size="xs" color="yellow" variant="filled">Update</Button>
            }
          </Group>
        </Box>
      </Box>
    </MantineProvider>
  );
};

// const handleClick = async (): Promise<void> => {
//   await browser.tabs.create({ url: 'https://example.com/' });
// };
