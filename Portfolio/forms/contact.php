<?php
//Import PHPMailer classes into the global namespace
//These must be at the top of your script, not inside a function
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

//Load Composer's autoloader
require '../vendor/autoload.php';

//Create an instance; passing `true` enables exceptions
$mail = new PHPMailer(true);

try {
    //Server settings
    $mail->isSMTP();                                            //Send using SMTP
    $mail->Host       = 'smtp.gmail.com';                       //Set the SMTP server to send through
    $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
    $mail->Username   = 'awarsame1993@gmail.com';               //SMTP username
    $mail->Password   = 'ryymkfimlwposuzd';                     //SMTP password
    $mail->SMTPSecure = 'tls';                                  //Enable implicit TLS encryption
    $mail->Port       = 587;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

    //Recipients
    $mail->setFrom('awarsame1993@gmail.com', 'Mailer');
    $mail->addAddress('nazzy310@gmail.com', 'Joe User');         //Add a recipient
   
    //Content
    $mail->isHTML(true);                                        //Set email format to HTML
    $mail->Subject = $_POST['subject'];
    $mail->Body    = "Name: {$_POST['name']}<br>Email: {$_POST['email']}<br>Subject: {$_POST['subject']}<br>Message: {$_POST['message']}";

    $mail->send();
    echo 'Message has been sent';
} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}
?>
