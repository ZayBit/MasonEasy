const masonEasy = (masonEasyId = 'masonEasy', config_mason) => {
    // default options
    let config = {
    selector: '.item',
    filter_mode: true,
    scrollWidth: 17,
    filterControls: '.filter-controls',
    currentCategoryClass: 'select-category',
    transition: 300
    }
    const {
        selector,
        filter_mode,
        scrollWidth,
        filterControls,
        currentCategoryClass,
        transition
    } = {...config,...config_mason};

    // contenedor principal
    const container = document.getElementById(masonEasyId),
        // todos los elementos del contenedor principal
        item = container.querySelectorAll(selector),
        // botones para filtrar los elementos
        buttons_filter = document.querySelectorAll(`${filterControls} [data-category]`),
        item_length = item.length,
        buttons_filter_length = buttons_filter.length,
        // ancho del elemento + el margen 
        margin = parseInt(window.getComputedStyle(item[0]).margin),
        current_item_width = item[0].clientWidth + margin;

    container.style.opacity = 0;

    let filtered_items = false,
        continue_filter = true;
    window.onresize = () => generar();
    document.body.onload = () => {
        generar();
        filterSys();
        container.style.opacity = 1;
    }
    // Masonry
    function generar() {
        let item_row_counter = 0,
            maxHeight = [],
            positions_y = [],
            positions_x = [];

        item[0].style.removeProperty('display');

        let width_container = container.clientWidth,
            total_row_items = parseInt((width_container) / current_item_width);

        if (total_row_items === 0) total_row_items = 1;
        for (let i = 0; i < total_row_items; i++) {
            positions_y.push(0);
        }
        let item_collection = (filtered_items) ? document.querySelectorAll(`.${currentCategoryClass}`) : item;
        item_collection.forEach((el, index) => {
            // crear la primer fila
            if (index < total_row_items) {
                positions_x.push((current_item_width * index) + parseInt((width_container - (current_item_width * total_row_items)) / 2) - margin + scrollWidth);

                el.style = `position:absolute;left:${positions_x[index]}px;top:0px;transition:all ${transition}ms ease`;

                maxHeight.push(el.offsetHeight + margin);
            }
            if (index >= total_row_items) {
                if (item_row_counter >= total_row_items) item_row_counter = 0;
                maxHeight[item_row_counter] += el.offsetHeight + margin;

                let prevItem = item_collection[parseInt(index - total_row_items)];
                positions_y[item_row_counter] += prevItem.offsetHeight + margin;

                el.style = `position:absolute;left:${positions_x[item_row_counter]}px;top:${positions_y[item_row_counter]}px;transition:all ${transition}ms ease`;
                item_row_counter++;

            }
            let condition = (filtered_items) ? item_collection.length : item_length;
            if (index >= condition - 1) container.style = `height:${Math.max(...maxHeight)}px;transition:all ${transition}ms ease`;
        })
    }
    // filter system
    function checkCurrentCategory(category) {
        let same_category = false;
        item.forEach((el) => {
            if (el.classList.contains(currentCategoryClass)) {
                if (el.dataset.category == category) {
                    same_category = true;
                }
            }
        });
        return same_category;
    }
    function filterSys() {
        if (!filter_mode || buttons_filter_length === 0) return;
        for (let i = 0; i < buttons_filter_length; i++) {
            buttons_filter[i].addEventListener('click', function (e) {
                if (!continue_filter) return;
                continue_filter = false;
                e.preventDefault();
                buttons_filter.forEach(button_class => {
                    if (button_class.classList.contains('current-category')) {
                        button_class.classList.remove('current-category');
                    }
                });
                let data = this.dataset.category;
                this.classList.add('current-category');
                if (!checkCurrentCategory(data)) {

                    let count_in_x = 0,
                        count_in_y = 0,
                        currentCategoryIndexs = [],
                        maxHeight = [],
                        total_rows = parseInt(container.clientWidth / current_item_width);

                    if (total_rows === 0) total_rows = 1;

                    let total_height_columns = [];
                    for (let i = 0; i < total_rows; i++) {
                        total_height_columns.push(0);
                    }

                    let originalPositions = [];
                    for (let i = 0; i < item_length; i++) {
                        let current_item = item[i];
                        current_item.style.removeProperty('display');
                        if (count_in_x >= total_rows) {
                            count_in_x = 0;
                        }

                        originalPositions.push({
                            x: current_item_width * count_in_x + parseInt((container.clientWidth - (current_item_width * total_rows)) / 2) - margin + scrollWidth,
                            height: current_item.offsetHeight + margin,
                            y: current_item.offsetTop
                        });

                        count_in_x++;
                    }
                    count_in_x = 0;
                    item.forEach((current_item, i) => {
                        if (data != 'all') {
                            if (current_item.dataset.category == data) {
                                filtered_items = true;
                                currentCategoryIndexs.push(i);

                                current_item.style.opacity = 1;

                                let conditionY = (currentCategoryIndexs.length >= total_rows) ? currentCategoryIndexs[count_in_x - total_rows] : undefined;

                                if (conditionY != undefined) {
                                    if (count_in_y >= total_rows) {
                                        count_in_y = 0;
                                    }
                                    total_height_columns[count_in_y] += item[conditionY].offsetHeight + margin;

                                    current_item.style = `position:absolute;left:${originalPositions[count_in_x].x}px;top:${total_height_columns[count_in_y]}px;transition:all ${transition}ms ease`;

                                    current_item.classList.add(currentCategoryClass);

                                    maxHeight[count_in_y] += current_item.offsetHeight + margin;

                                    count_in_y++;
                                } else {
                                    current_item.style = `position:absolute;left:${originalPositions[count_in_x].x}px;top:0px;transition:all ${transition}ms ease`;

                                    current_item.classList.add(currentCategoryClass);

                                    maxHeight.push(current_item.offsetHeight + margin);
                                }
                                count_in_x++;

                            } else {
                                current_item.style = `position:absolute;left:${originalPositions[i].x}px;top:${originalPositions[i].y}px;opacity:0;transform:scale(0.5);transition:all ${transition}ms ease`;
                                setTimeout(function () {
                                    current_item.style.display = 'none';
                                    continue_filter = true;
                                }, transition)
                                current_item.classList.remove(currentCategoryClass);
                            }

                        } else {
                            filtered_items = false;
                            if (count_in_x >= total_rows) {
                                count_in_x = 0;
                            }
                            if (i >= total_rows) {

                                total_height_columns[count_in_x] += originalPositions[i - total_rows].height;
                                current_item.style = `position:absolute;left:${originalPositions[i].x}px;top:${total_height_columns[count_in_x]}px;opacity:1;transition:all ${transition}ms ease`;

                            } else {

                                current_item.style = `position:absolute;left:${originalPositions[i].x}px;top:0px;opacity:1;transition:all ${transition}ms ease`;
                                for (let i = 0; i < total_height_columns.length; i++) {
                                    total_height_columns[i] = 0;

                                }
                            }
                            current_item.classList.remove(currentCategoryClass);

                            if (maxHeight.length < total_rows) {
                                maxHeight.push(current_item.offsetHeight + margin);
                            } else {
                                maxHeight[count_in_x] += current_item.offsetHeight + margin;
                            }

                            count_in_x++;
                            setTimeout(() => {
                                continue_filter = true
                            }, transition)
                        }
                    })
                    // añadir el alto maximo al contenedor
                    container.style.height = `${Math.max(...maxHeight)}px`;
                }
            });
        }
    }
}
masonEasy('masonEasy',{
    transition:300
})

