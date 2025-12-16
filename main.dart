void main() {
  // Deklarasi variabel nilai
  int nilai = 80;

  // Percabangan menggunakan if-else
  if (nilai >= 75) {
    // Dieksekusi jika kondisi bernilai benar
    print("Lulus");
  } else {
    // Dieksekusi jika kondisi bernilai salah
    print("Gagal");
  }

  // Perulangan menggunakan for loop
  for (int i = 1; i <= 3; i++) {
    // Menampilkan nilai perulangan menggunakan String Interpolation
    print("Perulangan ke-$i");
  }
}
