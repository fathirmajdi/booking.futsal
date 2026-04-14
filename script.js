// GANTI ISI DI DALAM KURUNG KURAWAL INI DENGAN DATA DARI FIREBASE KAMU
const firebaseConfig = {
  apiKey: "AIzaSyAXCRzyat67SeXm9HEvFJaahpBNI_qN4mg",
  authDomain: "bookingfutsal-98db6.firebaseapp.com",
  databaseURL: "https://bookingfutsal-98db6-default-rtdb.firebaseio.com",
  projectId: "bookingfutsal-98db6",
  storageBucket: "bookingfutsal-98db6.firebasestorage.app",
  messagingSenderId: "185546726",
  appId: "1:185546726:web:c09450b9e58b0ea15d4827",
  measurementId: "G-MRN1WB5RTP"
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