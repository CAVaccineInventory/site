let messageCatalog;

function getMessageCatalog() {
  if (!messageCatalog) {
    messageCatalog = JSON.parse(
      document.getElementById("messageCatalog").innerHTML
    );
  }
  return messageCatalog;
}

export { getMessageCatalog };
