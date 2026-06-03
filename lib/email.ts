import { Request } from 'express';
import Sequenzy from 'sequenzy';
import { TempUser, User } from './database/prisma/client';
import { settings } from './settings';

const transporter = new Sequenzy({ apiKey: settings.sequenzy.apiKey });

async function sendEmail(mailOptions: Sequenzy.Transactional.TransactionalSendParams): Promise<void> {
    try {
        await transporter.transactional.send(mailOptions);
    } catch(e: any) {
        throw e;
    }
}

export async function sendVerificationCode(email: string, tempUser: TempUser): Promise<void> {
    try {
        return await sendEmail({
            to: email,
            subject: 'Shopping Saver Verification Code',
            body: 'Your Verification Code for Username ' + tempUser.username + ' is ' + tempUser.verificationCode + '.<br>' +
                'Click <a href="https://' + settings.https.hostname + '/temp-users/' + tempUser.username + '/confirm?verificationCode=' + tempUser.verificationCode +
                '">here</a> to confirm your Registration or open <a href="https://' + settings.https.hostname +
                '/confirm">this Link</a> and enter Username and Verification Code.'
        });
    } catch(e: any) {
        throw e;
    }
}

export async function sendSecurityNotification(type: 'login' | 'settings', user: User, req: Request): Promise<void> {
    try {
        const loginSettingsLine = type == 'login' ?
            ('A new Login to your Shopping Saver Account (' + user.username + ') has been detected!\n') :
            ('Your Account (' + user.username + ') Settings have been modified!\n');
        const tfaLine = user.tfaKey == null ?
            'We recommend that you turn on Two Factor Authentication!\n' :
            'Two Factor Authentication is already active!\n';
        return await sendEmail({
            to: user.email,
            subject: 'Shopping Saver Security Notification',
            body: loginSettingsLine +
                'If it was you, you don\'t need to do anything. If not, you should take action.\n' +
                tfaLine +
                'User Agent: ' + req.headers['user-agent'] + '\nIP Address: ' + req.ip
        });
    } catch(e: any) {
        throw e;
    }
}