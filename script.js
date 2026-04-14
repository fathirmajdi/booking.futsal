// GANTI ISI DI DALAM KURUNG KURAWAL INI DENGAN DATA DARI FIREBASE KAMU
const firebaseConfig = {
  apiKey: "PASTE_API_KEY_KAMU",
  authDomain: "bookingfutsal-xxxx.firebaseapp.com",
  databaseURL: "https://bookingfutsal-xxxx-default-rtdb.firebaseio.com",
  projectId: "bookingfutsal-xxxx",
  storageBucket: "bookingfutsal-xxxx.appspot.com",
  messagingSenderId: "xxxxxxxx",
  appId: "x:xxxxxxx:web:xxxxxxx"
};

// Hubungkan ke Library Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db, "bookings");

// Fungsi supaya tombol di HTML bisa jalan
window.tambahBooking = function() {
    const nama = document.getElementById('nama').value;
    const tanggal = document.getElementById('tanggal').value;
    const jam = document.getElementById('jam').value;

    if (nama && tanggal) {
        push(dbRef, { nama, tanggal, jam }); // Simpan ke Cloud
        document.getElementById('nama').value = "";
        alert("Booking Berhasil Simpan di Cloud!");
    } else {
        alert("Isi nama dan tanggal dulu ya!");
    }
}

// Ambil data otomatis (Real-time)
onValue(dbRef, (snapshot) => {
    const listData = document.getElementById('listData');
    listData.innerHTML = "";
    snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        const row = listData.insertRow();
        row.innerHTML = `
            <td>${data.nama}</td>
            <td>${data.tanggal}</td>
            <td>${data.jam}</td>
            <td style="color: green; font-weight: bold;">Confirmed</td>
        `;
    });
});