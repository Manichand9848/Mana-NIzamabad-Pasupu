import { auth } from "./firebase.js";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const provider = new GoogleAuthProvider();

// ================= GOOGLE LOGIN =================
window.loginWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then(() => {
      window.location.href = "cart.html";   // DIRECT TO CHECKOUT
    })
    .catch((error) => {
      alert(error.message);
    });
};

// ================= EMAIL LOGIN =================
window.login = () => {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "cart.html";   // DIRECT TO CHECKOUT
    })
    .catch((error) => {
      alert(error.message);
    });
};

// ================= SIGNUP =================
window.signup = () => {
  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      return updateProfile(userCredential.user, {
        displayName: name
      });
    })
    .then(() => {
      window.location.href = "cart.html";   // DIRECT TO CHECKOUT
    })
    .catch((error) => {
      alert(error.message);
    });
};

// ================= LOGOUT =================
window.logout = () => {
  signOut(auth)
    .then(() => {
      window.location.href = "login.html";
    })
    .catch((error) => {
      alert(error.message);
    });
};

// ================= AUTO REDIRECT IF LOGGED IN =================
onAuthStateChanged(auth, (user) => {
  if (user && window.location.pathname.includes("login.html")) {
    window.location.href = "cart.html";
  }
});
import {
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// SET RECAPTCHA
window.recaptchaVerifier = new RecaptchaVerifier(
  auth,
  "recaptcha-container",
  {
    size: "normal"
  }
);

// SEND OTP
window.sendOTP = () => {
  const phoneNumber = document.getElementById("phoneNumber").value;

  signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier)
    .then((confirmationResult) => {
      window.confirmationResult = confirmationResult;
      alert("OTP Sent!");
    })
    .catch((error) => {
      alert(error.message);
    });
};

// VERIFY OTP
window.verifyOTP = () => {
  const code = document.getElementById("otp").value;

  window.confirmationResult.confirm(code)
    .then((result) => {
      alert("Phone Login Successful!");
      window.location.href = "checkout.html";
    })
    .catch((error) => {
      alert("Invalid OTP");
    });
};
