import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAXCRzyat67SeXm9HEvFJahpBNI_qN4mg",
    authDomain: "bookingfutsal-98db6.firebaseapp.com",
    databaseURL: "https://bookingfutsal-98db6-default-rtdb.firebaseio.com",
    projectId: "bookingfutsal-98db6",
    storageBucket: "bookingfutsal-98db6.firebasestorage.app",
    messagingSenderId: "185546726",
    appId: "1:185546726:web:c09458b9e58b0ea15d4827",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db, "bookings");

window.tambahBooking = async function() {
    const nama = document.getElementById('nama').value;
    const hp = document.getElementById('hp').value;
    const tanggal = document.getElementById('tanggal').value;
    const jam = document.getElementById('jam').value;

    if (nama && hp && tanggal) {
        // Simpan langsung tanpa upload foto biar nggak error
        await push(dbRef, {
            nama: nama,
            hp: hp,
            tanggal: tanggal,
            jam: jam,
            status: "DP 5k Pending"
        });
        alert("Booking Berhasil Terkirim!");
        location.reload();
    } else {
        alert("Isi Nama, No WA, dan Tanggal!");
    }
};

// Tabel Admin (Owner)
function loadAdmin() {
    const listA = document.getElementById('listAdmin');
    onValue(dbRef, (s) => {
        listA.innerHTML = "";
        if (!s.exists()) {
            listA.innerHTML = "<tr><td colspan='5'>Belum ada data</td></tr>";
            return;
        }
        s.forEach(c => {
            const d = c.val();
            const wa = d.hp.startsWith('0') ? '62' + d.hp.slice(1) : d.hp;
            listA.innerHTML += `<tr>
                <td>${d.nama}</td>
                <td>${d.hp}</td>
                <td>${d.tanggal}</td>
                <td>${d.jam}</td>
                <td><a href="https://wa.me/${wa}" target="_blank">Chat WA</a></td>
            </tr>`;
        });
    });
}

window.loginOwner = function() {
    if(prompt("Password:") === "1234") {
        document.getElementById('user-page').style.display = 'none';
        document.getElementById('admin-page').style.display = 'block';
        loadAdmin();
    }
};