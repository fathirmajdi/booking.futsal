import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

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
const storage = getStorage(app);
const dbRef = ref(db, "bookings");

window.tambahBooking = async function() {
    const nama = document.getElementById('nama').value;
    const hp = document.getElementById('hp').value;
    const tanggal = document.getElementById('tanggal').value;
    const jam = document.getElementById('jam').value;
    const buktiFile = document.getElementById('bukti').files[0];

    if (!nama || !hp || !tanggal || !buktiFile) {
        alert("Lengkapi semua data dan upload bukti transfer!");
        return;
    }

    try {
        const snap = await get(dbRef);
        let bentrok = false;
        snap.forEach(c => { if(c.val().tanggal === tanggal && c.val().jam === jam) bentrok = true; });
        if(bentrok) { alert("Jadwal sudah penuh!"); return; }

        alert("Sedang mengirim data...");
        const fileRef = sRef(storage, `bukti/${Date.now()}_${nama}`);
        const upload = await uploadBytes(fileRef, buktiFile);
        const url = await getDownloadURL(upload.ref);

        await push(dbRef, { 
            nama, hp, tanggal, jam, 
            bukti: url, 
            status: "DP 5k Paid" 
        });
        alert("Booking Berhasil!");
        location.reload();
    } catch (e) { alert("Error: " + e.message); }
};

onValue(dbRef, (s) => {
    const list = document.getElementById('listData');
    if(list) {
        list.innerHTML = "";
        s.forEach(c => {
            const d = c.val();
            list.innerHTML += `<tr><td>${d.nama}</td><td>${d.tanggal}</td><td>${d.jam}</td><td style="color:green; font-weight:bold;">Confirmed</td></tr>`;
        });
    }
});

window.loginOwner = function() {
    const pass = prompt("Masukkan Password Owner:");
    if (pass === "1234") {
        document.getElementById('user-page').style.display = 'none';
        document.getElementById('admin-page').style.display = 'block';
        document.getElementById('main-container').classList.add('admin-wide');
        loadAdmin();
    } else {
        alert("Password salah!");
    }
};

function loadAdmin() {
    const listA = document.getElementById('listAdmin');
    onValue(dbRef, (s) => {
        listA.innerHTML = "";
        s.forEach(c => {
            const d = c.val();
            const waRaw = d.hp || "";
            const nomorMurni = waRaw.replace(/[^0-9]/g, '');
            const waFormat = nomorMurni.startsWith('0') ? '62' + nomorMurni.slice(1) : nomorMurni;
            const waLink = `https://wa.me/${waFormat}`;

            listA.innerHTML += `<tr>
                <td>${d.nama || "-"}</td>
                <td>${d.hp || "-"}</td>
                <td>${d.tanggal || "-"} (${d.jam || "-"})</td>
                <td><a href="${d.bukti}" target="_blank"><img src="${d.bukti}" class="img-bukti"></a></td>
                <td><a href="${waLink}" target="_blank" style="color:blue; font-weight:bold; text-decoration:none;">Chat WA</a></td>
            </tr>`;
        });
    });
}