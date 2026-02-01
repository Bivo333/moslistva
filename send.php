<?php
// --- НАСТРОЙКИ ---
$token = "ВАШ_ТОКЕН_БОТА";
$chat_id = "ВАШ_ID";
$admin_email = "moslistva@yandex.ru";
$subject_site = "Новая заявка с сайта Moslistva.ru";

// --- СБОР ДАННЫХ ---
$name = strip_tags($_POST['name']);
$phone = strip_tags($_POST['phone']);
$subject = strip_tags($_POST['subject']); // Название товара

// --- 1. ОТПРАВКА В TELEGRAM ---
$arr = array(
  '📦 Заказ:' => $subject,
  '👤 Имя:' => $name,
  '📞 Телефон:' => $phone
);

foreach($arr as $key => $value) {
  $txt .= "<b>".$key."</b> ".$value."%0A";
};

$sendToTelegram = fopen("https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id}&parse_mode=html&text={$txt}","r");

// --- 2. ОТПРАВКА НА ПОЧТУ ---
$message = "Данные заявки:\n\n";
$message .= "Заказ: " . $subject . "\n";
$message .= "Имя: " . $name . "\n";
$message .= "Телефон: " . $phone . "\n";

$headers = "From: info@moslistva.ru\r\n"; // Укажите почту вашего домена (желательно)
$headers .= "Content-Type: text/plain; charset=utf-8\r\n";

$sendToEmail = mail($admin_email, $subject_site, $message, $headers);

// --- ОТВЕТ ДЛЯ JS ---
// Мы считаем отправку успешной, если сработал хотя бы Telegram
if ($sendToTelegram) {
  echo "success";
} else {
  echo "error";
}
?>