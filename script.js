let items = [];
let sortDirection = [];
let selectedItems = new Set();

        // Fetch the CSV file (assuming it's named 'Resources.csv')
        fetch('Resources.csv')
            .then(response => response.text())
            .then(csvData => displayCSVData(csvData))
            .catch(error => console.error('Error fetching CSV:', error));

        function displayCSVData(csvData) {
            const table = document.getElementById('csvTable');
            table.innerHTML = ''; // Clear existing table content

            const rows = csvData.split('\n');
            rows.forEach(row => {
                const cells = row.split(',');
                const newRow = table.insertRow();
                cells.forEach(cell => {
                    const newCell = newRow.insertCell();
                    newCell.textContent = cell;
                });
            });
        }

function displayTable(data) {
    const table = document.getElementById('csvTable');
    table.innerHTML = '';

    const headerRow = document.createElement('tr');
    headerRow.appendChild(document.createElement('th')); // Add an empty header for the checkbox column
    data[0].forEach((cell, index) => {
        const th = document.createElement('th');
        th.classList.add('header');
        const span = document.createElement('span');
        span.textContent = cell;
        th.appendChild(span);
        const arrow = document.createElement('span');
        arrow.textContent = ' ↑↓';
        arrow.classList.add('arrow');
        arrow.addEventListener('click', () => sortData(index));
        th.appendChild(arrow);
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    for (let i = 1; i < data.length; i++) {
        const dataRow = document.createElement('tr');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('row-checkbox');
        checkbox.checked = selectedItems.has(data[i].join(','));
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                dataRow.classList.add('selected');
                selectedItems.add(data[i].join(','));
            } else {
                dataRow.classList.remove('selected');
                selectedItems.delete(data[i].join(','));
            }
            updateClearSelectionButton();
        });
        const checkboxCell = document.createElement('td');
        checkboxCell.appendChild(checkbox);
        dataRow.appendChild(checkboxCell);
        data[i].forEach((cell, cellIndex) => {
            const td = document.createElement('td');
            if (cellIndex === 0) {
                const img = document.createElement('img');
                img.src = cell;
                img.alt = 'Thumbnail';
                img.classList.add('thumbnail');
                td.appendChild(img);
            } else {
                td.textContent = cell;
            }
            dataRow.appendChild(td);
        });
        if (selectedItems.has(data[i].join(','))) {
            dataRow.classList.add('selected');
        }
        table.appendChild(dataRow);
    }
}

function sortData(columnIndex) {
    const dataToSort = items.slice(1); // Exclude the header row from sorting
    dataToSort.sort((a, b) => {
        const aValue = isNaN(Date.parse(a[columnIndex])) ? a[columnIndex] : new Date(a[columnIndex]);
        const bValue = isNaN(Date.parse(b[columnIndex])) ? b[columnIndex] : new Date(b[columnIndex]);
        if (typeof aValue === 'string') {
            return sortDirection[columnIndex] * aValue.localeCompare(bValue);
        } else {
            return sortDirection[columnIndex] * (aValue - bValue);
        }
    });
    sortDirection[columnIndex] *= -1;
    items = [items[0], ...dataToSort]; // Add the header row back after sorting
    displayTable(items);
}

function exportCSV() {
    const title = document.getElementById('titleInput').value;
    const contactPerson = document.getElementById('contactPersonInput').value;
    const startDateTime = document.getElementById('startDateTimeInput').value;
    const endDateTime = document.getElementById('endDateTimeInput').value;
    const selectedRows = Array.from(selectedItems).map(item => item.split(','));
    const csvContent = 'data:text/csv;charset=utf-8,' + `Title,${title}\nContact Person,${contactPerson}\nStart Date & Time,${startDateTime}\nEnd Date & Time,${endDateTime}\nNumber of Items Selected,${selectedRows.length}\n` + [items[0], ...selectedRows].map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'export.csv');
    document.body.appendChild(link); // Required for Firefox
    link.click();
}

function clearSelection() {
    selectedItems.clear();
    displayTable(items);
    updateClearSelectionButton();
}

function updateClearSelectionButton() {
    const clearSelectionButton = document.getElementById('clearSelectionButton');
    clearSelectionButton.textContent = `Clear Selection (${selectedItems.size})`;
    if (selectedItems.size > 0) {
        clearSelectionButton.classList.add('amber');
    } else {
        clearSelectionButton.classList.remove('amber');
    }
}

const csvFileInput = document.getElementById('csvFileInput');
csvFileInput.addEventListener('change', handleFileUpload);

const exportButton = document.getElementById('exportButton');
exportButton.addEventListener('click', exportCSV);

const clearSelectionButton = document.getElementById('clearSelectionButton');
clearSelectionButton.addEventListener('click', clearSelection);

/* Add your existing JavaScript here */

let isTableView = true;

document.getElementById('toggleViewButton').addEventListener('click', toggleView);

function toggleView() {
    isTableView = !isTableView;
    if (isTableView) {
        document.getElementById('csvTable').style.display = '';
        document.getElementById('csvGallery').style.display = 'none';
        displayTable(items);
    } else {
        document.getElementById('csvTable').style.display = 'none';
        document.getElementById('csvGallery').style.display = '';
        displayGallery(items);
    }
}

function displayGallery(data) {
    const gallery = document.getElementById('csvGallery');
    gallery.innerHTML = '';

    for (let i = 1; i < data.length; i++) {
        const div = document.createElement('div');
        div.classList.add('gallery-item');
        data[i].forEach((cell, cellIndex) => {
            const p = document.createElement('p');
            p.textContent = data[0][cellIndex] + ': ' + cell; // Display the header label and the cell data
            if (cellIndex === 0) {
                const img = document.createElement('img');
                img.src = cell;
                img.alt = 'Thumbnail';
                img.classList.add('thumbnail');
                div.appendChild(img);
            } else {
                div.appendChild(p);
            }
        });
        gallery.appendChild(div);
    }
}
