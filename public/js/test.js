const postContainer = document.getElementById('post_container')

const divGrid = document.createElement('div');
divGrid.className = 'row masonry-grid';
postContainer.appendChild(divGrid);

const divColumn = document.createElement('div');
divColumn.className = 'col-md-6 col-lg-6 masonry-column';
divGrid.appendChild(divColumn);


const paragraph = document.createElement('p')
paragraph.textContent = 'Hi';