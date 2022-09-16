

function setUpSearch (names, checkBoxes) {
    const namesList = document.getElementById('namesList');
    const nameSearch = document.getElementById('nameSearch');
    const form = document.getElementById('searchNamesForm');

    names.forEach(name => {
        namesList.insertAdjacentHTML('beforeend', `<option>${name}</option>`);
    });

    nameSearch.addEventListener('change', e => {
        nameSearch.setCustomValidity('');
        if(names.indexOf(nameSearch.value) >= 0 || !nameSearch.value) return;

        const noMatches = names.every(name => {
            if (!name.toLowerCase().includes(nameSearch.value.toLowerCase())) return true;
            nameSearch.value = name;
            return false;
        });

        if (!noMatches) return;
        nameSearch.setCustomValidity('This name is not in the list.');
    });


    form.addEventListener('submit', e => {
        e.preventDefault();
        if (!nameSearch.value) return;

        for (let i = 0; i < checkBoxes.length; i++) {
            const checkbox = checkBoxes[i];
            if (checkbox.parentNode.textContent.trim() === nameSearch.value) {
                checkbox.checked = !checkbox.checked;
                setFilters({}, checkbox.outerHTML);
                break;
            }
        }

        nameSearch.value = '';
    });
}
