
const orderSection = document.getElementById("orderSection");
const trackerSection = document.getElementById("trackerSection");
const progressFill = document.getElementById("progressFill");
const estimatedTime = document.getElementById("estimatedTime");
const currentStatus = document.getElementById("currentStatus");
const updateList = document.getElementById("updateList");
const notification = document.getElementById("notification");

const steps = [
  document.getElementById("step1"),
  document.getElementById("step2"),
  document.getElementById("step3"),
  document.getElementById("step4"),
  document.getElementById("step5"),
  document.getElementById("step6"),
];


let countdownTimer;
let preparationTimer;
let deliveryTimer;
let minutesLeft = 15;
let secondsLeft = 0;
let currentStep = 0;


const processSteps = [
  { name: "Order Received", duration: 5, progress: 0 },
  { name: "Preparing", duration: 10, progress: 20 },
  { name: "In the Oven", duration: 15, progress: 40 },
  { name: "Quality Check", duration: 5, progress: 60 },
  { name: "Out for Delivery", duration: 20, progress: 80 },
  { name: "Delivered", duration: 0, progress: 100 },
];

function updateOrderSummary() {
  let size = document.getElementById("pizzaSize").value;
  let crust = document.getElementById("crustType").value;

  let options = document.getElementById("toppings").options;
  let toppings = [];

  for (let i = 0; i < options.length; i++) {
    if (options[i].selected) {
      toppings.push(options[i].value);
    }
  }

  let basePrice = 0;
  if (size === "Small") basePrice = 8.99;
  if (size === "Medium") basePrice = 12.99;
  if (size === "Large") basePrice = 15.99;
  if (size === "Extra Large") basePrice = 18.99;

  let toppingsPrice = toppings.length * 1.5;
  let deliveryFee = 2.99;

  let total = basePrice + toppingsPrice + deliveryFee;

  orderSummary.innerHTML = `
    <div class="summary-title">Order Summary</div>
    <div class="summary-item">
      <span>${size} ${crust} Crust Pizza</span>
      <span>$${basePrice.toFixed(2)}</span>
    </div>
    <div class="summary-item">
      <span>Toppings (${toppings.length})</span>
      <span>$${toppingsPrice.toFixed(2)}</span>
    </div>
    <div class="summary-item">
      <span>Delivery Fee</span>
      <span>$${deliveryFee.toFixed(2)}</span>
    </div>
    <div class="summary-total">
      Total: $${total.toFixed(2)}
    </div>
  `;
}


function startDeliveryProcess() {
  orderSection.style.display = "none";
  trackerSection.style.display = "block";

  showNotification("Your order has been placed!");

  addUpdate(
    "Order Received",
    "Your order has been received and is being processed."
  );

  startCountdown();
  startPreparation();
}


function startCountdown() {
  addUpdate(
    "Timer Started",
    "Countdown timer started using setInterval() to update every second."
  );

  updateTimerDisplay();

  countdownTimer = setInterval(() => {
    if (secondsLeft === 0) {
      if (minutesLeft === 0) {
        clearInterval(countdownTimer);
        return;
      }
      minutesLeft--;
      secondsLeft = 59;
    } else {
      secondsLeft--;
    }

    updateTimerDisplay();
  }, 1000);
}


function updateTimerDisplay() {
  estimatedTime.textContent = `${minutesLeft
    .toString()
    .padStart(2, "0")}:${secondsLeft.toString().padStart(2, "0")}`;
}


function startPreparation() {
  updateStepProgress(0);

  addUpdate(
    "Timer Method",
    `Using setTimeout(${processSteps[0].duration * 1000}) to simulate moving to "${
      processSteps[1].name
    }"`
  );

  preparationTimer = setTimeout(
    processNextStep,
    processSteps[0].duration * 1000
  );

  function processNextStep() {
    if (currentStep >= processSteps.length - 1) return;

    currentStep++;
    updateStepProgress(currentStep);

    const currentDuration = processSteps[currentStep].duration;

    if (currentStep < processSteps.length - 1) {
      addUpdate(
        "Timer Method",
        `Using setTimeout(${currentDuration * 1000}) to simulate "${processSteps[currentStep].name}" stage`
      );

      preparationTimer = setTimeout(
        processNextStep,
        currentDuration * 1000
      );
    }
  }
}


function updateStepProgress(stepIndex) {
  progressFill.style.width = `${processSteps[stepIndex].progress}%`;
  currentStatus.textContent = processSteps[stepIndex].name;

  for (let i = 0; i <= stepIndex; i++) {
    steps[i].classList.add("active");
    if (i < stepIndex) {
      steps[i].classList.add("completed");
    }
  }

  addUpdate(
    processSteps[stepIndex].name,
    getStatusMessage(stepIndex)
  );
}


function getStatusMessage(stepIndex) {
  const messages = [
    "We've received your order and it's been sent to the kitchen.",
    "Our chefs are preparing your pizza with fresh ingredients.",
    "Your pizza is now baking in our brick oven at 700°F.",
    "We're checking that your pizza meets our quality standards.",
    "Your pizza is on its way! Our delivery person is en route.",
    "Your pizza has been delivered. Enjoy your meal!",
  ];

  return messages[stepIndex];
}


function addUpdate(title, message) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const updateItem = document.createElement("div");
  updateItem.className = "update-item";

  updateItem.innerHTML = `
    <div class="update-time">${timeStr}</div>
    <div class="update-text">
      <strong>${title}</strong><br>
      ${message}
    </div>
  `;

  updateList.prepend(updateItem);
}


function showNotification(message) {
  notification.textContent = message;
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}




function resetProcess() {
  clearInterval(countdownTimer);
  clearTimeout(preparationTimer);
  clearInterval(deliveryTimer);

  minutesLeft = 15;
  secondsLeft = 0;
  currentStep = 0;

  progressFill.style.width = "0%";
  currentStatus.textContent = "Order Received";

  steps.forEach((step) => {
    step.classList.remove("active");
    step.classList.remove("completed");
  });
  steps[0].classList.add("active");

  updateList.innerHTML = "";

  trackerSection.style.display = "none";
  orderSection.style.display = "block";
}