<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Picture updated</title>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="css/base.css">
    <link rel="stylesheet" href="css/upload.css">
</head>
<body>
    <?php
        $msg = "You do not have permission to preform this action.";
        if ($_POST["password"] == "its24-hourtime") {
            $pics = json_decode(file_get_contents('data/data.json'), true);
            foreach ($pics as $ind => $pic) {
                if(strpos($pic['src'], $_POST["fileName"]) !== false) {
                    $tags = array_filter($_POST["tags"]);
                    $names = array_filter($_POST["names"]);

                    $tagsJSON = json_decode(file_get_contents('data/tags.json'), true);

                    if ($tags) {
                        
                        $tagsJSON["tags"] = array_values(array_unique(array_merge($tagsJSON["tags"], $tags)));

                        $pic['tags'] = array_values(array_unique(array_merge($pic['tags'], $tags)));
                    }
                    
                    if ($names) {
                        
                        $tagsJSON["names"] = array_values(array_unique(array_merge($tagsJSON["names"], $names)));
                        
                        if (!array_key_exists("names", $pic)) $pic["names"] = [];
                        $pic["names"] = array_values(array_unique(array_merge($pic["names"], $names)));
                    }

                    if ($_POST["tagsRemove"]) {
                        $pic['tags'] = array_values(array_diff($pic["tags"], $_POST["tagsRemove"]));
                    }

                    if ($_POST["namesRemove"]) {
                        $pic['names'] = array_values(array_diff($pic["names"], $_POST["namesRemove"]));
                    }

                    $pics[$ind]["tags"] = $pic['tags'];
                    $pics[$ind]["names"] = $pic['names'];

                    file_put_contents('data/tags.json', json_encode($tagsJSON));
                }
            }
            file_put_contents('data/data.json', json_encode($pics));
            $msg = "Your image was probably updated.";
        }
    ?>
     <div class="content">
        <div><?php echo $msg; ?></div>
        <div>
            <form action="php/passwordCorrect.php" method="post"  enctype="multipart/form-data">
                <input type="password" name="password" id="password" value="its24-hourtime">
                <input class="btn" type="submit" value="Upload/Update Another Picture">
                <a class="btn" href="/">Go To Homepage</a>
            </form>
        </div>
    </div>
</body>
</html>