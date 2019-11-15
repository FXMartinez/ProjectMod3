document.addEventListener("DOMContentLoaded", function(){
let cardShowView = false;
let characterUrl = 'http://localhost:3000/characters'
let addCharacter = false
const addBtn = document.querySelector('#new-character-btn')
const characterForm = document.querySelector('.container')
const cardViewContainer = document.querySelector(".show-card-container")

addBtn.addEventListener('click', () => {
  toggleFormView()
})

function toggleFormView() {
  addCharacter = !addCharacter
  console.log(addCharacter)
  if (addCharacter) {
    characterForm.style.display = 'block'
  } else {
    characterForm.style.display = 'none'
  }
}

function togglecardShowView() {
  cardShowView = !cardShowView
  if(cardShowView) {
    cardViewContainer.classList.add("visible")
  } else {
    cardViewContainer.classList.remove("visible")
  }
}

let form = document.getElementsByClassName('add-character-form')[0]
form.addEventListener('submit', (e)=> {
  submitData(form.name.value, form.image.value)
  form.reset()
  e.preventDefault()
})

function submitData(name, image){
  fetch(characterUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json"
    },
    body: JSON.stringify(
    {
      name: name,
      image: image,
      likes: '0'
    })
}).then(resp => resp.json())
  .then(json => renderACharacter(json))
}

function getCharacters(url) {
  fetch(url)
  .then(resp => resp.json())
  .then(char => renderCharacters(char))
}

function renderACharacter(char){
  div.innerHTML += `
  <div class="card" data-url=${characterUrl} data-id=${char.id}>
  <h2>${char.name}</h2>
  <img src=${char.image} class="character-avatar" />
  <p> ${char.likes} </p>
  <p style="display:inline-block; vertical-align: middle;">
  <button class="like-btn" data-action="like">Like</button>
  <button class="delete-btn" data-action="delete">Delete</button>
  </p>
  </div>`
} // added p tag to buttons for the inline block

div = document.getElementById('character-collection')

function renderCharacters(characters) {
  characters.forEach(function(char) {
    renderACharacter(char)
  })}

  function deleteData(item, url){
    return fetch(`${url}/${item}`, {
    method: 'DELETE'
  })
  .then(resp => resp.json());
};
  
  
function incrementLikes(item, url, likeCount){
  fetch(`${url}/${item}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      likes: likeCount.innerText
    })
  })
  .then(response => response.json())
}
  
document.addEventListener('click', event => {
  if (event.target.dataset.action === 'like') {
    let parent = event.target.parentNode.parentNode
    let parentUrl = parent.dataset.url
    let parentId = parent.dataset.id
    let likeCount = event.target.parentNode.previousSibling.previousSibling // added parentNode to line
    likeCount.innerText++
    incrementLikes(parentId, parentUrl, likeCount)
  } else if (event.target.dataset.action === 'delete') {
    let parent = event.target.parentNode.parentNode
    let parentUrl = parent.dataset.url
    let parentId = parent.dataset.id
    deleteData(parentId, parentUrl)
    parent.remove()
  }
})

let showDiv = document.getElementsByClassName('show-cards')[0]

function renderShowCharacter(char){
  showDiv.innerHTML += `
  <div class="s-card show-card" data-url=${characterUrl} data-id=${char.id}>
  <h2>${char.name}</h2>
  <img src=${char.image} class="" />
  <p> ${char.likes} </p>
  <p style="display:inline-block; vertical-align: middle;">
  <button class="like-btn" data-action="like">Like</button>
  <button class="delete-btn" data-action="delete">Delete</button>
  </p>
  </div>`
}

document.addEventListener('click', e => {
  if (e.target.className == 'character-avatar') {
    let charId = e.target.parentNode.dataset.id
    fetch(`${characterUrl}/${charId}`)
      .then(resp => resp.json())
      .then(data => {renderShowCharacter(data); renderStats(data)})

    // getStats()
    togglecardShowView()

  }

  if(e.target.classList[0] == 'show-cards') {
    showDiv.innerHTML = ''
    togglecardShowView()
  }
})


function renderStats(char){
  console.log(char)
  let ul = document.createElement('ul')
  let div = document.createElement('div')
  div.setAttribute('class', 'stats s-card')
  char.stats.forEach(stats=>{
    ul.innerHTML += 
      `
      <h1> ${stats.name}: 10 </h1>
      <h2> description: ${stats.description} </h2>
      `
    div.appendChild(ul)
    showDiv.appendChild(div)
  })
}

function renderEquipment(equipment){
  console.log(equipment)
  let ul = document.createElement('ul')
  let div = document.createElement('div')
  div.setAttribute('class', 'stats s-card')
  char.equipment.forEach(equipment=>{
    ul.innerHTML += 
      `
      <h1> ${equpment.name}: 10 </h1>
      <h2> description: ${equipment.description} </h2>
      `
    div.appendChild(ul)
    showDiv.appendChild(div)
  })
}


getCharacters(characterUrl)
  
}) // end of dom content loader