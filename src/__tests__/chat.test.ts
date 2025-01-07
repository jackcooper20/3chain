import { describe, expect, test } from "@jest/globals";
import { Chat } from "../chat";

describe("Chat", () => {
  test("should create a new chat with initial messages", () => {
    const chat = new Chat();
    expect(chat.messages).toEqual([]);
  });

  test("should add a message to chat history", () => {
    const chat = new Chat();
    const message = {
      role: "user",
      content: "Hello world",
    };

    chat.addMessage(message);
    expect(chat.messages).toHaveLength(1);
    expect(chat.messages[0]).toEqual(message);
  });

  test("should clear chat history", () => {
    const chat = new Chat();
    chat.addMessage({
      role: "user",
      content: "Test message",
    });

    chat.clear();
    expect(chat.messages).toHaveLength(0);
  });

  test("should get last message from chat", () => {
    const chat = new Chat();
    const message1 = {
      role: "user",
      content: "First message",
    };
    const message2 = {
      role: "assistant",
      content: "Second message",
    };

    chat.addMessage(message1);
    chat.addMessage(message2);

    expect(chat.getLastMessage()).toEqual(message2);
  });

  test("should return null when getting last message from empty chat", () => {
    const chat = new Chat();
    expect(chat.getLastMessage()).toBeNull();
  });

  test("should get chat history as array", () => {
    const chat = new Chat();
    const messages = [
      {
        role: "user",
        content: "Hello",
      },
      {
        role: "assistant",
        content: "Hi there",
      },
    ];

    messages.forEach((msg) => chat.addMessage(msg));
    expect(chat.getHistory()).toEqual(messages);
  });
});
