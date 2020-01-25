
amountOfSteps = 5;
var amountOfStepsForm = $('#amountOfStepsForm');
var deck = initializeDeck();
var cardsInLength = [];
var posHearts = 0, posSpades = 0, posClubs = 0, posDiamonds = 0;
var furthest = 0;
var previousfurthest = 0;
amountOfStepsForm.submit( (e) => {
    e.preventDefault();
    amountOfSteps = amountOfStepsForm.find('input[id="steps"]').val();
    amountOfStepsForm.find('input[id="steps"]').val('');
    $("#modal-first").css('display', 'none');

    renderBacksOfCards();
    cardsInLength = initializeCardsInLength();
});

// schuppen: &#x1F0A1 - &#x1F0AE
// harten: &#x1F0B1 -&#x1F0BE
// koeken: &#x1F0C1 - &#x1F0CE     C ni gebruiken
// klaveren: &#x1F0D1 - &#x1F0DE
function initializeDeck(){
    var res = [];
    var suits = ['A', 'B', 'C', 'D'];
    var numbers = ['2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'D', 'E'];
    suits.forEach(s => {
        numbers.forEach(n => {
            res.push('&#x1F0'+s+n);
        });
    });
    return res;
}

function initializeCardsInLength(){
    var res = [];
    for (let i = 0; i < amountOfSteps; i++) {
        res.push(getRandomCardFromDeck());
    }
    return res;
}

function renderBacksOfCards() {
    var div = $('.cardsInLength');
    for (let i = 0; i < amountOfSteps; i++) {
           // <div class="card back"> <p>&#127136</p> </div>
           div.prepend(
               '<div id="back'+(i+1)+'" class="card back"> <p>&#127136</p> </div>'
        )
    }
}

$( "#clickme" ).click(e => {
    e.preventDefault();
    var card = getRandomCardFromDeck();
    // kaart weergeven
    var suit = getSuitOfCard(card);
    $('#deckFieldCard').html('<p class="'+suit+'">'+card+'</p>');

    // positie aanpassen
    suit == "koeken" ? ++posDiamonds 
    : suit == "harten" ? ++posHearts
    : suit == "schuppen" ? ++posSpades : ++posClubs;
    
    // juiste kaart doen bewegen
    $( "#"+suit ).animate({
      left: "+=100",
    }, 100, () => {});

    // update furthest
    var t = Math.max(posClubs, posDiamonds, posHearts, posSpades);
    furthest < t ? furthest = t : furthest = furthest;

    // checken of we verder zijn en kaart omdraaien
    if(furthest != previousfurthest){
        // draai kaart enzo snapte
        var cardToShow = cardsInLength.splice(0,1)[0];
        var suitOfCardToShow = getSuitOfCard(cardToShow);
        var t = $('#back'+(amountOfSteps-furthest+1));
        t.html('<p>'+cardToShow+'</p>');
        t.removeClass('card back').addClass('card '+suitOfCardToShow);
        previousfurthest = furthest;

        // reset just kaart naar 0 en pos naar 0
        switch(suitOfCardToShow){
            case "koeken":
                posDiamonds = 0;
                break;
            case "schuppen":
                posSpades = 0;
                break;
            case "harten":
                posHearts = 0;
                break;
            case "klaveren":
                posClubs = 0;
                break;
            default:
        }
        $( "#"+suitOfCardToShow )
        .animate({left: "0"}, 300, () => {});
    }
    // nu nog stoppen enzo haha
    if(furthest > amountOfSteps){
        $('#modal-end').css('display', 'block');
        switch(suit){
            case "koeken":
                $('#modal-end-content').append('<p class="koeken">&#x1F0C1</p>');
                break;
            case "schuppen":
                $('#modal-end-content').append('<p class="schuppen">&#x1F0A1</p>');
                break;
            case "harten":
                $('#modal-end-content').append('<p class="harten">&#x1F0B1</p>');
                break;
            case "klaveren":
                $('#modal-end-content').append('<p class="klaveren">&#x1F0D1</p>');
                break;
            default:
        }
    }
  });

function getRandomCardFromDeck(){
    if(deck.length == 0){
        deck = initializeDeck();
    }
    var index = Math.floor(Math.random()*deck.length);
    return deck.splice(index,1)[0];
}
function getSuitOfCard(card){
    if(card){
        var t = card.substring(6,7);
        return t == 'C' ? "koeken" : t == 'B' ? "harten"
        : t == "A" ? "schuppen" : "klaveren";
    }
    return "schuppen";
}

// RESTART RESTART
$('.restart').click(e => {
    location.reload();
});