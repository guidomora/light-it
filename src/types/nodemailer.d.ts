declare module 'nodemailer' {
  export interface SendMailOptions {
    from: string;
    to: string;
    subject: string;
    text?: string;
    html?: string;
  }

  export interface TransportOptions {
    host: string;
    port: number;
    secure: boolean;
    auth?: {
      user: string;
      pass: string;
    };
  }

  export interface Transporter {
    sendMail(mailOptions: SendMailOptions): Promise<void>;
  }

  export function createTransport(
    transportOptions: TransportOptions,
  ): Transporter;

  const nodemailer: {
    createTransport: typeof createTransport;
  };

  export default nodemailer;
}
