import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Konfigurasi Firebase kamu
const firebaseConfig = {
    apiKey: "AIzaSyAXCRzyat67SeXm9HEvFJahpBNI_qN4mg",
    authDomain: "bookingfutsal-98db6.firebaseapp.com",
    databaseURL: "https://bookingfutsal-98db6-default-rtdb.firebaseio.com",
    projectId: "bookingfutsal-98db6",
    storageBucket: "bookingfutsal-98db6.firebasestorage.app",
    messagingSenderId: "185546726",
    appId: "1:185546726:web:c09458b9e58b0ea15d4827"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db, "bookings");

// FUNGSI KIRIM DATA (TANPA UPLOAD FOTO BIAR GAK MACET)
window.tambahBooking = function() {
    const nama = document.getElementById('nama').value;
    const hp = document.getElementById('hp').value;
    const tanggal = document.getElementById('tanggal').value;
    const jam = document.getElementById('jam').value;

    if (nama && hp && tanggal) {
        // Langsung simpan ke Database
        push(dbRef, {
            nama: nama,
            hp: hp,
            tanggal: tanggal,
            jam: jam,
            status: "Pending"
        }).then(() => {
            alert("Booking Berhasil Terkirim!");
            location.reload();
        }).catch((err) => {
            alert("Gagal: " + err.message);
        });
    } else {
        alert("Lengkapi Nama, WA, dan Tanggal!");
    }
};

// TAMPILAN JADWAL TERISI (USER)
onValue(dbRef, (snapshot) => {
    const listData = document.getElementById('listData');
    if (listData) {
        listData.innerHTML = "";
        snapshot.forEach((child) => {
            const data = child.val();
            listData.innerHTML += `<tr>
                <td>${data.nama}</td>
                <td>${data.tanggal}</td>
                <td>${data.jam}</td>
                <td style="color: green;">Confirmed</td>
            </tr>`;
        });
    }
});

// LOGIN OWNER
window.loginOwner = function() {
    const pass = prompt("Password Owner:");
    if (pass === "1234") {
        document.getElementById('user-page').style.display = 'none';
        document.getElementById('admin-page').style.display = 'block';
        loadAdmin();
    }
};

// TAMPILAN DASHBOARD OWNER
function loadAdmin() {
    const listAdmin = document.getElementById('listAdmin');
    onValue(dbRef, (snapshot) => {
        listAdmin.innerHTML = "";
        snapshot.forEach((child) => {
            const data = child.val();
            const waRaw = data.hp || "";
            const waFormat = waRaw.startsWith('0') ? '62' + waRaw.slice(1) : waRaw;
            
            listAdmin.innerHTML += `<tr>
                <td>${data.nama}</td>
                <td>${data.hp}</td>
                <td>${data.tanggal}</td>
                <td>${data.jam}</td>
                <td><a href="https://wa.me/${waFormat}" target="_blank" style="background:green; color:white; padding:5px; border-radius:3px; text-decoration:none;">Chat WA</a></td>
            </tr>`;
        });
    });
}