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
    const source = document.getElementById("bestsellersTemplate").innerHTML,
        template = Handlebars.compile(source);

    let context, html, content = '';
    booksList.empty();
    if ($('.list')) {
        $('.list').remove();
    }


    for (let i = 0; i <= data.results.lists.length - 1; i++) {
        content = '';


        //        context = {
        //            categoryTitle: data.results.lists[i].display_name
        //        }
        //        content += template(context);

        var category = $(`     
    <h3 class="category text-center">Category: ${ data.results.lists[i].display_name} </h3>`);
        category.appendTo(booksList);


        for (var j = 0; j <= data.results.lists[i].books.length - 1; j++) {

            context = {
                bestsellerRank: data.results.lists[i].books[j].rank,
                bestsellerImage: data.results.lists[i].books[j].book_image,
                weekOnlist: data.results.lists[i].books[j].weeks_on_list,
                bestsellerTitle: data.results.lists[i].books[j].title,
                bestsellerAuthor: data.results.lists[i].books[j].author,
                bestsellerPublisher: data.results.lists[i].books[j].publisher,
                bestsellerDescription: data.results.lists[i].books[j].description,
                bestSellerlinkUrl1: data.results.lists[i].books[j].buy_links[0].url,
                bestSellerlink1: data.results.lists[i].books[j].buy_links[0].name,
                bestSellerlinkUrl2: data.results.lists[i].books[j].buy_links[1].url,
                bestSellerlink2: data.results.lists[i].books[j].buy_links[1].name,
                bestSellerlinkUrl3: data.results.lists[i].books[j].buy_links[2].url,
                bestSellerlink3: data.results.lists[i].books[j].buy_links[2].name

            }

           
            content += template(context);
        }
        booksList.append(content);
         $('.position__weeks:contains("1 weeks on the list")').text("New this week");
        $('.position__weeks:contains("0 weeks on the list")').text("New this week");
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
    $('#bestSearch').after('<p class="list">An error occurred while attempting to contact the server. Please check your internet connection</p>');
}

const showNotFound = () => {
    booksList.empty();
    $('.list').remove();
    $('#bestSearch').after('<h2 class="list">Book not found</h2>');
}

const showBook = (resp) => {

    const source = document.getElementById("booksTemplate").innerHTML,
        template = Handlebars.compile(source);

    let context, html, content = '';


    booksList.empty();
    $('.list').remove();

//    $('#bestSearch').after('<h2 class="list">List of books</h2>');
    if (resp.items === undefined) showNotFound();
    resp.items.forEach(item => {

        var textInfo;
        if (item.searchInfo == undefined) {
            textInfo = "";
        } else {
            textInfo = item.searchInfo.textSnippet;
        }

        context = {
            volumeImage: item.volumeInfo.imageLinks.thumbnail,
            volumeTitle: item.volumeInfo.title,
            volumeAuthors: item.volumeInfo.authors,
            volumePublisher: item.volumeInfo.publisher,
            volumeInfo: textInfo,
            volumeLink: item.volumeInfo.infoLink
        }

        content += template(context);

    });

    booksList.append(content);
}
