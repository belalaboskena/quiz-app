let container = document.querySelector(".container")
let questioncountspan = document.querySelector(".container .quiz_info .qcount")
let question_area = document.querySelector(".container .question_area")
let answers_area = document.querySelector(".container .answers_area")
let bullets_area =  document.querySelector(".container .bullets")
let spans = document.querySelector(".bullets .spans");
let submit = document.querySelector("button");
let countdownElement = document.querySelector(".countdown");


let counter = 0 ;
let rightanswercounter = 0;
let countdownInterval;


function getqiestion() {
  let myrequest = new XMLHttpRequest()
  myrequest.onreadystatechange = function() {
    if (myrequest.readyState == 4 && myrequest.status == 200) {
      let questionobject = JSON.parse(myrequest.responseText);
      let qcount = questionobject.length;

      //funcation to create bullets
      createbullets(qcount)

      //funcation to add question to page
      addquestion(questionobject[counter] , qcount)

      // Start CountDown
      countdown(30, qcount);

      //on submit
      submit.onclick = function () {
        //check the answer
        chackanswer(questionobject[counter]);

        counter++;

        // submit tofinish
        if(qcount-counter == 1){
          submit.innerHTML = "Finish";
        }

        //handel bullets
        handlebullets(qcount)

        question_area.innerHTML = "";
        answers_area.innerHTML = "";

        addquestion(questionobject[counter] , qcount)
        
        // Start CountDown
        clearInterval(countdownInterval);
        countdown(30, qcount);

        //show the result
        showresult(qcount)
      }
    }
  } 
  myrequest.open("Get", "/html_questions.json", true)
  myrequest.send()
}
getqiestion()

function createbullets(qcount) {
  //set questions number 
  questioncountspan.appendChild(document.createTextNode(qcount));
  //create bullets
  for (let i=1; i<=qcount; i++){
    let bullet = document.createElement("span");
    if(i == 1){
      bullet.className = "on";
      bullet.innerHTML = "1";
    }
    spans.appendChild(bullet)
  }
}

function addquestion(question,qcount) {
  if(counter < qcount) {
  //adding question
  let h2 = document.createElement("h2");
  h2.appendChild(document.createTextNode(question.title));
  question_area.appendChild(h2);
  //adding answer 
  for (let i=1; i<=(Object.keys(question).length)-2; i++){
    let answerdiv = document.createElement("div")
    answerdiv.className = "answer";
    let input = document.createElement("input")
    input.setAttribute("type" , "radio")
    input.id = `answer_${i}`;
    input.name = `question`;
    input.dataset.answer = question[`answer_${i}`];
    if(i==1){
      input.checked = true
    }
    answerdiv.appendChild(input);
    let label = document.createElement("label");
    label.htmlFor = `answer_${i}`;
    label.appendChild(document.createTextNode(question[`answer_${i}`]));
    answerdiv.appendChild(label);
    answers_area.appendChild(answerdiv);
  }
  }
}
function chackanswer(question){
  let answers = document.querySelectorAll("input")
  for(let i=0; i<answers.length; i++){
    if(answers[i].checked == true){
      if(answers[i].dataset.answer === question.right_answer) rightanswercounter++;
      break;
    }
  }
}
function handlebullets(qcount) {
  if (counter < qcount){
    spans.children[counter].className = "on";
    spans.children[counter].innerHTML = `${counter+1}`;
  }
}
function showresult(qcount) {
  if(counter == qcount){
    question_area.remove();
    answers_area.remove();
    bullets_area.remove();
    submit.remove();

    //create resultdiv
    let resultdiv = document.createElement("div");
    resultdiv.className = "result";
    let resulth2 = document.createElement("h2");
    if(rightanswercounter < qcount/2){
      resulth2.innerHTML = "Bad";
      resulth2.className = "bad";
    }
    else if(rightanswercounter >= qcount/2 && rightanswercounter != qcount){
      resulth2.innerHTML = "Good";
      resulth2.className = "good";
    }
    else {
      resulth2.innerHTML = "Perfect";
      resulth2.className = "perfect";
    }
    let resultp = document.createElement("p");
    resultp.innerHTML = `${rightanswercounter} of ${qcount}`;
    resultdiv.appendChild(resulth2);
    resultdiv.appendChild(resultp);
    container.appendChild(resultdiv);
    let againbutton = document.createElement("button")
    againbutton.innerHTML = "Again";
    container.appendChild(againbutton);
    againbutton.addEventListener("click" ,function(){
      location.reload();
    });
  } 
}
function countdown(duration, count) {
  if (counter < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submit.click();
      }

      if (duration < 10) {
        countdownElement.className = "warning"; 
      }
      else  countdownElement.className = "";

    }, 1000);
  }
}
