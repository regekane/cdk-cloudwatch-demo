import { SNSEvent } from "aws-lambda";

const webHookUrl =
  "https://hooks.slack.com/services/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";

async function handler(event: SNSEvent) {
  //our handler receives a simple sns event
  for (const record of event.Records) {
    //for each record in the event, we're making a fetch request to the webhook url
    await fetch(webHookUrl, {
      method: "POST", //using a post method
      body: JSON.stringify({
        text: `Houston, we have a problem: ${record.Sns.Message}`, // we will receive a json text object as a body
      }),
    });
  }
}

export { handler };
