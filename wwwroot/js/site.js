const uri = 'items';
let todos = [];

const body = document.getElementById("body");
body.setAttribute("style", "background-image: url('/images/swordandboardlogo.png');");
body.style.backgroundSize = "300px 300px";
//body.setAttribute("style", "background-size: 300px");
//body.setAttribute("style", "background-attachment: fixed");

function getItems() {

  fetch(uri)
    .then(response => response.json())
    .then(data => _displayItems(data))
    .catch(error => console.error('Unable to get items.', error));
}

function addItem() {
  const addNameTextbox = document.getElementById('add-name');
  const addAgeTextbox = document.getElementById('add-age');
  const addBirthplaceTextbox = document.getElementById('add-birthplace');
  const addElementTextbox = document.getElementById('add-element');
  const addDescriptionTextbox = document.getElementById('add-description');
  const addBiographyTextbox = document.getElementById('add-bio');
  const addUrlTextbox = document.getElementById('add-url');

  const item = {
    name: addNameTextbox.value.trim(),
    age: addAgeTextbox.value,
    birthplace: addBirthplaceTextbox.value.trim(),
    element: addElementTextbox.value.trim(),
    description: addDescriptionTextbox.value.trim(),
    bio: addBiographyTextbox.value.trim(),
    imgurl: addUrlTextbox.value.trim()
};

  fetch(uri, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(item)
  })
    .then(response => response.json())
    .then(() => {
      getItems();
      addNameTextbox.value = '';
      addAgeTextbox.value = '';
      addBirthplaceTextbox.value = '';
      addElementTextbox.value = '';
      addDescriptionTextbox.value = '';
      addBiographyTextbox.value = '';
      addUrlTextbox.value = '';


    })
    .catch(error => console.error('Unable to add item.', error));
};

function deleteItem(event) {
  event.preventDefault();
  const providedId = event.target.dataset.itemId
  fetch(`${uri}/${providedId}`, {
    method: 'DELETE'
  })
  .then(() => getItems())
  .catch(error => console.error('Unable to delete item.', error));
}

function displayEditForm(event) {
  event.preventDefault();
  
  console.dir(event)
 console.dir(event.target)
  console.log(event.target.dataset)
  const providedId = event.target.dataset.itemId

  const item = todos.find(item => item.id === providedId);


  document.getElementById('edit-name').value = item.name;
  document.getElementById('edit-age').value = item.age;
  document.getElementById('edit-birthplace').value = item.birthplace;
  document.getElementById('edit-element').value = item.element;
  document.getElementById('edit-description').value = item.description;
  document.getElementById('edit-bio').value = item.bio;
  document.getElementById('edit-url').value = item.url;
  document.getElementById('edit-id').value = item.id;
  document.getElementById('editForm').style.display = 'block';
}

function updateItem() {
  const itemId = document.getElementById('edit-id').value;
  const item = {
    id: parseInt(itemId, 10),
    name: document.getElementById('edit-name').value.trim(),
    age: document.getElementById('edit-age').value,
    birthplace: document.getElementById('edit-birthplace').value.trim(),
    element: document.getElementById('edit-element').value.trim(),
    description: document.getElementById('edit-description').value.trim(),
    bio: document.getElementById('edit-bio').value.trim(),
    imgurl: document.getElementById('edit-url').value.trim()
  };
  fetch(`${uri}/${itemId}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(item)
  })
  .then(() => getItems())
  .catch(error => console.error('Unable to update item.', error));
  closeInput();
  return false;
}

function closeInput() {
  document.getElementById('editForm').style.display = 'none';
}

function _displayCount(itemCount) {
  //if statement (ternary statement) condition ? if : else
  const name = (itemCount === 1) ? 'character' : 'characters';
  // What the ternary statement is doing:
  // let name;
  // if(itemCount === 1){
  //   name = 'catalog'
  // }else{
  //   name = 'catalogs'
  // }

  document.getElementById('counter').innerText = `${itemCount} ${name}`;
}

function _displayItems(data) {
  const tBody = document.getElementById('todos');
  tBody.innerHTML = '';

  _displayCount(data.length);

  const button = document.createElement('button');

  data.forEach(item => {

    let isCompleteCheckbox = document.createElement('input');
    isCompleteCheckbox.type = 'checkbox';
    isCompleteCheckbox.disabled = true;
    isCompleteCheckbox.checked = item.isComplete;

    // console.dir(isCompleteCheckbox)
    // console.log(isCompleteCheckbox)

    let editButton = button.cloneNode(false);
    editButton.innerText = 'Edit';
    editButton.dataset.itemId = item.id;

    editButton.addEventListener('click', displayEditForm)


    let deleteButton = button.cloneNode(false);
    deleteButton.innerText = 'Delete';
    deleteButton.dataset.itemId = item.id;
    deleteButton.addEventListener('click', deleteItem)


    let tr = tBody.insertRow();

    let td1 = tr.insertCell(0);
    let link = document.createElement("a");
    let proImg = document.createElement("img");
    if(item.description == "" || item.description == null){
      proImg.src = "/images/silho.png";
    } else {
      proImg.src = item.description;
    }
    
    
    proImg.setAttribute("id", "images");
    td1.appendChild(proImg);


    let td2 = tr.insertCell(1);
    let nameNode = document.createTextNode(item.name);
    td2.appendChild(nameNode);

    let td3 = tr.insertCell(2);
    let ageNode = document.createTextNode(item.age);
    td3.appendChild(ageNode);

    let td4 = tr.insertCell(3);
    let birthplaceNode = document.createTextNode(item.birthplace);
    td4.appendChild(birthplaceNode);

    let td5 = tr.insertCell(4);
    let elementNode = document.createTextNode(item.element);
    td5.appendChild(elementNode);

    

    let td6 = tr.insertCell(5);
    let bioNode = document.createTextNode(item.bio);
    td6.appendChild(bioNode);
    

    let td7 = tr.insertCell(6);
    td7.appendChild(editButton);

    let td8 = tr.insertCell(7);
    td8.appendChild(deleteButton);
  });

  todos = data;
  
}