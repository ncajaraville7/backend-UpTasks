import nodemailer from 'nodemailer';

export const emailRegister = async (data) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const info = await transport.sendMail({
    from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com',
    to: data.email,
    subject: 'UpTask- Confirma tu cuenta',
    text: 'Confirma tu cuenta en UpTask',
    html: `
        <p>Hola: ${data.name}, comprueba tu cuenta en UpTask</p>
        <p>Tu cuenta ya está casi lista, solo debes confirmarla en el siguiente enlace:</p>
        <a href="${process.env.FRONTEND_URL}/confirm/${data.token}">Confirmar cuenta</a>
        <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>  
    `,
  });
};

export const forgotPassword = async (data) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const info = await transport.sendMail({
    from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com',
    to: data.email,
    subject: 'UpTask- Recuperá tu cuenta',
    text: 'Recuperá tu cuenta en UpTask',
    html: `
        <p>Hola: ${data.name}, recuperá tu cuenta en UpTask</p>
        <p>Para recuperar tu cuenta solo debes hacer click en el siguiente enlace:</p>
        <a href="${process.env.FRONTEND_URL}/forgotPassword/${data.token}">Confirmar cuenta</a>
        <p>Si tu no solicitaste recuperar esta cuenta, puedes ignorar este mensaje</p>  
    `,
  });
};
