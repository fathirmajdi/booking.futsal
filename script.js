function tambahBooking() {
    const nama = document.getElementById('nama').value;
    const tanggal = document.getElementById('tanggal').value;
    const jam = document.getElementById('jam').value;

    if (nama === "" || tanggal === "") {
        alert("Mohon isi semua data!");
        return;
    }

    const tabel = document.getElementById('listData');
    const barisBaru = tabel.insertRow();

    barisBaru.innerHTML = `
        <td>${nama}</td>
        <td>${tanggal}</td>
        <td>${jam}</td>
        <td style="color: green; font-weight: bold;">Confirmed</td>
    `;

    // Reset Form
    document.getElementById('nama').value = "";
    document.getElementById('tanggal').value = "";
    
    alert("Booking Berhasil!");
}