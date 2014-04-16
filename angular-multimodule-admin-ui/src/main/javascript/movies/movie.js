window.Movie = function(data) {
    this.name = data.name;
    this.year = data.year;
    this.url = data._links.self.href;
    this.id = this.url.substring(this.url.lastIndexOf('/')+1);
};

window.Movie.prototype.toString = function () {
    return this.name + ' - ' + this.year + ' (' + this.id + ')';
};