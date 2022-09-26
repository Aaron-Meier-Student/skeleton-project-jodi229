
let tags, names;

const loadOptions = async function () {
    if (!tags) {
        // const data = JSON.parse(await fetch(`${location.origin}/data/tags.json`).then(data => data.text()).then(text => text));
        // const data = JSON.parse(await fetch(`https://grtcfamily.com/data/tags.json`).then(data => data.text()).then(text => text));
        const data = JSON.parse(await fetch(`https://grtcfamily.com/tags.php`).then(data => data.text()).then(text => text));
        tags = data.tags;
        names = data.names;
    }

    return new Promise (resolve => {
        resolve({
            tags,
            names,
            setupCheckBoxes: (tagsParentName = '.filter-classes', namesParentName = '.names-list', remove) => {
                fillCheckBoxes(tagsParentName, tags, 'tags', remove);
                fillCheckBoxes(namesParentName, names, 'names', remove);
            }
        });
    })
    
}

function fillCheckBoxes (parntClass, data = [], formName, remove) {
    const parentClass = document.querySelector(parntClass);
    if (!parentClass) return;
    parentClass.innerHTML = '';
    data.forEach(el => parentClass.insertAdjacentHTML('beforeend', newCheckbox(el, formName, remove)));
}

function newCheckbox (val, formName, remove) {
    const id = Math.random().toString().replace('.','');
    return `
        <div class="check-box-hld">
            <input name="${formName}${remove?'Remove':''}[]" type="checkbox" id="${id}" value="${val}">
            <label for="${id}">${val}</label>
        </div>
    `;
}

