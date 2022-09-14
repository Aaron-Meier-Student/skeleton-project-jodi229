

function setUpSearch (data) {
    const namesList = document.getElementById('namesList');
    const nameSearch = document.getElementById('nameSearch');
    const form = document.getElementById('searchNamesForm');


    data.forEach(name => {
        namesList.insertAdjacentHTML('beforeend', `<option>${name}</option>`);
    });

    nameSearch.addEventListener('change', e => {
        nameSearch.setCustomValidity('');
        if(data.indexOf(nameSearch.value) >= 0 || !nameSearch.value) return;

        const noMatches = data.every(name => {
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

        console.log(nameSearch.value);
        nameSearch.value = '';
    });
}
