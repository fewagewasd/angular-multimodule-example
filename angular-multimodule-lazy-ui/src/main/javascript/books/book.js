'use strict';
window.Book = function(data) {
    this.name = data.name;
    this.author = data.author;
    this.year = data.year;
    this.url = data._links.self.href;
    this.id = this.url.substring(this.url.lastIndexOf('/')+1);
};

window.Book.prototype.toString = function () {
    return this.name + ' by ' + this.author + ' - ' + this.year + ' (' + this.id + ')';
};