<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Picture Upload</title>
    <link rel="stylesheet" href="css/base.css">
    <link rel="stylesheet" href="css/upload.css">
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

            // Check if image file is an actual image or fake image
            if(isset($_POST["submit"])) {
                $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
                if($check !== false) {
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
            } else {
                // if everything is ok, try to upload file
                if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
                    $details = $details . "<div><i><h4>The file ". basename( $_FILES["fileToUpload"]["name"]). " has been uploaded.</h4></i></div>";

                    function combineTagsandUpload ($data) {
                        $newDataArr = $_POST["new".$data] ?: array();
                        $newDataArr = array_filter($newDataArr);
                        
                        $data = lcfirst($data);
                        $checkBoxData = $_POST[$data] ?: array();

                        //UPLOAD NEW Data
                        if ($newDataArr) {
                            $dataJson = json_decode(file_get_contents('data/tags.json'), true);

                            $dataJson[$data] = array_unique(array_merge($dataJson[$data], $newDataArr));

                            if ($data == 'names') {
                                sort($dataJson[$data]);
                            }
                            
                            file_put_contents('data/tags.json', json_encode($dataJson));
                        }

                        return array_unique(array_merge($checkBoxData, $newDataArr));
                    }

                    //put json data into obj
                    $picData = json_decode(file_get_contents('data/data.json'));

                    //insert new obj with new pic's data.
                    array_push($picData, (object) [
                        'tags' => combineTagsandUpload('Tags'),
                        'names' => combineTagsandUpload('Names'),
                        'src' => 'images/'.$_FILES["fileToUpload"]["name"],
                        'date' => date("m/d/Y", strtotime($_POST["date"]))
                    ]);

                    //put obj back into json file.
                    file_put_contents('data/data.json', json_encode($picData));

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
                    <form action="passwordCorrect.php" method="post" enctype="multipart/form-data">
                        '.$password.'
                        <a class="btn" href="/">Go To Homepage</a>
                    </form>
                </div>
            </div>
            ';
    ?>
</body>
</html>