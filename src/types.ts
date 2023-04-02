export type SendMessageWithValue<T> = {
  action: string;
  value: T;
};

export type PromptProps = {
  body: string;
  title: string;
}
