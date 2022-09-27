<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Update Picture</title>
    <link rel="stylesheet" href="../css/base.css">
    <link rel="stylesheet" href="../css/updatePic.css">
    <link rel="shortcut icon" href="../images/square-jana-fly.ico" type="image/x-icon">
</head>
<body>
    <div class="flex-center">
        <div class="content">
            <form action="php/updatePicture.php" method="post">
                <?php
                    echo '<input style="display: none;" type="password" name="password" id="password" value="'.$_POST["password"].'">'
                ?>
                <div class="border-bottom">
                    <span>Filename:</span>
                    <span id="fileName"><?php
                        echo $_POST["fileName"]
                    ?></span>
                </div>
                <div class="border-bottom new-tag-holder">
                    <span>Tags to add:</span> <input type="text" class="wide-btn" name="tags[]">
                    <button class="wide-btn" type="button">Another!</button>
                </div>
                <div class="border-bottom">
                    <div class="filter-classes checkbox-list"></div>
                </div>
                <div class="border-bottom new-tag-holder">
                    <span>Names to add:</span> <input type="text" class="wide-btn" name="names[]">
                    <button class="wide-btn" type="button">Another!</button>
                </div>
                <div class="border-bottom">
                    <div class="names-list checkbox-list"></div>
                </div>
                <div class="border-bottom">
                    <span>Tags to remove:</span>
                </div>
                <div class="border-bottom">
                    <div class="checkbox-list tags-remove">

                    </div>
                </div>
                <div class="border-bottom">
                    <span>Names to remove:</span>
                </div>
                <div class="border-bottom">
                    <div class="checkbox-list remove-names-list">
                        
                    </div>
                </div>
                <div class="border-bottom">
                    <button class="wide-btn">Submit Changes</button>
                </div>
                <input type="text" name="fileName" class="filenameField" style="display: none;">
            </form>
            <form action="php/deletePicture.php" method="post" class="delete-form">
                <button>Delete Picture</button>
            </form>
        </div>
    </div>
    <script src="../js/options.js"></script>
    <script>
        (async function () {
            const nameOfFile = fileName.textContent.trim();
            const inpField = document.querySelector('.filenameField');
            inpField.value = nameOfFile;
            const delPicForm = document.querySelector('.delete-form');
                delPicForm.appendChild(inpField.cloneNode());
                delPicForm.appendChild(password.cloneNode());
            (await loadOptions()).setupCheckBoxes();
            // let pictures = JSON.parse(await fetch(`${location.origin}/data.php`).then(data => data.text()).then(text => text));
            let pictures = JSON.parse(await fetch(`https://jannaandalesha.000webhostapp.com/data.php`).then(data => data.text()).then(text => text));

            for (const pic of pictures) {
                if (!pic.src.includes(nameOfFile)) continue;
                tags = pic.tags;
                names = pic.names;
                break;
            }
            (await loadOptions('.tags-remove', true, '.remove-names-list')).setupCheckBoxes();

            document.querySelector('.content').addEventListener('click', e => {
                const btn = e.target.closest('button[type="button"]');
                if (btn) {
                    btn.insertAdjacentElement('beforebegin', btn.previousElementSibling.cloneNode(true));
                }
            })
        })();
    </script>
</body>
</html>