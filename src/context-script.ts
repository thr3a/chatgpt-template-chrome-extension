import browser from 'webextension-polyfill';
import { SendMessageWithValue } from './types';

console.log('nyaa');

browser.runtime.onMessage.addListener((request: SendMessageWithValue<string>) => {
  if(request.action === 'send_cs') {
    console.log(request.value);
  }
});
