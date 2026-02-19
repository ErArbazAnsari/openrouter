import { t } from "elysia";

const MessageObject = t.Object({
    role: t.Enum({ user: "user", assistant: "model" }),
    content: t.String(),
});

export const Message = t.Array(MessageObject);

export type Message = typeof MessageObject.static;

export const conversation = t.Object({
    model: t.String(),
    messages: Message,
});
