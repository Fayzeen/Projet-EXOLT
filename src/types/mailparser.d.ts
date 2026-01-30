declare module "mailparser" {
  export function simpleParser(
    source: any,
    options?: any,
  ): Promise<{
    text?: string;
    html?: string;
    subject?: string;
    from?: any;
    to?: any;
    date?: Date;
    attachments?: any[];
  }>;
}
