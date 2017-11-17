
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');

    getBookmarks()
        .then(function (bookmarks) {
            updateBookmarks(bookmarks);
        })
        .catch(function(e) {
            throw e;
        });

    var addBookmarkForm = document.getElementById('add-bookmark');
    addBookmarkForm.addEventListener("submit", function (event) {
        event.preventDefault();

        addBookmark(addBookmarkForm)
            .then(getBookmarks)
            .then(function(bookmarks) {
                updateBookmarks(bookmarks);
                console.log('Bookmark added!');
            })
            .catch(function(e) {
                throw e;
            });
    });
});

function getBookmarks() {
    return fetch('/api/bookmarks')
        .then(function(response) {
            if (response.status !== 200) {
                return Promise.reject(new Error(response.statusText));
            }

            return response.json();
        })
        .then(function(json) {
            return json.bookmarks;
        });
}

function updateBookmarks(bookmarks) {
    var bookmarksContainer = document.getElementById('bookmarks');

    // empty bookmarks container
    bookmarksContainer.innerHTML = '';

    for (var i = 0; i < bookmarks.length; i++) {
        var bookmark = document.createElement('div');
        var documentUrl = document.createElement('a');
        var deleteButton = document.createElement('button');
        documentUrl.innerHTML = bookmarks[i];
        documentUrl.setAttribute('href', bookmarks[i]);
        deleteButton.innerHTML = "remove";
        deleteButton.setAttribute('name', 'remove');
        deleteButton.addEventListener("click", deleteBookmark);
        deleteButton.setAttribute('data-bookmarkIndex', i)
        deleteButton.setAttribute('enabled', '');
        bookmark.appendChild(documentUrl);
        bookmark.appendChild(deleteButton);

        bookmarksContainer.appendChild(bookmark);
    }
}

function deleteBookmark(index) {
    var currentButtonIndex = this.getAttribute('data-bookmarkIndex')
    console.log(currentButtonIndex)
    return fetch('/api/bookmarks/'+ currentButtonIndex, {
        method: 'DELETE'
    })
    .then(function(response) {
        if (response.status !== 200) {
            return Promise.reject(new Error(response.statusText));
        }
    })
    
    .then(getBookmarks)
    .then(function(bookmarks) {
        updateBookmarks(bookmarks);
    })
    .catch(function(e) {
        throw e;
    });
}

function addBookmark(form) {
    var bookmarkData = new FormData(form);

    return fetch('/api/bookmarks', {
        method: 'POST',
        body: bookmarkData
    })
        .then(function(response) {
            if (response.status !== 200) {
                return Promise.reject(new Error(response.statusText));
            }
        });
}
