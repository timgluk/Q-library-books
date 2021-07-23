const url = 'https://apiinterns.osora.ru/ '
const form = document.querySelector('.upload')

form.addEventListener('submit', (e) => {
  e.preventDefault()

  const files = document.querySelector('[type=file]').files
  const formData = new FormData()

  formData.append('login', 'String');

  //for (let i = 0; i < files.length; i++) {
  //  let file = files[i]

  //}
  formData.append('file', files);

  console.log(formData);

  fetch(url, {
    method: 'POST',
    body: formData,
  }).then((response) => {
    console.log(response)
  })
})