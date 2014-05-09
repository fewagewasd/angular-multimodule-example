'use strict';

window.configure.push(function () {
    window.providers.$apiProvider.endpoint('book', {
        url: 'books',
        model: window.Book
    });
});
