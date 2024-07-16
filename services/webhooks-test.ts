import { handler } from "./webhook";

handler({
  Records: [
    {
      Sns: {
        Message: "Test message",
      },
    },
  ],
} as any);     //use "as any" only for testing