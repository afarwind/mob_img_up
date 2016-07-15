<?php

if (! isset($_POST['upload_file_data'])) {
    echo "no file data upload";
    exit();
}

$base64 = $_POST['upload_file_data'][0];

$base64 = substr($base64, strpos($base64, ","));

$file_content = base64_decode($base64);

$filename = uniqid().".jpg";
file_put_contents("upload/$filename", $file_content);
