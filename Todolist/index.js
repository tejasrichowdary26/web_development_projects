const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR AUTH DOMAIN",
    projectId: "YOUR PROJECT ID",
    storageBucket: "YOUR STORAGE BUCKET",
    messagingSenderId: "YOUR SENDER ID",
    appId: "YOUR APP ID"
  };

  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const loginScreen    = document.getElementById("login-screen");
const appScreen      = document.getElementById("app-screen");
const googleLoginBtn = document.getElementById("google-login-btn");
const logoutBtn      = document.getElementById("logout-btn");
const addBtn         = document.getElementById("addtask");
const input          = document.getElementById("tasks");
const taskList       = document.getElementById("task-list");
const userName       = document.getElementById("user-name");
const userPhoto      = document.getElementById("user-photo");
const emptyMsg       = document.getElementById("empty-msg");

let currentUser = null;

googleLoginBtn.onclick = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
};

logoutBtn.onclick = () => auth.signOut();

auth.onAuthStateChanged(user => {
  if (user) {
    currentUser = user;
    userName.textContent = user.displayName.split(" ")[0];
    userPhoto.src = user.photoURL;
    loginScreen.classList.add("hidden");
    appScreen.classList.remove("hidden");
    loadTasks();
  } else {
    currentUser = null;
    loginScreen.classList.remove("hidden");
    appScreen.classList.add("hidden");
    taskList.innerHTML = "";
  }
});

addBtn.onclick = () => {
  const text = input.value.trim();
  if (!text || !currentUser) return;
  db.collection("users").doc(currentUser.uid)
    .collection("tasks").add({
      text,
      done: false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  input.value = "";
};

input.addEventListener("keypress", e => {
  if (e.key === "Enter") addBtn.click();
});

function loadTasks() {
  db.collection("users").doc(currentUser.uid)
    .collection("tasks")
    .orderBy("createdAt")
    .onSnapshot(snapshot => {
      taskList.innerHTML = "";
      emptyMsg.style.display = snapshot.empty ? "block" : "none";
      snapshot.forEach(doc => renderTask(doc.id, doc.data().text, doc.data().done));
    });
}

function renderTask(id, text, done) {
  const li = document.createElement("li");
  if (done) li.classList.add("done");

  const circle = document.createElement("div");
  circle.classList.add("check-circle");
  circle.onclick = () => {
    db.collection("users").doc(currentUser.uid)
      .collection("tasks").doc(id)
      .update({ done: !done });
  };

  const span = document.createElement("span");
  span.classList.add("task-text");
  span.textContent = text;
  span.onclick = () => {
    db.collection("users").doc(currentUser.uid)
      .collection("tasks").doc(id)
      .update({ done: !done });
  };

  const delBtn = document.createElement("button");
  delBtn.textContent = "×";
  delBtn.classList.add("delete-btn");
  delBtn.onclick = () => {
    li.style.opacity = "0";
    li.style.transform = "translateX(10px)";
    li.style.transition = "all 0.2s ease";
    setTimeout(() => {
      db.collection("users").doc(currentUser.uid)
        .collection("tasks").doc(id).delete();
    }, 200);
  };

  li.appendChild(circle);
  li.appendChild(span);
  li.appendChild(delBtn);
  taskList.appendChild(li);
}
