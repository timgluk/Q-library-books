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
    date: Number(new Date()),
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
    date: Number(new Date()),
    read: false
  };
  console.log(book);
  listBooks.push(book);
  console.log(listBooks);

  listBooksAdd(book);
});

// Список

const boxListBooks = document.querySelector('.list__box-list');

function listBooksAdd(book) {
  const item = document.createElement('li');
  item.className = 'list__item';
  item.innerHTML = book.title;
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

  item.addEventListener('click', event => {
    if (event.target.className === 'list__clear') {
    item.remove();
    for (let i = 0; i < listBooks.length; i++) {
      if (listBooks[i].date === book.date) {
        listBooks.splice(i, 1);
        break;
      }
    };
    console.log(listBooks);
    };
    
    if (event.target.className === 'list__finished') {
      for (let i = 0; i < listBooks.length; i++) {
        if (listBooks[i].date === book.date) {
          if (listBooks[i].read === false) {
            listBooks[i].read = true
            item.style.backgroundColor = 'rgb(199, 167, 131, 0.7)';
          } else {
            listBooks[i].read = false;
            item.style.backgroundColor = '#fff';
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

    if (event.target.className === 'list__read') {
      bookBox.className = 'list__book-box';
      bookBox.innerHTML = `<p>${book.text}</p>`;
    };

    if (event.target.className === 'list__edit') {
      bookBox.className = 'list__book-box';
      bookBox.innerHTML = `<p class="edited-text" contenteditable="true">${book.text}</p>`;
      const editedText = document.querySelector('.edited-text');
  
      const ok = document.createElement('button');
      ok.className = 'list__ok'
      ok.innerHTML = 'OK';
      bookBox.append(ok);
      ok.addEventListener('click', () => {
        book.text = editedText.innerHTML
        console.log(editedText);
      });
    };
  });

};

listBooks.forEach((book, id) => listBooksAdd(book, id));

window.addEventListener('beforeunload', () => {
  localStorage.setItem('listBooks', JSON.stringify(listBooks));
});
