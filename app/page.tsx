// app/page.tsx
"use client";

import { useState, useMemo } from "react";
import { SiswaData } from "./types";
import { analyzeCategory } from "./utils/expertEngine";
import { BookOpen, AlertCircle, CheckCircle, BarChart3 } from "lucide-react";

// DATASETS DUMMY (Diambil dari sample CSV Anda )
// Dalam produksi nyata, Anda bisa menggunakan PapaParse untuk membaca file .csv yang diupload
const rawData: SiswaData[] = [
  { id_siswa: "1", kelas: "12", kategori_buku: "Sains", minat_siswa: 81, jumlah_buku: 23, status_minat: "Tinggi", ketersediaan: "Lengkap" },
  { id_siswa: "2", kelas: "12", kategori_buku: "Sejarah", minat_siswa: 68, jumlah_buku: 12, status_minat: "Sedang", ketersediaan: "Kurang" },
  { id_siswa: "3", kelas: "11", kategori_buku: "Sains", minat_siswa: 80, jumlah_buku: 20, status_minat: "Tinggi", ketersediaan: "Cukup" },
  { id_siswa: "4", kelas: "12", kategori_buku: "Novel", minat_siswa: 56, jumlah_buku: 5, status_minat: "Sedang", ketersediaan: "Kurang" },
  { id_siswa: "14", kelas: "11", kategori_buku: "IPA", minat_siswa: 84, jumlah_buku: 27, status_minat: "Tinggi", ketersediaan: "Lengkap" },
  { id_siswa: "15", kelas: "11", kategori_buku: "IPA", minat_siswa: 82, jumlah_buku: 11, status_minat: "Tinggi", ketersediaan: "Kurang" },
  { id_siswa: "27", kelas: "10", kategori_buku: "Sains", minat_siswa: 90, jumlah_buku: 5, status_minat: "Tinggi", ketersediaan: "Kurang" },
  { id_siswa: "35", kelas: "11", kategori_buku: "Sains", minat_siswa: 92, jumlah_buku: 6, status_minat: "Tinggi", ketersediaan: "Kurang" },
  { id_siswa: "26", kelas: "12", kategori_buku: "IPS", minat_siswa: 66, jumlah_buku: 15, status_minat: "Sedang", ketersediaan: "Cukup" },
  // ... Tambahkan sisa data dari CSV di sini jika perlu
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Sains");

  // Mendapatkan list unik kategori
  const categories = useMemo(() => {
    return Array.from(new Set(rawData.map((d) => d.kategori_buku)));
  }, []);

  // Menjalankan Sistem Pakar saat kategori berubah
  const result = useMemo(() => {
    return analyzeCategory(rawData, selectedCategory);
  }, [selectedCategory]);

  return (
    <main className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header Laporan */}
        <header className="mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold text-blue-900 flex items-center gap-2">
            <BookOpen className="h-8 w-8" />
            Sistem Pakar Perpustakaan
          </h1>
          <p className="text-gray-600 mt-2">
            Rekomendasi Penambahan Koleksi Buku Berbasis Minat Siswa SMA
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Metode: Forward Chaining | Dataset: {rawData.length} Sampel Siswa
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Panel Kontrol (Input) */}
          <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Pilih Kategori</h2>
            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    selectedCategory === cat
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Panel Hasil (Output Sistem Pakar) */}
          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Hasil Analisis: {selectedCategory}
            </h2>

            {/* Statistik Ringkas */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">Rata-rata Minat</p>
                <p className="text-2xl font-bold text-blue-900">{result.avgInterest}/100</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-600 font-medium">Status Stok Dominan</p>
                <p className="text-2xl font-bold text-purple-900">{result.dominanAvailability}</p>
              </div>
            </div>

            {/* Rekomendasi Utama */}
            <div className={`p-6 rounded-xl border-l-4 mb-4 ${
              result.priority === 'High' ? 'bg-red-50 border-red-500 text-red-900' :
              result.priority === 'Medium' ? 'bg-yellow-50 border-yellow-500 text-yellow-900' :
              'bg-green-50 border-green-500 text-green-900'
            }`}>
              <div className="flex items-start gap-3">
                {result.priority === 'High' ? <AlertCircle className="h-6 w-6 mt-1" /> : <CheckCircle className="h-6 w-6 mt-1" />}
                <div>
                  <h3 className="font-bold text-lg mb-1">REKOMENDASI SISTEM:</h3>
                  <p className="text-xl font-bold uppercase tracking-wide">{result.recommendation}</p>
                </div>
              </div>
            </div>

            {/* Penjelasan (Reasoning) */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-2">Alasan Sistem:</h4>
              <p className="text-gray-600 italic">"{result.reason}"</p>
              <div className="mt-4 text-xs text-gray-400">
                *Analisis didasarkan pada {result.totalRequests} data siswa yang meminati kategori ini.
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}