const listBooks = JSON.parse(localStorage.getItem('listBooks')) ?? [];
const formUpload = document.querySelector('.upload');

// Добавить книгу

const radioAdd = document.querySelector('#add-book');
const radioWrite = document.querySelector('#write-book');

const formWrite = document.querySelector('.write');
const submit = document.querySelector('.write__submit');
const title = document.querySelector('.write__title-book');
const text = document.querySelector('.write__text-book');

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
    text: result.text
  };

  listBooks.push(book);
  console.log(listBooks);
  //localStorage.setItem('listBooks', JSON.stringify(listBooks));
});

// Написать книгу

submit.addEventListener('click', (e) => {
  e.preventDefault(); 
  let obj = {
    title: title.value,
    text: text.value
  };
  console.log(obj);
  listBooks.push(obj);
  console.log(listBooks);
}) ;


//window.addEventListener('beforeunload', () => {
//  localStorage.setItem('listBooks', JSON.stringify(listBooks));
//});
