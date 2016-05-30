<?php
/*
* Contact us form mail
*/
?>

<?php

    if (isset($_POST['q1'])) {
        $to = 'loremipsum@mail.com';
        $subject = $_POST['q3'];
        $form_user_name = $_POST['q1'];
        $form_user_email = $_POST['q2'];
        $form_comment = $_POST['q4'];

        $message = '';
        $message .= $form_comment . "\r\n" . "\r\n";
        $message .= "From: " .  $form_user_name . "\r\n";
        $message .= "Email: " . $form_user_email . "\r\n";
        $message .= "Subject: " . $subject;

        $headers = 'From: ' . $form_user_name . '<'. $form_user_email . '>';
        if( mail( $to, $subject, $message, $headers ) ) {
            #echo "<p>Your email has been sent! Thank you</p>";
        }
    }

?>