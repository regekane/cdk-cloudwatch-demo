import * as cdk from "aws-cdk-lib";
import { Alarm, Metric } from "aws-cdk-lib/aws-cloudwatch";
import { SnsAction } from "aws-cdk-lib/aws-cloudwatch-actions";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Topic } from "aws-cdk-lib/aws-sns";
import { LambdaSubscription } from "aws-cdk-lib/aws-sns-subscriptions";
import { Construct } from "constructs";
import { join } from "path";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class TsCwMetricsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //configure a nodejs lambda

    const webHookLambda = new NodejsFunction(this, "webHookLambda", {
      runtime: Runtime.NODEJS_18_X,
      handler: "handler",
      entry: join(__dirname, "..", "services", "ewebhooks.ts"),
    });

    //configure sns topic

    const alarmTopic = new Topic(this, "TSAlarmTopic", {
      displayName: "TsAlarmTopic",
      topicName: "TSAlarmTopic",
    });

    //link the webhook lambda and the sns topic

    alarmTopic.addSubscription(new LambdaSubscription(webHookLambda));

    //configure our alarm

    const sampleAlarm = new Alarm(this, 'Ts-ApiAlarm', {
      metric: new Metric({
          metricName: 'custom-error',
          namespace: 'Custom',
          period: cdk.Duration.minutes(1),
          statistic: 'Sum',
      }),
      evaluationPeriods: 1,
      threshold: 100,
  });

  //add action to the alarm and connect it to the sns topic
  const topicAction = new SnsAction(alarmTopic);
  sampleAlarm.addAlarmAction(topicAction);
  sampleAlarm.addOkAction(topicAction);

  }
}
