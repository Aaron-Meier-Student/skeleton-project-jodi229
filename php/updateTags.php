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
            
            function changeData($newDataArr, $delData, $oldDataName, $newDataName, $type) {
                $picsArr = json_decode(file_get_contents('data/data.json'), true);
                $tagsJson = json_decode(file_get_contents('data/tags.json'), true);

                $newTagsArr = array_filter($newDataArr);
            
                if ($newTagsArr) {
                    $tagsJson[$type] = array_merge($tagsJson[$type], $newTagsArr);
                }

                if ($delData || ($oldDataName && $newDataName)) {
                    //delete tags from tags list.
                    if ($delData) {
                        $tagsJson[$type] = array_values(array_diff($tagsJson[$type], $delData));
                    }
                    foreach ($picsArr as $ind => $pic) {
                        if ($delData) {
                            //delete tags from picture.
                            $picsArr[$ind][$type] = array_values(array_diff($picsArr[$ind][$type], $delData));
                        }
                        if ($oldDataName && $newDataName) {
                            //replace tag within picture.
                            $indOfOldTag = array_search($oldDataName, $picsArr[$ind][$type]);
                            if ($indOfOldTag) {
                                array_splice($picsArr[$ind][$type], $indOfOldTag, 1, $newDataName);
                            }
                        }
                    }
                    //Replace old tag within tag list.
                    if ($oldDataName && $newDataName) {
                        array_splice($tagsJson[$type], array_search($oldDataName, $tagsJson[$type]), 1, $newDataName);
                    }
                }
                file_put_contents('data/tags.json', json_encode($tagsJson));
                file_put_contents('data/data.json', json_encode($picsArr));
            }

            $dataType = $_POST["type"];

            if($dataType == "names") {
                changeData($_POST["newNames"], $_POST["tags"], $_POST["oldNameName"], $_POST["newNameName"], "names");
            } elseif ($dataType == "tags") {
                changeData($_POST["newTags"], $_POST["tags"], $_POST["oldTagName"], $_POST["newTagName"], "tags");
            }

            $msg = "Your tags were probably updated.";
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