function toggleNavbar() {
  var nav = document.querySelector(".topnav");
  nav.classList.toggle("responsive");
}

document.addEventListener("DOMContentLoaded",function () { //load, the
  var payButtons = document.getElementsByClassName("paybutton");
  var modal = document.getElementById("paymentModal");
  var closeButton = document.querySelector(".close");
  var form = document.getElementById("paymentForm");
  var messageBox = document.getElementById("message");

  for (var i=0; i < payButtons.length;i++) {
    payButtons[i].addEventListener("click",function(){
      modal.style.display="block";
      messageBox.textContent ="";
    });
  }

  closeButton.onclick = function() 
  { //Close modal when the cross in right corner clicked.
    modal.style.display = "none";
  };

  //if click outside the modal exit the modal
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display ="none";
    }
  };

  //payment form submission
  form.addEventListener("submit",function (event){
    event.preventDefault();
    var cardNumber = document.getElementById("cardNumber").value.trim();
    var expMonth = document.getElementById("expMonth").value.trim();
    var expYear = document.getElementById("expYear").value.trim();
    var cvv = document.getElementById("cvv").value.trim();

    //51-55.length 16, card number checking
    if (!/^5[1-5]/.test(cardNumber) || cardNumber.length !== 16 || isNaN(cardNumber)) {
      alert("Invalid card number.");
      return;
    }

    //Check if the cvv is 4 or 3 digits:
    if (cvv.length < 3 || cvv.length>4 || isNaN(cvv)) {
      alert("Invalid CVV.");
      return;
    }

//Check card expired
    var now = new Date();
    var currentMonth = now.getMonth() + 1;
    var currentYear = now.getFullYear();
    if (parseInt(expYear) < currentYear ||
        (parseInt(expYear) === currentYear && parseInt(expMonth) < currentMonth)) {
      alert("Card expired.");
      return;
    }
    var last4 = cardNumber.slice(-4);
    sendPayment(cardNumber, expMonth, expYear, cvv, last4);
  });
});
function sendPayment(card, month, year, cvv, last4) {
  var paymentInfo = {
    master_card: parseInt(card),
    exp_month: parseInt(month),
    exp_year: parseInt(year),
    cvv_code: cvv
  };

  fetch("https://mudfoot.doc.stu.mmu.ac.uk/node/api/creditcard",
     {
    method:"POST",
    headers:
     {
      "Content-Type":"application/json"
    },
    body: JSON.stringify(paymentInfo)
  })
  .then(function(response){
    return response.json();
  })
  .then(function (data) {
    document.getElementById("message").style.color = "green";
    document.getElementById("message").textContent = data.message;
    //take user to the seccess page and it shows the last four digits of card
    setTimeout(function () {
      window.location.href = "success.html?card=" + last4;
    },1000);
  })
  .catch(function (error) {
    document.getElementById("message").style.color = "red";
    document.getElementById("message").textContent = "Error:   "+ error.message; //if error it will show a error message in red
  });
}
//references: https://www.w3schools.com/js/js_htmldom_eventlistener.asp  https://www.w3schools.com/js/js_api_fetch.asp







