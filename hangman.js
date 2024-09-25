
let theHint = document.querySelector('.hint');
let word = document.querySelector(".word");
let category = document.querySelector(".category");

//handle letters

let alphabet = 'abcdefghijklmnopqrstuvwxyz';
let letters = document.querySelector('.letters');

let allLetters = Array.from(alphabet);

allLetters.forEach(letter => {
    let span = document.createElement("span");
    let spanText = document.createTextNode(letter);
    span.appendChild(spanText);
    letters.appendChild(span);
    span.className = "letter";
});




//generate words \ hints \ categoreis from json 

async function randomCategoryElements () {
    
    let response = await fetch('words.json');
    let result = await response.json();
    let Jstring = JSON.stringify(result);
    let jsObject = JSON.parse(Jstring);
    let categories = Object.entries(jsObject.categories);

    //choose ran number for the entreis:
    let ranNument = Math.floor(Math.random() * categories.length);
    let randomCategoryEls = categories[ranNument];

    return randomCategoryEls;

}

randomCategoryElements()
.then((res)=>{

    //append category name to page

    category.innerHTML = res[0];

    //get random number to choose a word

    let randomWordArrNum = Math.floor(Math.random() * res[1].length);
    
    //get word and hint

    let randomWord = res[1][randomWordArrNum].word;
    let hint = res[1][randomWordArrNum].hint;


    //append hint to the page
    theHint.innerHTML = `Hint : ${hint}`;

    //create input for each word letter

    Array.from(randomWord).forEach(letter => {

        let Userinput = document.createElement("input");
        Userinput.className = "Userinput";
        Userinput.maxLength = 1;
        word.appendChild(Userinput);
    
    });

    //handle if a word contains white space

if (randomWord.includes(' ')) {
    let inputs = document.querySelectorAll('.word .Userinput');
    let spaceInd = randomWord.indexOf(' ');

    inputs[spaceInd].value = '-'
    
}

mainFunc(randomWord);

})



//main game logic


function mainFunc(word) {


    
let keyboard = document.querySelectorAll(".letter");
let input = document.querySelectorAll(".Userinput");
let theMan = document.querySelector('.man-draw').children;
let chances = 0;
    


    keyboard.forEach(key => {
        key.addEventListener("click", () => {

            let theInput = key.innerHTML;


            // win case :
    
            // If the letter exists in the random word
            if (word.toLowerCase().includes(theInput)) {
    
                // Convert the random word and input elements to arrays
                let ranwordArr = Array.from(word.toLowerCase());
                let inputArr = Array.from(input);
    
                // Loop through the word array to find the correct positions for the letter
    
                ranwordArr.forEach((e, i) => {
                    if (e === theInput && input[i].value === "") {
                        input[i].value = key.innerHTML;
                        key.style.backgroundColor = '#94dea5';
                        key.style.pointerEvents = 'none';
                        document.querySelector('.right').play();
                        
                    }
                });
                
                //if all input fields are not empty then you win
                
                if (inputArr.every(input => input.value !== "")) {
                    document.querySelector('.win').play();
                    letters.classList.add('finished');
                    Swal.fire({
                        title: "you win",
                        imageUrl: "https://cdn-icons-png.flaticon.com/512/4957/4957066.png",
                        imageWidth: 150,
                        imageHeight: 150,
                        imageAlt: "Custom image",
                        confirmButtonText: 'play again',
                        text: `you've used : ${chances} chances you are ${chances < 3 ? 'advanced' : chances <= 3 && chances < 5 ? 'intermediate' : 'beginner'}`,
                        confirmButtonColor:'#94dea5',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                    }).then((result) => {
                    if (result.isConfirmed) {
    
                        return location.reload();
                    }
                    });
                    
                }
    
                //lose case:
            } else {
                // Handle the wrong letter case
                if (chances < theMan.length) {
                    theMan[chances].style.display = 'block';
                    key.style.backgroundColor = '#f94449';
                    key.style.pointerEvents = 'none';
                    document.querySelector('.wrong').play();
                    chances++;
                }
                if (chances === theMan.length) {
    
                    document.querySelector('.fail').play();
    
                    letters.classList.add('finished');
    
                    Swal.fire({
                            title: "you lose!",
                            imageUrl: "https://cdn-icons-png.flaticon.com/512/10393/10393376.png",
                            imageWidth: 150,
                            imageHeight: 150,
                            imageAlt: "Custom image",
                            text: `the right word is : ${word}`,
                            confirmButtonText: 'play again',
                            confirmButtonColor:'#f94449',
                            allowOutsideClick: false,
                            allowEscapeKey: false
                        }).then((result) => {
                        if (result.isConfirmed) {
                            return location.reload();
                        }
                        });
                    }
                }
        });
    });


}

