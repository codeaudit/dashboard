let name = document.getElementById("exp-name")
console.log('name')

axios.get('/api/experiments')
.then(function (resp) {
    let experiments = Object.values(resp.data || {})
    let column_names = ['last_modified', 'name', 'username']
    let columns = [
      {data: "last_modified", renderer: linker},
      {data: "name", renderer: linker},
      {data: "username", renderer: linker},
    ]
    let search_bar = document.getElementById('search_bar')
    let table = new Handsontable(document.getElementById('experiments'), {
        data: experiments,
        rowHeaders: false,
        colHeaders: column_names,
        columns: columns,
        columnSorting: true,
        search: true,
        stretchH: 'all',
        readOnly: true,
    });

    function linker(instance, td, row, col, prop, value, cellProperties) {
        let name = experiments[row].name;
        td.innerHTML = '<a href="/experiments/' + name + '">' + (value || '') + '</a>'
        return td;
    }

    Handsontable.Dom.addEvent(search_bar, 'keyup', (event) => {
        var result = table.search.query(search_bar.value);
        table.render();
    });
})
.catch(function (resp) {
    // something went wrong
});