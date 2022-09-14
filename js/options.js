
let tags, names;

const loadOptions = function (tagsParentName = '.filter-classes', remove, namesParentName = '.names-list') {
    console.log('hi');
    return new Promise(resolve => {
        (async function () {

            if (!tags) {
                // const data = JSON.parse(await fetch(`${location.origin}/data/tags.json`).then(data => data.text()).then(text => text));
                const data = JSON.parse(await fetch(`https://grtcfamily.com/data/tags.json`).then(data => data.text()).then(text => text));
                tags = data.tags;
                names = data.names;
            }
        
            resolve({
                setupCheckBoxes: () => {
                    fillCheckBoxes(tagsParentName, tags, 'tags');
                    fillCheckBoxes(namesParentName, names, 'names');
                },
                tags,
                names
            })
            
            function fillCheckBoxes (parntClass, data = [], formName) {
                const parentClass = document.querySelector(parntClass);
                if (!parentClass) return;
                parentClass.innerHTML = '';
                data.forEach(el => parentClass.insertAdjacentHTML('beforeend', newCheckbox(el, formName)));
            }

            function newCheckbox (val, formName) {
                return `
                    <div class="check-box-hld">
                        <input name="${formName}${remove?'Remove':''}[]" type="checkbox" id="${formName}-${val}" value="${val}">
                        <label for="${formName}-${val}">${val}</label>
                    </div>
                `;
            }
        })();
    })
}

