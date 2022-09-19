<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Picture Upload</title>
    <link rel="stylesheet" href="css/base.css">
    <link rel="stylesheet" href="css/upload.css">
    <link rel="shortcut icon" href="images/square-jana-fly.ico" type="image/x-icon">
</head>
<body>
    <?php
        $details = "";
        $password = "";
        if($_POST["password"] == "its24-hourtime") {
            $target_dir = "images/";
            $target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
            $uploadOk = 1;
            $imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);

            $newTags = implode(" ", array_filter($_POST["newTags"]));
            $tags = implode(" ", $_POST["tags"]) .' '. $newTags;

            // Check if image file is a actual image or fake image
            if(isset($_POST["submit"])) {
                $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
                if($check !== false) {
                    echo "";
                    $uploadOk = 1;
                } else {
                    $details = $details . "<div>File is not an image.</div>";
                    $uploadOk = 0;
                }
            }
            // Check if file already exists
            if (file_exists($target_file)) {
                $details = $details . "<div>Sorry, file already exists.</div>";
                $uploadOk = 0;
            }


            // Allow certain file formats
            if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg") {
                $details = $details . "<div>Sorry, only JPG, JPEG & PNG files are allowed.</div>";
                $uploadOk = 0;
            }
            // Check if $uploadOk is set to 0 by an error
            if ($uploadOk == 0) {
                $details = $details . "<div>Sorry, your file was not uploaded.</div>";
            // if everything is ok, try to upload file
            } else {
                $details = $details . "<div>tags: " . $_POST["tags"] . "</div>";
                $htmlFile = fopen("index.html", "r");
                $fileContent = fread($htmlFile, filesize("index.html"));
                $updatedHtml = str_replace(
                    "</div><!--this-works-->",
                    "    <div class=\"pic-item " . $tags .
                        "\" data-lazy=\"url('images/" .
                            $_FILES["fileToUpload"]["name"] .
                            "')\" data-date=\"" . $_POST["date"] . 
                            "\"></div>\n            </div><!--this-works-->",
                    $fileContent
                );
                fclose($htmlFile);
                $fileToWrite = fopen("index.html", "w");

                fwrite($fileToWrite, $updatedHtml);

                fclose($fileToWrite);

                if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
                    $details = $details . "<div><i><h4>The file ". basename( $_FILES["fileToUpload"]["name"]). " has been uploaded.</h4></i></div>";
                    if ($newTags != '') {
                        $jsFile = fopen("js/options.js", "r");
                        $jsFileRead = fread($jsFile, filesize("js/options.js"));
                        $updatedJs = str_replace(
                            "'\n]; // list of options.",
                            "', '".str_replace(' ', "', '", $newTags)."'".
                            "\n]; // list of options.",
                            $jsFileRead
                        );
                        $updatedJs = str_replace(
                            "'\n]; // nested options.",
                            "', '".
                            implode("', '", array_filter($_POST["nestedTags"]))
                            ."'"."\n]; // nested options.",
                            $updatedJs
                        );
                        fclose($jsFile);

                        $jsToWrite = fopen("js/options.js", "w");

                        fwrite($jsToWrite, $updatedJs);

                        fclose($jsToWrite);
                    }

                } else {
                    $details = $details . "<div>Sorry, there was an error uploading your file.</div>";
                }
            }
            $password =
            '<input type="password" name="password" id="password" value="its24-hourtime">
            <input class="btn" type="submit" value="Upload Another Picture">';

        } else {
            $details = "<h1> You are not authorized to use this page. </h1>";
        }
        echo '
            <div class="content">
                <div>' . $details . '</div>
                <div>
                    <form action="passwordCorrect.php" method="post"  enctype="multipart/form-data">
                        '.$password.'
                        <a class="btn" href="/">Go To Homepage</a>
                    </form>
                </div>
            </div>
            ';
    ?>
</body>
</html>