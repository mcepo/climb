<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Throwable;

class ErrorNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $e;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(Throwable $e)
    {
        $this->e = $e;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->from('climb@noreplay.com')
                    ->view('emails.error-notification');
    }
}
