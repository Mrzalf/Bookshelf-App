const storageKey = "STORAGE_KEY";
const formAddingBook = document.getElementById("inputBook");
const formSearchingBook = document.getElementById("searchBook");

function CheckForStorage() {
  return typeof Storage !== "undefined";
}

formAddingBook.addEventListener("submit", function (event) {
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = parseInt(document.getElementById("inputBookYear").value);
  const isComplete = document.getElementById("inputBookIsComplete").checked;

  const idTemp = document.getElementById("inputBookTitle").name;
  if (idTemp !== "") {
    const bookData = GetBookList();
    for (let index = 0; index < bookData.length; index++) {
      if (bookData[index].id == idTemp) {
        bookData[index].title = title;
        bookData[index].author = author;
        bookData[index].year = year;
        bookData[index].isComplete = isComplete;
      }
    }
    localStorage.setItem(storageKey, JSON.stringify(bookData));
    ResetAllForm();
    RenderBookList(bookData);
    return;
  }

  const id = JSON.parse(localStorage.getItem(storageKey)) === null ? 0 + Date.now() : JSON.parse(localStorage.getItem(storageKey)).length + Date.now();
  const newBook = {
    id: id,
    title: title,
    author: author,
    year: year,
    isComplete: isComplete,
  };

  PutBookList(newBook);

  const bookData = GetBookList();
  RenderBookList(bookData);
});

function PutBookList(data) {
  if (CheckForStorage()) {
    let bookData = [];

    if (localStorage.getItem(storageKey) !== null) {
      bookData = JSON.parse(localStorage.getItem(storageKey));
    }

    bookData.push(data);
    localStorage.setItem(storageKey, JSON.stringify(bookData));
  }
}

function RenderBookList(bookData) {
  if (bookData === null) {
    return;
  }

  const containerIncomplete = document.getElementById("incompleteBookshelfList");
  const containerComplete = document.getElementById("completeBookshelfList");

  containerIncomplete.innerHTML = "";
  containerComplete.innerHTML = "";
  for (let book of bookData) {
    const id = book.id;
    const title = book.title;
    const author = book.author;
    const year = book.year;
    const isComplete = book.isComplete;

    let bookItem = document.createElement("article");
    bookItem.classList.add("book_item", "select_item");
    bookItem.innerHTML = "<h3 name=" + id + ">" + title + "</h3>";
    bookItem.innerHTML += "<p>Penulis: " + author + "</p>";
    bookItem.innerHTML += "<p>Tahun: " + year + "</p>";

    let containerActionItem = document.createElement("div");
    containerActionItem.classList.add("action");

    const blueButton = CreateBlueButton(book, function (event) {
      isCompleteBookHandler(event.target.parentElement.parentElement);

      const bookData = GetBookList();
      ResetAllForm();
      RenderBookList(bookData);
    });

    const redButton = CreateRedButton(function (event) {
      DeleteAnItem(event.target.parentElement.parentElement);

      const bookData = GetBookList();
      ResetAllForm();
      RenderBookList(bookData);
    });

    containerActionItem.append(blueButton, redButton);
    bookItem.append(containerActionItem);

    if (isComplete === false) {
      containerIncomplete.append(bookItem);
      bookItem.childNodes[0].addEventListener("click", function (event) {
        UpdateAnItem(event.target.parentElement);
      });
    } else {
      containerComplete.append(bookItem);
      bookItem.childNodes[0].addEventListener("click", function (event) {
        UpdateAnItem(event.target.parentElement);
      });
    }
  }
}

function CreateBlueButton(book, eventListener) {
  const isSelesai = book.isComplete ? "Belum selesai" : "Selesai";

  const blueButton = document.createElement("button");
  blueButton.classList.add("blue");
  blueButton.innerText = isSelesai + " di Baca";
  blueButton.addEventListener("click", function (event) {
    eventListener(event);
  });
  return blueButton;
}

function CreateRedButton(eventListener) {
  const redButton = document.createElement("button");
  redButton.classList.add("red");
  redButton.innerText = "Hapus buku";
  redButton.addEventListener("click", function (event) {
    eventListener(event);
  });
  return redButton;
}

