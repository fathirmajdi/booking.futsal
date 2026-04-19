import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Konfigurasi sesuai foto project kamu
const firebaseConfig = {
    apiKey: "AIzaSyAXCRzyat67SeXm9HEvFJahpBNI_qN4mg",
    authDomain: "bookingfutsal-98db6.firebaseapp.com",
    databaseURL: "https://bookingfutsal-98db6-default-rtdb.firebaseio.com",
    projectId: "bookingfutsal-98db6",
    storageBucket: "bookingfutsal-98db6.firebasestorage.app",
    messagingSenderId: "185546726",
    appId: "1:185546726:web:c09458b9e58b0ea15d4827",
    measurementId: "G-MRN1WB5RTP"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db, "bookings");

// FUNGSI TAMBAH BOOKING
window.tambahBooking = function() {
    const nama = document.getElementById('nama').value;
    const tanggal = document.getElementById('tanggal').value;
    const jam = document.getElementById('jam').value;
    const hp = document.getElementById('hp').value;

    if (nama && tanggal && hp) {
        // Cek dulu apakah jadwal sudah ada
        get(dbRef).then((snapshot) => {
            let bentrok = false;
            snapshot.forEach((child) => {
                const data = child.val();
                if (data.tanggal === tanggal && data.jam === jam) {
                    bentrok = true;
                }
            });

            if (bentrok) {
                alert("Maaf, jam ini sudah dipesan orang lain!");
            } else {
                push(dbRef, { 
                    nama: nama, 
                    hp: hp, 
                    tanggal: tanggal, 
                    jam: jam, 
                    status: "Confirmed" 
                }).then(() => {
                    document.getElementById('modal-qris').style.display = 'block';
                    document.getElementById('nama').value = "";
                    document.getElementById('hp').value = "";
                    document.getElementById('tanggal').value = "";
                });
            }
        });
    } else {
        alert("Lengkapi semua data (Nama, WA, dan Tanggal)!");
    }
};

// TAMPILAN TABEL USER (REAL-TIME)
onValue(dbRef, (snapshot) => {
    const listData = document.getElementById('listData');
    if (listData) {
        listData.innerHTML = "";
        snapshot.forEach((child) => {
            const data = child.val();
            const row = `<tr>
                <td>${data.nama}</td>
                <td>${data.tanggal}</td>
                <td>${data.jam}</td>
                <td style="color: green; font-weight: bold;">Confirmed</td>
            </tr>`;
            listData.innerHTML += row;
        });
    }
});

// LOGIN OWNER
window.loginOwner = function() {
    const pass = prompt("Masukkan Password Owner:");
    if (pass === "1234") {
        document.getElementById('user-page').style.display = 'none';
        document.getElementById('admin-page').style.display = 'block';
        document.getElementById('main-container').classList.add('admin-wide');
        loadAdminData();
    } else {
        alert("Password salah!");
    }
};

window.logoutOwner = function() { 
    location.reload(); 
};

function loadAdminData() {
    const listAdmin = document.getElementById('listAdmin');
    onValue(dbRef, (snapshot) => {
        listAdmin.innerHTML = "";
        snapshot.forEach((child) => {
            const data = child.val();
            const waLink = `https://wa.me/${data.hp.replace(/^0/, '62')}`;
            const row = `<tr>
                <td>${data.nama}</td>
                <td>${data.hp}</td>
                <td>${data.tanggal}</td>
                <td>${data.jam}</td>
                <td><a href="${waLink}" target="_blank" style="color: blue; font-weight: bold;">Chat WA</a></td>
            </tr>`;
            listAdmin.innerHTML += row;
        });
    });
}

window.tutupModal = function() { 
    document.getElementById('modal-qris').style.display = 'none'; 
};