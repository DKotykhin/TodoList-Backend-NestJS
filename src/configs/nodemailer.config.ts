import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

export const nodemailerConfig = async (config: ConfigService) => ({
  transport: {
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
      user: config.get('EMAIL_USER'),
      pass: config.get('EMAIL_PASS'),
    },
  },
  defaults: {
    from: '"Todolist" <info@mytodolist.fun>',
  },
  template: {
    dir: 'src/mail/templates',
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
});
