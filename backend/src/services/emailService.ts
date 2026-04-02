import nodemailer from 'nodemailer';

// Configuration SMTP - Compatible avec Gmail et autres fournisseurs
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const emailService = {
    /**
     * Envoie un email de réinitialisation de mot de passe
     * @param to Email du destinataire
     * @param token Token de réinitialisation
     */
    async sendPasswordResetEmail(to: string, token: string): Promise<void> {
        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${token}`;
        const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@lesterresdulion.com';

        const mailOptions = {
            from: `"Les Terres du Lion Support" <${fromEmail}>`,
            to,
            subject: '🔐 Réinitialisation de votre mot de passe - Les Terres du Lion',
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 15px 30px; background: #8B4513; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Les Terres du Lion</h1>
            <p>Réinitialisation de mot de passe</p>
        </div>
        <div class="content">
            <p>Bonjour,</p>
            <p>Vous avez demandé la réinitialisation de votre mot de passe pour votre compte Les Terres du Lion.</p>
            <p>Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :</p>
            <div style="text-align: center;">
                <a href="${resetLink}" class="button" style="color: white;">Réinitialiser mon mot de passe</a>
            </div>
            <p>Ou copiez ce lien dans votre navigateur :</p>
            <p style="word-break: break-all; background: #fff; padding: 10px; border-left: 3px solid #8B4513;">
                ${resetLink}
            </p>
            <p><strong>Ce lien est valide pendant 1 heure.</strong></p>
            <p style="color: #d9534f;">Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer cet email. Votre mot de passe actuel reste inchangé.</p>
        </div>
        <div class="footer">
            <p>© 2026 Les Terres du Lion - Tous droits réservés</p>
        </div>
    </div>
</body>
</html>
      `,
        };

        // Mode développement : afficher l'email dans la console
        if (process.env.NODE_ENV === 'development' && !process.env.SMTP_USER) {
            console.log('================================================');
            console.log('📧 MOCK EMAIL SERVICE (Development Mode)');
            console.log(`To: ${to}`);
            console.log(`Subject: ${mailOptions.subject}`);
            console.log(`Link: ${resetLink}`);
            console.log('================================================');
            return;
        }

        // Mode production : envoyer l'email réel
        try {
            const info = await transporter.sendMail(mailOptions);
            console.log(`✅ Password reset email sent to ${to}`);
            console.log(`Message ID: ${info.messageId}`);
        } catch (error) {
            console.error('❌ Error sending password reset email:', error);
            throw new Error('Could not send password reset email');
        }
    },

    async sendOAuthLinkVerificationEmail(to: string, token: string, provider: 'google' | 'discord'): Promise<void> {
        const confirmationLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/oauth-link-confirm?token=${encodeURIComponent(token)}`;
        const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@lesterresdulion.com';
        const providerName = provider === 'google' ? 'Google' : 'Discord';

        const mailOptions = {
            from: `"Les Terres du Lion Support" <${fromEmail}>`,
            to,
            subject: `Liaison de votre compte ${providerName} - Les Terres du Lion`,
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 15px 30px; background: #8B4513; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Les Terres du Lion</h1>
            <p>Confirmation de liaison de compte</p>
        </div>
        <div class="content">
            <p>Bonjour,</p>
            <p>Une demande de liaison avec votre compte ${providerName} a été effectuée pour cette adresse email.</p>
            <p>Si vous êtes bien à l'origine de cette demande, confirmez-la avec le bouton ci-dessous :</p>
            <div style="text-align: center;">
                <a href="${confirmationLink}" class="button" style="color: white;">Confirmer la liaison</a>
            </div>
            <p>Ce lien est valide pendant 1 heure.</p>
            <p>Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email.</p>
        </div>
    </div>
</body>
</html>
      `,
        };

        if (process.env.NODE_ENV === 'development' && !process.env.SMTP_USER) {
            console.log('================================================');
            console.log('MOCK OAUTH LINK EMAIL (Development Mode)');
            console.log(`To: ${to}`);
            console.log(`Provider: ${providerName}`);
            console.log(`Link: ${confirmationLink}`);
            console.log('================================================');
            return;
        }

        try {
            await transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Error sending oauth link verification email:', error);
            throw new Error('Could not send OAuth link verification email');
        }
    },
};
