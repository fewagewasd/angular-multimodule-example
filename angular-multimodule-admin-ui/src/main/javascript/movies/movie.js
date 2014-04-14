window.Movie = function(data) {
    var name = data.name;
    var year = data.year;
    var links = data._links;
};

window.Movie.prototype.url = function () {
    return !!links.self ? links.self.href : undefined;
};