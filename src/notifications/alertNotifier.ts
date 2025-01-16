export interface AlertNotifier {
  notify(message: string): Promise<void>;
}

export class EmailAlertNotifier implements AlertNotifier {
  constructor(private readonly emailAddress: string) {}

  async notify(message: string): Promise<void> {
    // Implementation would send an actual email
    console.log(`Sending email to ${this.emailAddress}: ${message}`);
  }
}

export class SlackAlertNotifier implements AlertNotifier {
  constructor(private readonly webhookUrl: string) {}

  async notify(message: string): Promise<void> {
    // Implementation would send a Slack message
    console.log(`Sending Slack notification: ${message}`);
  }
}
