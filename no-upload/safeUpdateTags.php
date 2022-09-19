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
            $picsArr = json_decode(file_get_contents('data/data.json'), true);
            $tagsJson = json_decode(file_get_contents('data/tags.json'), true);

            //UPLOAD NEW TAGS
            $newTagsArr = array_filter($_POST["newTags"]);
            
            if ($newTagsArr[0]) {
                $tagsJson['tags'] = array_merge($tagsJson['tags'], $newTagsArr);
            }
            
            //DELETE TAGS
            $tags = $_POST["tags"];

            //REPLACE TAGS
            $oldTag = $_POST["oldTagName"];
            $newTag = $_POST["newTagName"];

            
            if ($tags || ($oldTag && $newTag)) {
                //delete tags from tags list.
                if ($tags) {
                    $tagsJson["tags"] = array_values(array_diff($tagsJson["tags"], $tags));
                }
                foreach ($picsArr as $ind => $pic) {
                    if ($tags) {
                        //delete tags from picture.
                        $picsArr[$ind]["tags"] = array_values(array_diff($picsArr[$ind]["tags"], $tags));
                    }
                    if ($oldTag && $newTag) {
                        //replace tag within picture.
                        $indOfOldTag = array_search($oldTag, $picsArr[$ind]["tags"]);
                        if ($indOfOldTag) {
                            array_splice($picsArr[$ind]["tags"], $indOfOldTag, 1, $newTag);
                        }
                    }
                }
                //Replace old tag within tag list.
                if ($oldTag && $newTag) {
                    array_splice($tagsJson["tags"], array_search($oldTag, $tagsJson["tags"]), 1, $newTag);
                }
            }

            


            
            file_put_contents('data/tags.json', json_encode($tagsJson));
            file_put_contents('data/data.json', json_encode($picsArr));

            $msg = "Your tags were probably updated.";
        }
    ?>
     <div class="content">
        <div><?php echo $msg; ?></div>
        <div>
            <form action="passwordCorrect.php" method="post"  enctype="multipart/form-data">
                <input type="password" name="password" id="password" value="its24-hourtime">
                <input class="btn" type="submit" value="Upload/Update Another Picture">
                <a class="btn" href="/">Go To Homepage</a>
            </form>
        </div>
    </div>
</body>
</html>