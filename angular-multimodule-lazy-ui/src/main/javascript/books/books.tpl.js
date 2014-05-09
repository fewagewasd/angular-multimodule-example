window.services.$templateCache.put('books/book-detail-edit.tpl.html',
        '<div class="row">\n' +
        '    <div class="form-group">\n' +
        '        <label for="name" class="col-sm-2 control-label">Name</label>\n' +
        '        <div class="col-sm-9">\n' +
        '            <input type="text" class="form-control" id="name" placeholder="Name" ng-model="editDetail.name" required="">\n' +
        '        </div>\n' +
        '    </div>\n' +
        '</div>\n' +
        '<div class="row">\n' +
        '    <div class="form-group">\n' +
        '        <label for="author" class="col-sm-2 control-label">Authors</label>\n' +
        '        <div class="col-sm-9">\n' +
        '            <input type="text" class="form-control" id="author" placeholder="Authors" ng-model="editDetail.author" required="">\n' +
        '        </div>\n' +
        '    </div>\n' +
        '</div>\n' +
        '<div class="row">\n' +
        '    <div class="form-group">\n' +
        '        <label for="year" class="col-sm-2 control-label">Year</label>\n' +
        '        <div class="col-sm-9">\n' +
        '            <input type="number" class="form-control" id="year" placeholder="Year" ng-model="editDetail.year" required="">\n' +
        '        </div>\n' +
        '    </div>\n' +
        '</div>');

window.services.$templateCache.put('books/book-detail-view.tpl.html',
        '<div class="row">\n' +
        '    <div class="form-group">\n' +
        '        <label for="name" class="col-sm-2 control-label">Name</label>\n' +
        '        <div id="name" class="col-sm-9">{{detail.name}}</div>\n' +
        '    </div>\n' +
        '</div>\n' +
        '<div class="row">\n' +
        '    <div class="form-group">\n' +
        '        <label for="author" class="col-sm-2 control-label">Authors</label>\n' +
        '        <div id="author" class="col-sm-9">{{detail.author}}</div>\n' +
        '    </div>\n' +
        '</div>\n' +
        '<div class="row">\n' +
        '    <div class="form-group">\n' +
        '        <label for="year" class="col-sm-2 control-label">Year</label>\n' +
        '        <div id="year" class="col-sm-9">{{detail.year}}</div>\n' +
        '    </div>\n' +
        '</div>');

window.services.$templateCache.put('books/book-list.tpl.html',
        '<h2>Books</h2>\n' +
        '<mme-paginated api="bookApi" collection="books" search-params="name">\n' +
        '    <table class="table table-hover">\n' +
        '        <tr>\n' +
        '            <th class="col-sm-6" mme-sortable="" sort-mode="alphabet">Name</th>\n' +
        '            <th class="col-sm-1 text-right">\n' +
        '                <a href="#/admin/books/new"><span class="glyphicon glyphicon-plus"></span> New</a>\n' +
        '            </th>\n' +
        '        </tr>\n' +
        '        <tr ng-repeat="book in books">\n' +
        '            <td><a href="#/admin/books/{{book.id}}">{{book.name}}</a> <span class="text-muted">({{book.year}})</span></td>\n' +
        '            <td>&nbsp;</td>\n' +
        '        </tr>\n' +
        '    </table>\n' +
        '</mme-paginated>');