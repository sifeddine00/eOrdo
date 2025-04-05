<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class ResetPasswordNotification extends Notification
{
    public $token;
    public $email;

    public function __construct($token, $email)
    {
        $this->token = $token;
        $this->email = $email;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $frontendUrl = config('app.frontend_url', 'http://localhost:3000');
        $resetUrl = "{$frontendUrl}/reset-password/{$this->token}?email=" . urlencode($this->email);

        return (new MailMessage)
            ->subject('Réinitialisation du mot de passe')
            ->greeting('Bonjour,')
            ->line("Vous avez demandé à réinitialiser votre mot de passe.")
            ->action('Réinitialiser le mot de passe', $resetUrl)
            ->line('Ce lien expirera dans 60 minutes.')
            ->line('Si vous n’avez pas fait cette demande, ignorez cet e-mail.');
    }
}
