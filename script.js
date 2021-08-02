const listBooks = JSON.parse(localStorage.getItem('listBooks')) ?? [];
const formUpload = document.querySelector('.upload');

// Добавить книгу

const radioAdd = document.querySelector('#add-book');
const radioWrite = document.querySelector('#write-book');

const formWrite = document.querySelector('.write');
const submit = document.querySelector('.write__submit');
const title = document.querySelector('.write__title-book');
const text = document.querySelector('.write__text-book');

const mainContainer = document.querySelector('.container');
const bookBox = document.createElement('div');
bookBox.className = 'list__book-box';

mainContainer.after(bookBox);

radioAdd.addEventListener('change', () => {
  if (radioAdd.checked) {
    console.log('true');
    formUpload.style.display = 'block';
    formWrite.style.display = 'none';
  };
});

radioWrite.addEventListener('change', () => {
  if (radioWrite.checked) {
    console.log('true');
    formWrite.style.display = 'block';
    formUpload.style.display = 'none';
  };
})

// Загрузить файл

const url = 'https://apiinterns.osora.ru/ '

formUpload.addEventListener('submit', async (e) => {
  e.preventDefault()

  const file = document.querySelector('.file').files[0];
  const formData = new FormData();

  formData.append('login', 'String');
  formData.append('file', file);

  let response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  let result = await response.json();
  console.log(result);

  let book = {
    title: result.title,
    text: result.text,
    date: Date.now(),
    read: false
  };

  listBooks.push(book);
  console.log(listBooks);

  //localStorage.setItem('listBooks', JSON.stringify(listBooks));
  listBooksAdd(book);
  //listBooksAdd(book);
});

// Написать книгу

submit.addEventListener('click', (e) => {
  e.preventDefault(); 
  let book = {
    title: title.value,
    text: text.value,
    date: Date.now(),
    read: false
  };
  //console.log(book);
  listBooks.push(book);
  //console.log(listBooks);

  listBooksAdd(book);
});

// Список

const boxListBooks = document.querySelector('.list__box-list');

boxListBooks.addEventListener('click', () =>{ handle(event) });

function handle(event) {
  const li = event.target.closest('.list__item');
  
  if (event.target.closest('.list__clear')) {
    li.remove();
    for (let i = 0; i < listBooks.length; i++) {
      if (listBooks[i].date === Number(li.getAttribute('data-date'))) {
        listBooks.splice(i, 1);
        console.log(listBooks);
        break;
      };
    };
  };

  if (event.target.closest('.list__finished')) {
    for (let i = 0; i < listBooks.length; i++) {
      if (listBooks[i].date === Number(li.getAttribute('data-date'))) {
        if (listBooks[i].read === false) {
          listBooks[i].read = true
          li.style.backgroundColor = 'rgb(199, 167, 131, 0.7)';
        } else {
          listBooks[i].read = false;
          li.style.backgroundColor = '#fff';
        };
        break;
      }
    };
    function fn(a,b) {
      if (a.read === false && b.read === false) { return a.date - b.date };
      if (a.read === true && b.read === true) { return a.date - b.date };
      if (a.read === false && b.read === true) { return b.read - a.read };
      if (a.read === true && b.read === false) { return b.read - a.read };
    };
    listBooks.sort(fn);
    console.log(listBooks);
  };

  if (event.target.closest('.list__read')) {
    for (let i = 0; i < listBooks.length; i++) {
      if (listBooks[i].date === Number(li.getAttribute('data-date'))) {
        bookBox.innerHTML = `<p class="edited-text">${listBooks[i].text}</p>`;
        console.log(listBooks);
        break;
      };
    };
  };

  if (event.target.className === 'list__edit') {
    const ok = document.createElement('button');
    ok.className = 'list__ok'
    ok.innerHTML = 'OK';
    for (let i = 0; i < listBooks.length; i++) {
      if (listBooks[i].date === Number(li.getAttribute('data-date'))) {
        bookBox.innerHTML = `<p class="edited-text" contenteditable="true">${listBooks[i].text}</p>`;
        const editedText = document.querySelector('.edited-text');
        bookBox.append(ok);
        console.log(listBooks);
        ok.addEventListener('click', () => {
          listBooks[i].text = editedText.innerHTML;
          console.log(editedText);
        });
        break;
      };
    };
  };
};

function listBooksAdd(book) {
  const item = document.createElement('li');
  item.className = 'list__item';
  item.innerHTML = book.title;
  item.setAttribute('data-date', book.date);
  item.setAttribute('data-finished', book.read);
  item.setAttribute('draggable', true);
  //item.setAttribute('draggable', true);
  //item.style.cursor = 'move';
  //cursor: move;
  //draggable="true"

  boxListBooks.append(item);

  const clear = document.createElement('button');
  clear.className = 'list__clear';
  clear.innerHTML = 'X';
  clear.style.cursor = 'pointer';
  item.append(clear);

  const finished = document.createElement('button');
  finished.className = 'list__finished';
  finished.innerHTML = 'прочитано';
  finished.style.cursor = 'pointer';
  clear.after(finished);

  if (book.read === true) {
    item.style.backgroundColor = 'rgb(199, 167, 131, 0.7)';
  };
  
  const read = document.createElement('button');
  read.className = 'list__read';
  read.innerHTML = 'читать';
  read.style.cursor = 'pointer';
  finished.after(read);

  const edit = document.createElement('button');
  edit.className = 'list__edit';
  edit.innerHTML = 'редактировать';
  edit.style.cursor = 'pointer';
  read.after(edit);
};

listBooks.forEach((book, id) => listBooksAdd(book, id));

// Drag and Drop

const favorite = document.querySelector('.favorite__list');

boxListBooks.addEventListener('dragstart', (event) => {
  event.dataTransfer.effectAllowed='copy';
  //ev.dataTransfer.effectAllowed='move';
  event.target.classList.add('selected');
  event.dataTransfer.setData('content', event.target.className);
  console.log('start');
});

boxListBooks.addEventListener('dragend', (event) => {
  event.target.classList.remove('selected');
  console.log('end');
});

favorite.ondragover = () => false;

favorite.addEventListener('drop', (event) => {
  // Разрешаем сбрасывать элементы в эту область
  //event.dataTransfer.effectAllowed='copy';

  //event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
  console.log(event.dataTransfer.getData('content'));

  const activeElement = boxListBooks.querySelector('.selected');
 
  favorite.append(activeElement);
  //favorite.append(boxListBooks.getElementsByClassName(event.dataTransfer.getData('content')));
});

favorite.addEventListener('click', () =>{ handle(event) });


// Сохраняем

window.addEventListener('beforeunload', () => {
  localStorage.setItem('listBooks', JSON.stringify(listBooks));
});
