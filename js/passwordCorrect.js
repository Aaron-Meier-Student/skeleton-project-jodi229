

(async function () {

    const options = await loadOptions();
    options.setupCheckBoxes();
    options.setupCheckBoxes('.remove-tags-list', '.remove-names-list', false);

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

    setUpSearch(options.names, document.querySelectorAll('.names-list input'));

    //UPDATE TAGS SECTION

    const dataType = ['Name', 'Tag'];
    
    const uploadPicFrm = document.querySelector('.upload-pic-form');
    const select = document.getElementById('oldDataSelect');
    const addNewData = document.querySelector('.add-new-data')
        

    addNewData.innerHTML = addNewDataInput(dataType[1]);

    checkboxes.forEach(el => select.insertAdjacentHTML('beforeend', `
        <option value="${el.value}">${el.value}</option>
    `));

    document.querySelector('.data-change-select').addEventListener('change', e => {
        document.querySelector('.remove-tags-list').classList.toggle('hidden');
        document.querySelector('.remove-names-list').classList.toggle('hidden');

        dataType.reverse();

        addNewData.innerHTML = addNewDataInput(dataType[1]);

        select.name = select.name.replace(...dataType);

        select.innerHTML = '<option value=""></option>';

        options[e.target.value].forEach(el => select.insertAdjacentHTML('beforeend', `
            <option value="${el}">${el}</option>
        `));

        select.nextElementSibling.name = select.nextElementSibling.name.replace(...dataType);

        document.querySelectorAll('h2').forEach(el => el.textContent = el.textContent.replace(...dataType));
    });

    ///////////

    //swith between forms.
    let currentForm = uploadPicFrm;

    document.querySelectorAll('.chngForm').forEach(btn => btn.addEventListener('click', e => {
        currentForm.style.display = 'none';

        const newForm = document.querySelector(`.${btn.dataset.formclass}-form`);
        newForm.style.display = 'block';
        currentForm = newForm;
    }));

})();
