import browser from 'webextension-polyfill';
import { SendMessageWithValue } from './types';

browser.runtime.onMessage.addListener((request: SendMessageWithValue<string>) => {
  if(request.action === 'send_cs') {
    const textarea = document.querySelector<HTMLTextAreaElement>('form textarea');
    if (textarea !== null) {
      textarea.value = `${request.value}\n\n\n`;
    }
  }
});
