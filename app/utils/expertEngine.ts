// app/utils/expertEngine.ts
import { SiswaData, AnalysisResult } from "../types";

// Fungsi untuk menghitung modus (nilai yang paling sering muncul)
function getMode(array: string[]): string {
  return array.sort((a,b) =>
        array.filter(v => v===a).length - array.filter(v => v===b).length
    ).pop() || "Cukup";
}

// MESIN INFERENSI (Forward Chaining)
export const analyzeCategory = (data: SiswaData[], category: string): AnalysisResult => {
  // 1. Kumpulkan Fakta (Fact Gathering)
  const categoryData = data.filter((d) => d.kategori_buku === category);
  
  if (categoryData.length === 0) {
    return {
      category,
      avgInterest: 0,
      dominanAvailability: 'Tidak Ada Data',
      totalRequests: 0,
      recommendation: "Tidak ada data cukup untuk analisis.",
      priority: "Low",
      reason: "Data kosong."
    };
  }

  // Hitung rata-rata minat
  const totalInterest = categoryData.reduce((acc, curr) => acc + Number(curr.minat_siswa), 0);
  const avgInterest = totalInterest / categoryData.length;

  // Cari status ketersediaan yang paling dominan (Modus)
  const availabilityList = categoryData.map((d) => d.ketersediaan);
  const dominanAvailability = getMode(availabilityList);

  // 2. Eksekusi Aturan (Rule Execution)
  // Aturan diturunkan dari Logika Dokumen: Minat Tinggi + Ketersediaan Kurang = Prioritas
  
  let recommendation = "";
  let priority: 'High' | 'Medium' | 'Low' = "Low";
  let reason = "";

  if (avgInterest >= 75 && (dominanAvailability === "Kurang" || dominanAvailability === "Cukup")) {
    recommendation = "SANGAT DISARANKAN MENAMBAH KOLEKSI";
    priority = "High";
    reason = "Minat siswa sangat tinggi namun ketersediaan buku masih kurang/terbatas.";
  } else if (avgInterest >= 50 && avgInterest < 75 && dominanAvailability === "Kurang") {
    recommendation = "DISARANKAN MENAMBAH KOLEKSI";
    priority = "Medium";
    reason = "Minat siswa cukup stabil, namun stok buku menipis.";
  } else if (avgInterest >= 75 && dominanAvailability === "Lengkap") {
    recommendation = "PERTAHANKAN KOLEKSI / UPDATE EDISI BARU";
    priority = "Medium";
    reason = "Minat tinggi dan stok sudah lengkap. Fokus pada pembaruan edisi.";
  } else if (avgInterest < 50 && dominanAvailability === "Lengkap") {
    recommendation = "TIDAK PERLU PENAMBAHAN SAAT INI";
    priority = "Low";
    reason = "Minat rendah padahal stok lengkap. Perlu promosi literasi, bukan penambahan buku.";
  } else {
    recommendation = "MONITORING BERKALA";
    priority = "Low";
    reason = "Kondisi seimbang antara minat dan ketersediaan.";
  }

  return {
    category,
    avgInterest: parseFloat(avgInterest.toFixed(1)),
    dominanAvailability,
    totalRequests: categoryData.length,
    recommendation,
    priority,
    reason
  };
};