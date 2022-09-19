

(async function () {

    // (await loadOptions()).setupCheckBoxes();

    const options = await loadOptions();
    options.setupCheckBoxes();

    (await loadOptions('.remove-tags-list', false, '.remove-names-list')).setupCheckBoxes();

    const checkboxes = Array.from(document.querySelectorAll('.filter-classes input'));

    document.querySelector('form').addEventListener('submit', e => {
        if (checkboxes.every(el => !el.checked)) {
            e.preventDefault();
            alert("remember to add the tags...")
        }
    });

    let newTagInputs;
    let parntTagInps;

    noSpaceOuter();

    document.body.addEventListener('click', e => {
        const btn = e.target.closest('.new-tag-btn');
        if (!btn) return;
        btn.parentElement.insertAdjacentHTML(
            'afterbegin',
            btn.previousElementSibling.outerHTML
        );
        noSpaceOuter();
    })

    function noSpaceOuter () {
        newTagInputs = document.querySelectorAll('.newTagInp');
        parntTagInps = document.querySelectorAll('.parentTagInput');

        newTagInputs.forEach(el => {
            el.removeEventListener('keypress', noSpace);
            el.addEventListener('keypress', noSpace);
        })
        function noSpace (e) {
            if(e.key === ' ') e.preventDefault();
        }
    }

    function addNewDataInput (dataType)  {
        const dataLowerCase = dataType.toLowerCase();
        return `
            <div>
                <input class="newTagInp" name="new${dataType}s[]" placeholder="new ${dataLowerCase}">
            </div>
            <button class="new-tag-btn" type="button">add another new ${dataLowerCase}</button>
        `;
    }

    //UPDATE TAGS SECTION

    const data2update = ['Name', 'Tag'];
    
    const uploadPicFrm = document.querySelector('.upload-pic-form');

    const addNewData = document.querySelector('.add-new-data')
        
    addNewData.innerHTML = addNewDataInput(data2update[1]);
    
    const select = document.getElementById('oldDataSelect');

    checkboxes.forEach(el => select.insertAdjacentHTML('beforeend', `
        <option value="${el.value}">${el.value}</option>
    `));

    document.querySelector('.data-change-select').addEventListener('change', e => {
        document.querySelector('.remove-tags-list').classList.toggle('hidden');
        document.querySelector('.remove-names-list').classList.toggle('hidden');

        data2update.reverse();

        addNewData.innerHTML = addNewDataInput(data2update[1]);

        select.name = select.name.replace(...data2update);

        select.innerHTML = '<option value=""></option>';

        options[e.target.value].forEach(el => select.insertAdjacentHTML('beforeend', `
            <option value="${el}">${el}</option>
        `));

        select.nextElementSibling.name = select.nextElementSibling.name.replace(...data2update);

        document.querySelectorAll('h2').forEach(el => el.textContent = el.textContent.replace(...data2update));
    });

    ///////////

    //swith between forms.
    let currentForm = uploadPicFrm;

    document.querySelectorAll('.chngForm').forEach(el => el.addEventListener('click', e => {
        currentForm.style.display = 'none';

        const newForm = document.querySelector(`.${el.dataset.formclass}-form`);
        newForm.style.display = 'block';
        currentForm = newForm;
    }));

})();
