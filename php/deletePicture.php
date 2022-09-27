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
        $password = "";
        $details = "";
        if($_POST["password"] == "its24-hourtime") {
            $fileNameToDel = $_POST["fileName"];
            if (file_exists("images/".$fileNameToDel)) {
                // delete file.
                unlink("images/".$fileNameToDel);
                $details = "File deleted.";

                //delete file's reference in data file.
                $picsJSON = json_decode(file_get_contents('data/data.json'), true);
                foreach ($picsJSON as $ind => $pic) {
                    if(strpos($pic['src'], $_POST["fileName"]) !== false) {
                        array_splice($picsJSON, $ind, 1);
                        break;
                    }
                }
                file_put_contents('data/data.json', json_encode($picsJSON));

            } else {
                $details = "File does not appear to exist.";
            }

            $password =
            '<input type="password" name="password" id="password" value="its24-hourtime">
            <input class="btn" type="submit" value="Upload Another Picture">';

        } else {
            $details = "<h1> You are not authorized to prefrom this action. </h1>";
        }

        echo '
            <div class="content">
                <div>' . $details . '</div>
                <div>
                    <form action="php/passwordCorrect.php" method="post"  enctype="multipart/form-data">
                        '.$password.'
                        <a class="btn" href="/">Go To Homepage</a>
                    </form>
                </div>
            </div>
        ';
    ?>
</body>
</html>