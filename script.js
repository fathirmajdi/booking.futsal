import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// Pastikan ada 'get' di baris import bawah ini
import { getDatabase, ref, push, onValue, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

window.tambahBooking = async function() {
    const nama = document.getElementById('nama').value;
    const hp = document.getElementById('hp').value;
    const tanggal = document.getElementById('tanggal').value;
    const jam = document.getElementById('jam').value;
    const fileInput = document.getElementById('bukti');
    const btn = document.getElementById('btn-booking');

    if (!nama || !hp || !tanggal || fileInput.files.length === 0) {
        alert("Mohon lengkapi data dan upload bukti bayar!");
        return;
    }

    try {
        btn.disabled = true;
        btn.innerText = "Mengecek Jadwal...";

        // --- LOGIKA CEK JADWAL BENTROK ---
        const snapshot = await get(dbRef); // Mengambil semua data booking yang sudah ada
        let sudahAda = false;

        if (snapshot.exists()) {
            snapshot.forEach((child) => {
                const data = child.val();
                // Mengecek apakah ada tanggal DAN jam yang sama persis
                if (data.tanggal === tanggal && data.jam === jam) {
                    sudahAda = true;
                }
            });
        }

        if (sudahAda) {
            alert("Maaf, tanggal dan jam ini sudah dipesan orang lain. Silakan pilih jadwal lain!");
            btn.disabled = false;
            btn.innerText = "KIRIM & BOOKING SEKARANG";
            return; // Berhenti di sini jika jadwal bentrok
        }
        // --------------------------------

        btn.innerText = "Mengirim...";
        const fotoTeks = await toBase64(fileInput.files[0]);

        await push(dbRef, {
            nama: nama,
            hp: hp,
            tanggal: tanggal,
            jam: jam,
            bukti: fotoTeks,
            status: "Selesai"
        });

        alert("Booking Berhasil! Jadwal telah aman.");
        location.reload();
    } catch (err) {
        alert("Gagal mengirim: " + err.message);
        btn.disabled = false;
        btn.innerText = "KIRIM & BOOKING SEKARANG";
    }
};

onValue(dbRef, (snapshot) => {
    const listData = document.getElementById('listData');
    const listAdmin = document.getElementById('listAdmin');
    if (!listData || !listAdmin) return;
    listData.innerHTML = "";
    listAdmin.innerHTML = "";

    snapshot.forEach((child) => {
        const d = child.val();
        listData.innerHTML += `<tr><td>${d.nama}</td><td>${d.tanggal}</td><td>${d.jam}</td><td><span style="color:green">Confirmed</span></td></tr>`;
        
        const waFormat = d.hp.startsWith('0') ? '62' + d.hp.slice(1) : d.hp;
        listAdmin.innerHTML += `<tr>
            <td>${d.nama}</td>
            <td>${d.hp}</td>
            <td>${d.tanggal}<br>${d.jam}</td>
            <td><img src="${d.bukti}" width="80" style="border-radius:5px; cursor:pointer;" onclick="window.open('${d.bukti}')"></td>
            <td><a href="https://wa.me/${waFormat}" target="_blank" style="color:white; background:green; padding:5px 10px; border-radius:5px; text-decoration:none;">Chat WA</a></td>
        </tr>`;
    });
});

window.loginOwner = function() {
    if (prompt("Masukkan Password Akses Owner:") === "1234") {
        document.getElementById('user-page').style.display = 'none';
        document.getElementById('admin-page').style.display = 'block';
    }
};