function isCompleteBookHandler(itemElement) {
  const bookData = GetBookList();
  if (bookData.length === 0) {
    return;
  }

  const title = itemElement.childNodes[0].innerText;
  const titleNameAttribut = itemElement.childNodes[0].getAttribute("name");
  for (let index = 0; index < bookData.length; index++) {
    if (bookData[index].title === title && bookData[index].id == titleNameAttribut) {
      bookData[index].isComplete = !bookData[index].isComplete;
      break;
    }
  }
  localStorage.setItem(storageKey, JSON.stringify(bookData));
}

function SearchBookList(title) {
  const bookData = GetBookList();
  if (bookData.length === 0) {
    return;
  }

  const bookList = [];

  for (let index = 0; index < bookData.length; index++) {
    const tempTitle = bookData[index].title.toLowerCase();
    const tempTitleTarget = title.toLowerCase();
    if (bookData[index].title.includes(title) || tempTitle.includes(tempTitleTarget)) {
      bookList.push(bookData[index]);
    }
  }
  return bookList;
}

function GetBookList() {
  if (CheckForStorage()) {
    return JSON.parse(localStorage.getItem(storageKey));
  }
  return [];
}

function DeleteAnItem(itemElement) {
  const bookData = GetBookList();
  if (bookData.length === 0) {
    return;
  }

  const titleNameAttribut = itemElement.childNodes[0].getAttribute("name");
  for (let index = 0; index < bookData.length; index++) {
    if (bookData[index].id == titleNameAttribut) {
      bookData.splice(index, 1);
      break;
    }
  }

  localStorage.setItem(storageKey, JSON.stringify(bookData));
}

function UpdateAnItem(itemElement) {
  if (itemElement.id === "incompleteBookshelfList" || itemElement.id === "completeBookshelfList") {
    return;
  }

  const bookData = GetBookList();
  if (bookData.length === 0) {
    return;
  }

  const title = itemElement.childNodes[0].innerText;
  const author = itemElement.childNodes[1].innerText.slice(9, itemElement.childNodes[1].innerText.length);
  const getYear = itemElement.childNodes[2].innerText.slice(7, itemElement.childNodes[2].innerText.length);
  const year = parseInt(getYear);

  const isComplete = itemElement.childNodes[3].childNodes[0].innerText.length === "Selesai di baca".length ? false : true;

  const id = itemElement.childNodes[0].getAttribute("name");
  document.getElementById("inputBookTitle").value = title;
  document.getElementById("inputBookTitle").name = id;
  document.getElementById("inputBookAuthor").value = author;
  document.getElementById("inputBookYear").value = year;
  document.getElementById("inputBookIsComplete").checked = isComplete;

  for (let index = 0; index < bookData.length; index++) {
    if (bookData[index].id == id) {
      bookData[index].id = id;
      bookData[index].title = title;
      bookData[index].author = author;
      bookData[index].year = year;
      bookData[index].isComplete = isComplete;
    }
  }
  localStorage.setItem(storageKey, JSON.stringify(bookData));
}

searchBook.addEventListener("submit", function (event) {
  event.preventDefault();
  const bookData = GetBookList();
  if (bookData.length === 0) {
    return;
  }

  const title = document.getElementById("searchBookTitle").value;
  if (title === null) {
    RenderBookList(bookData);
    return;
  }
  const bookList = SearchBookList(title);
  RenderBookList(bookList);
});

function ResetAllForm() {
  document.getElementById("inputBookTitle").value = "";
  document.getElementById("inputBookAuthor").value = "";
  document.getElementById("inputBookYear").value = "";
  document.getElementById("inputBookIsComplete").checked = false;

  document.getElementById("searchBookTitle").value = "";
}

window.addEventListener("load", function () {
  if (CheckForStorage()) {
    if (localStorage.getItem(storageKey) !== null) {
      const bookData = GetBookList();
      RenderBookList(bookData);
    }
  } else {
    alert("Browser yang Anda gunakan tidak mendukung Web Storage");
  }
});
