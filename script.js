var prefix = "https://cors-anywhere.herokuapp.com/";
const url = 'https://www.googleapis.com/books/v1/volumes?q=';

const bestUrl = "https://api.nytimes.com/svc/books/v3/lists/overview.json?api-key=9b79a15c3ca38e0ceb09e3fcb5c8e857%3A13%3A70149467";


//Search events

const booksList = $('#books');

$('#search').click(searchBook);

$('#bestSearch').click(bestBooks);

//run fuction on a keypress event
$('#book-name').keyup(e => {
    if (e.which === 13) {
        searchBook();
    }
});

// Bestellers

function bestBooks() {
    $.getJSON(prefix + bestUrl)
        .done(showBest)
        .fail(showError);
    $.ajaxSetup({
        cache: false
    });
}


function showBest(data) {
    booksList.empty();
    $('.list').remove();

    for (let i = 0; i <= data.results.lists.length - 1; i++) {
        var category = $(`     
    <h3 class="category text-center">${ data.results.lists[i].display_name} </h3>`);
        category.appendTo(booksList);

        for (var j = 0; j <= data.results.lists[i].books.length - 1; j++) {
            var bookInfo = $(`
      <div class="position row"> 
 <div class="position__rank"<p>${data.results.lists[i].books[j].rank}</p></div>
        <div class="position__cover col"> 
       
          <img class="position__img" src=${data.results.lists[i].books[j].book_image}>  
        </div> 
        <div class="position__description col"> 
          <p class="postion__weeks">${data.results.lists[i].books[j].weeks_on_list} weeks on the list</p> 
          <h4 class="position__title">${data.results.lists[i].books[j].title}</h4> 
          <h5 class="position__author">by <span class="color">${data.results.lists[i].books[j].author}</span></h5> 
          <p class="position__about">${data.results.lists[i].books[j].description}</p> 
        
        <div class="position__buy">
             <p>Buy:</p> 
          <ul><li> <a href = "${data.results.lists[i].books[j].buy_links[0].url}" target="_blank" >  ${data.results.lists[i].books[j].buy_links[0].name}</a></li> 
            <li> <a href = "${data.results.lists[i].books[j].buy_links[1].url}" target="_blank" > ${data.results.lists[i].books[j].buy_links[1].name}</a> </li>
            <li> <a href = "${data.results.lists[i].books[j].buy_links[2].url}" target="_blank" >  ${data.results.lists[i].books[j].buy_links[2].name}</a></li> 
          </ul>  
         
        </div>
        </div> 
      </div>
`);

            $('.weeks:contains("1 weeks on the list")').text("New this week");
            bookInfo.appendTo(booksList);
        }
    }
}



//Search Book

function searchBook() {
    let bookName = $('#book-name').val();
    //    if (!countryName.length) countryName = 'Poland';
    $.getJSON(prefix + url + bookName)
        .done(showBook)
        .fail(showError);
    $.ajaxSetup({
        cache: false
    });

}

//Function execute in case of 404 error
const showError = () => {
    booksList.empty();
    $('.list').remove();
    $('#book-name').after('<h2 class="list">Book not found</p>');
}

const showBook = (resp) => {

    booksList.empty();
    $('.list').remove();

    $('#bestSearch').after('<h2 class="list">List of books</p>');
    if (resp.items === undefined) showError();
    resp.items.forEach(item => {
        //create table

        const table = $(`
        <div class="position positionList row">
            <div class="position__cover col">           
                    <img src="${item.volumeInfo.imageLinks.thumbnail}" alt="" class="position__imgList">
            </div>
            <div class="position__description col"> 
                <h4 class="position__title">${item.volumeInfo.title}</h4>
                <h5 class="position__author">by <span class="color">${item.volumeInfo.authors}</h5>
                 <p class="positionList__about">${item.searchInfo.textSnippet}</p>   
              <a href=${item.volumeInfo.infoLink} target="blank"> Read more</a>         
    </div>
</div>
`)
        table.appendTo(booksList);

    });
}
