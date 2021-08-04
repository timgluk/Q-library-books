const listBooks = JSON.parse(localStorage.getItem('listBooks')) ?? [];
const formUpload = document.querySelector('.add__upload');

// Добавить книгу

const radioAdd = document.querySelector('#add-book');
const radioWrite = document.querySelector('#write-book');

const formWrite = document.querySelector('.add__write');
const submit = document.querySelector('.write__submit');
const title = document.querySelector('.write__title-book');
const text = document.querySelector('.write__text-book');

const mainContainer = document.querySelector('.container');
const bookBox = document.createElement('div');
bookBox.className = 'list__book-box';

mainContainer.after(bookBox);

if (radioAdd.checked) {
  console.log('true');
  formUpload.style.display = 'block';
  formWrite.style.display = 'none';
};

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
    formWrite.style.display = 'flex';
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
    read: false,
    favorite: false,
  };

  listBooks.push(book);
  console.log(listBooks);
  listBooksAdd(book);
});

// Написать книгу

submit.addEventListener('click', (e) => {
  e.preventDefault(); 
  let book = {
    title: title.value,
    text: text.value,
    date: Date.now(),
    read: false,
    favorite: false,
  };
  listBooks.push(book);
  listBooksAdd(book);
});

// Список
const main = document.querySelector('.container');
const favorite = document.querySelector('.favorite__list');

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
          listBooks[i].read = true;
          li.style.textDecoration = 'line-through';
          li.style.fontStyle = 'italic';
        } else {
          listBooks[i].read = false;
          li.style.textDecoration = 'none';
          li.style.fontStyle = 'normal';
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
        bookBox.style.visibility = 'visible';
        bookBox.style.opacity = 1;
        bookBox.innerHTML = 
        `<p class="edited-text">${listBooks[i].text}</p>
        <button class="close-modal"></button>`;
        const closeModal = document.querySelector('.close-modal');
        closeModal.onclick = () => {
          bookBox.style.visibility = 'hidden';
          bookBox.style.opacity = 0;
        };
        console.log(listBooks);
        break;
      };
    };
  };

  if (event.target.className === 'list__edit') {
    const ok = document.createElement('button');
    ok.className = 'list__ok'
    ok.innerHTML = '';
    ok.setAttribute('data-tooltip', 'Сохранить изменения');

    for (let i = 0; i < listBooks.length; i++) {
      if (listBooks[i].date === Number(li.getAttribute('data-date'))) {
        bookBox.style.visibility = 'visible';
        bookBox.style.opacity = 1;
        bookBox.innerHTML = 
        `<p class="edited-text" contenteditable="true">${listBooks[i].text}</p>`;
        const editedText = document.querySelector('.edited-text');
        bookBox.append(ok);
        console.log(listBooks);
        ok.addEventListener('click', () => {
          listBooks[i].text = editedText.innerHTML;
          console.log(editedText);
          bookBox.style.visibility = 'hidden';
          bookBox.style.opacity = 0;
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
  item.style.cursor = 'move';

  if (book.favorite === true) {
    favorite.append(item);
  } else {
    boxListBooks.append(item);
  };

  const buttonBox = document.createElement('div');
  buttonBox.className = 'list__button-box';
  item.append(buttonBox);

  const clear = document.createElement('button');
  clear.className = 'list__clear';
  clear.innerHTML = '';
  clear.style.cursor = 'pointer';
  clear.setAttribute('data-tooltip', 'Удалить книгу');
  buttonBox.append(clear);

  const finished = document.createElement('button');
  finished.className = 'list__finished';
  finished.innerHTML = '';
  finished.setAttribute('data-tooltip', 'Книга прочитана');
  finished.style.cursor = 'pointer';
  clear.after(finished);

  if (book.read === true) {
    item.style.textDecoration = 'line-through';
    item.style.fontStyle = 'italic';
  };
  
  const read = document.createElement('button');
  read.className = 'list__read';
  read.innerHTML = '';
  read.setAttribute('data-tooltip', 'Читать книгу');
  read.style.cursor = 'pointer';
  finished.after(read);

  const edit = document.createElement('button');
  edit.className = 'list__edit';
  edit.innerHTML = '';
  edit.setAttribute('data-tooltip', 'Редактровать книгу');
  edit.style.cursor = 'pointer';
  read.after(edit);
};

listBooks.forEach((book, id) => listBooksAdd(book, id));

// Drag and Drop

main.addEventListener('dragstart', (event) => {
  event.target.classList.add('selected');
  console.log('start');
});

main.addEventListener('dragend', (event) => {
  event.target.classList.remove('selected');
  console.log('end');
});

main.ondragover = () => false;

boxListBooks.addEventListener('drop', (event) => {
  const activeElement = favorite.querySelector('.selected');
  if (activeElement !== null) {
    boxListBooks.append(activeElement);
    for (let i = 0; i < listBooks.length; i++) {
      if (listBooks[i].date === Number(activeElement.getAttribute('data-date'))) {
        listBooks[i].favorite = false;
        console.log(listBooks[i].favorite);
        break;
      };
    };
  };
});

favorite.addEventListener('drop', (event) => {
  const activeElement = boxListBooks.querySelector('.selected');

  if (activeElement !== null) {
    favorite.append(activeElement);
    for (let i = 0; i < listBooks.length; i++) {
      if (listBooks[i].date === Number(activeElement.getAttribute('data-date'))) {
        listBooks[i].favorite = true;
        console.log(listBooks[i].favorite);
        break;
      };
    };
  };
});

favorite.addEventListener('click', () =>{ handle(event) }); // работа кнопок в списке фавоитов

// Сохраняем

window.addEventListener('beforeunload', () => {
  localStorage.setItem('listBooks', JSON.stringify(listBooks));
});
