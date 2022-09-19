
(async function () {
    // let pictures = JSON.parse(await fetch(`${location.origin}/data/data.json`).then(data => data.text()).then(text => text));
    
    let pictures = JSON.parse(await fetch(`https://grtcfamily.com/data/data.json`).then(data => data.text()).then(text => text));
    
    const content = document.querySelector('.content');
    const showPicsBtn = document.querySelector('.hidden-pics-btn-holder > div');
    const tagSlct = document.querySelector('.person');
    const pictureOrderSlct = document.querySelector('.order');
    const shadyBack = document.querySelector('.img-view-back');
    const imgView = document.querySelector('.img-view');
    const displayedImg = document.querySelector('.img-area img');
    const loadingMsg = document.querySelector('.img-loading-msg');
    const imgClassBase = '.imgs .pic-item';
    let checkBoxs;
    let imgsClass = imgClassBase;
    let noIncludeList = [];
    let posInArr = 0;
    let newImgInd = 0;
    let allowedPics = [];
    const sortOrder = {
        oldest: (cur, next) => new Date(cur.date) - new Date(next.date),
        newest: (cur, next) => new Date(next.date) - new Date(cur.date)
    }

    location.search === '?upload' ? uploadPic() : mainInit();

    function uploadPic () {
        document.querySelector('.admin-psswrd').style.display = 'block';
    }

    function addPictureToContent (picture, id) {
        content.insertAdjacentHTML('beforeend', `
            <div class="wrapper" id="con-${id}">
                <div class="camera"></div>
                ${picture}
            </div>
        `);
        const pic = document.querySelector(`#con-${id} .pic-item`);
        pic.id = `pic-${newImgInd}`;
        newImgInd++;
        
        pic.addEventListener('click', e => displaySinglePic(e.target.id.replace('pic-','') * 1));
        lazyLoad(pic);
    }
    
    function displaySinglePic (picInd) {
        let imgHasLoaded = false;
        setTimeout(() => {
            if(!imgHasLoaded) loadingMsg.style.display = 'block';
        }, 60);
        displayedImg.onload = function () {
            imgHasLoaded = true;
            loadingMsg.style.display = 'none';
        }
        // displayedImg.src = document.getElementById(`pic-${picInd}`).dataset.src;
        displayedImg.src = 'https://grtcfamily.com/' + document.getElementById(`pic-${picInd}`).dataset.src;
        displayedImg.dataset.picInd = picInd;
        
        shadyBack.style.display = 'block';
    
        //DOWNLOAD
        dwnloadLnk = document.querySelector('.img-view a');
        dwnloadLnk.href = displayedImg.src;
        //COPY IMG URL
        document.querySelector('.img-loc').addEventListener('click', () => {
            var input = document.createElement('textarea');
            input.innerHTML = displayedImg.src;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            succesMsg();
        })
        //OPEN IMG IN NEW TAB
        newTabBtn.href = displayedImg.src;
    }

    shadyBack.addEventListener('click', e => {
        if (e.target === shadyBack) {
            shadyBack.style.display = 'none';
        }
    });

    document.querySelector('.arrow-right').addEventListener('click', loadImageRight);
    document.querySelector('.arrow-left').addEventListener('click', loadImageLeft);

    //ALLOW SWIPE FOR IMAGE CHANGE
    displayedImg.addEventListener('touchstart', e => {
        displayedImg.beginX = e.changedTouches[0].screenX;
    });

    displayedImg.addEventListener('touchend', e => {
        displayedImg.endX = e.changedTouches[0].screenX;
        if (displayedImg.endX < displayedImg.beginX - 20) loadImageRight();
        if (displayedImg.endX > displayedImg.beginX + 20) loadImageLeft();
    })

    function loadImageRight () {
        let displayedImgInd = displayedImg.dataset.picInd * 1 + 1;
        while (displayedImgInd > newImgInd - 1) {
            if(!addImgDivToPage()) {
                displayedImgInd = 0;
                break;
            }
        };
        displaySinglePic(displayedImgInd);
    }
    
    function loadImageLeft () {
        let displayedImgInd = displayedImg.dataset.picInd * 1 - 1;
        if (displayedImgInd < 0) {
            while (addImgDivToPage()) {};
            displayedImgInd = newImgInd - 1; 
        }
        displaySinglePic(displayedImgInd);
    }
    
    async function mainInit () {
        resultsTotal.textContent = pictures.length;
        
        pictures.forEach(el => el.names = (el.names || []).map(formatName));
    
        const newOption = val => {
            return `<option value="${val}">${val}</option>`;
        }

        tagSlct.innerHTML = newOption('All');

        const tagOptions = await loadOptions();
        tagOptions.setupCheckBoxes();
        tagOptions.tags.forEach(el => {
            tagSlct.insertAdjacentHTML('beforeend', newOption(el));
        });

        
        checkBoxs = Array.from(document.querySelectorAll('.check-box-hld input'));
        
        setUpSearch(tagOptions.names, checkBoxs);
        
        //Prepare filters...
        setFilters();
        tagSlct.addEventListener('change', setFilters);
        checkBoxs.forEach(el => el.addEventListener('change', setFilters));
        ['date-1', 'date-2'].forEach(el => {
            document.getElementById(el).addEventListener('change', setFilters);
        });

        document.getElementById('date-2').value = new Date().toISOString().substr(0, 10);

        document.querySelectorAll('.checkbox-list').forEach(el => {
            el.insertAdjacentHTML('beforeend', `
                <div class="change-filters-space">
                    <button class="negate-btn">negate all filters</button>
                    <button class="reset-btn">reset filters</button>
                </div>
            `);
            el.addEventListener('click', e => {
                const clickedBtn = e.target.closest('button');
                if (!clickedBtn) return;

                const correctCheckboxes = 
                    Array.from(el.childNodes)
                    .filter(el => el.className?.includes('check-box-hld'))
                    .map(el => el.firstElementChild);
                

                if (clickedBtn.className.includes('reset')) {
                    correctCheckboxes.forEach(el => el.checked = false);
                }
                else if (clickedBtn.className.includes('negate')) {
                    correctCheckboxes.forEach(el => {
                        el.checked = true;
                        el.dataset.type = 'out';
                    })
                }
                // setFilters(el);


                setFilters({}, correctCheckboxes.map(el => el.outerHTML).join(''));
            })
        });

        //First sets images to the value set by user/browser than waits for change.
        changeImageOrder();
        pictureOrderSlct.addEventListener('change', changeImageOrder);

        //this part is very necessary.
        showPicsBtn.addEventListener('click', () => {
            location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
        })

        const fullscreenBtn = document.querySelector('.fullscreen-btn')
        
        fullscreenBtn.addEventListener('click', () => {
            if (document.fullscreenElement === imgView) {
                return document.exitFullscreen();
            }
            imgView.requestFullscreen();
        });

        let btnId;
        imgView.addEventListener('mousemove', () => {
            fullscreenBtn.style.opacity = '1';
            clearInterval(btnId);
            btnId = setTimeout(() => {
                fullscreenBtn.style.opacity = '0';
            }, 600);
        });

        document.addEventListener('scroll', () => {
            let display = 'none';
            if (document.documentElement.scrollTop > innerHeight + 100) {
                display = 'block';
            }
            document.querySelector('.home-btn').style.display = display;
        });

        const sortOrderSlct = document.getElementById('sortOrder');
        const nameSortBySlct = document.getElementById('nameSortBy');

        nameSortBySlct.addEventListener('change', sortNames);
        sortOrderSlct.addEventListener('change', sortNames);
        
        function sortNames () {
            const namesBox = document.querySelector('.names-list');
            const changeFiltersBox = document.querySelector('.names-list .change-filters-space');

            //puts each name divy boi into an array
            let sortedArr = Array.from(document.querySelectorAll('.names-list .check-box-hld'));
    
            sortedArr.sort((cur, next) => {
                //grabs the name from the given div; select value will be 0 for first and 1 for last...
                const getName = div => div.firstElementChild.value.split(' ')[nameSortBySlct.value];
    
                // this select value will change the sort order by multiplying by 1 or -1;
                return getName(cur).localeCompare(getName(next)) * sortOrderSlct.value;
            });

            namesBox.innerHTML = '';
            //adds deleted filterbox to the array so that it will be added back to the parent.
            sortedArr.push(changeFiltersBox);
            sortedArr.forEach(curName => namesBox.insertAdjacentElement('beforeend', curName));
        }
    }
    
    function succesMsg () {
        const msg = document.querySelector('.success');
        msg.style.display = 'block';
        setTimeout(() => {
            msg.style.display = 'none';
        }, 1000)
    }

    // function setFilters (e) {
    window.setFilters = function (e, itemChanged) {
        imgsClass = imgClassBase;
        noIncludeList = [];
        if(tagSlct.value !== 'All') imgsClass += `.${tagSlct.value}`;

        checkBoxs.forEach(checkbox => {
            if (checkbox.value === tagSlct.value) return checkbox.parentElement.style.display = 'none';

            const tag = formatName(checkbox.value);
        
            if (checkbox.checked) {
                checkbox.parentNode.classList.add('checked');
                
                if (checkbox === e?.target || (itemChanged && itemChanged.includes(checkbox.outerHTML))) {
                    checkbox.parentNode.classList.add(`with${checkbox.dataset.type || ''}`);
                    checkbox.dataset.type = checkbox.dataset.type ? '' : 'out';
                }

                //green
                if (checkbox.dataset.type) imgsClass += `.${tag}`;
                //red
                else noIncludeList.push(tag);
            }
            else {
                checkbox.parentNode.classList.remove('checked', 'with', 'without');
            }
            checkbox.parentElement.style.display = 'block';
        });

        content.innerHTML = '';
        newImgInd = 0;
        posInArr = 0;
        allowedPics = pictures.filter(picMeetsAllFilters);
        
        resultsNum.textContent = allowedPics.length;
        loadImagesOntoSite();
    }

    function formatName(name) {
        return name.replace(/ |'/g, '-');
    }

    ////////////////////////////////////////
    ///////Filter section//////
    ////////////

    function picMeetsAllFilters (pic) {
        let appliedTags = imgsClass.split('.');
        //The first three values in "imgsClass" are not tags.
        appliedTags.splice(0, 3);

        const tagsInPic = [...pic.tags, ...pic.names];
        return  (
            appliedTags.every(el => tagsInPic.indexOf(el) >= 0) &&
            noIncludeList.every(el => tagsInPic.indexOf(el) < 0)
            && filterByDate( [ pic ] ).length > 0
        );
    }

    function filterByDate (picList) {
        let aFilterIsEmpty;

        const [date1, date2] = ['date-1', 'date-2'].map(el => {
            let date = document.getElementById(el);

            date = date.value.split('-');
            if (!date[0]) return aFilterIsEmpty = true;
            // moves the year from the back to the front, and then goes back to str.
            // then it returns the date in milliseconds.
            date.push(date.shift());
            return new Date (date.join('/')).getTime();
        });

        if (aFilterIsEmpty) return picList;

        return Array.from(picList).filter(el => {
            const dateInObj = el.dataset ? el.dataset.date : el.date;
            const picDate = new Date (dateInObj).getTime();
            return Math.abs(date1 + date2 - picDate * 2) <= Math.abs(date1 - date2);
        });
    }

    ////////////////////////////////////////
    ///////Image loading section//////
    ////////////

    function changeImageOrder () {
        posInArr = 0;
        pictures = pictures.sort(sortOrder[pictureOrderSlct.value]);
        setFilters();
    }
    
    function addImgDivToPage () {
        const newPic = allowedPics[posInArr];
        if (!newPic) return false;

        newPic.className = `pic-item ${newPic.tags.join(' ')} ${newPic.names.join(' ')}`;
        posInArr++;
        // data-lazy="url('${newPic.src}')"
        
        const newDiv = `
            <div 
                class="${newPic.className}" 
                data-lazy="url('https://grtcfamily.com/${newPic.src}')"
                data-src="${newPic.src}"
                data-date="${newPic.date}"
            ></div>
        `;
        
        addPictureToContent(newDiv, `${Math.random()}`.replace('.',''));

        return true
    }

    function loadImagesOntoSite () {
        const io = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return
                const imgWasAdded = addImgDivToPage();
                observer.disconnect();

                imgWasAdded && loadImagesOntoSite();
            })
        },
        {
            rootMargin: '600px', 
            threshold: 0
        })
        io.observe(showPicsBtn);
    }
    
    function lazyLoad (target) {
        const io = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if(!entry.isIntersecting) return;

                const img = entry.target;
                img.style.backgroundImage = img.dataset.lazy;
                img.parentElement.classList.add('fade');
                observer.disconnect();
            })
        }, {
            threshold: 0.1
        })
        io.observe(target);
    }
})();

// return picInList.filter(el => Math.abs(date1 + date2 - new Date (el.dataset.date).getTime()) <= Math.abs(date1 - date2));
