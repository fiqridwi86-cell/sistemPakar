export interface SiswaData {
  id_siswa: string;
  kelas: string;
  kategori_buku: string;
  minat_siswa: number; // Nilai 0-100
  jumlah_buku: number;
  status_minat: 'Tinggi' | 'Sedang' | 'Rendah';
  ketersediaan: 'Lengkap' | 'Cukup' | 'Kurang';
}

export interface AnalysisResult {
  category: string;
  avgInterest: number;
  dominanAvailability: string;
  totalRequests: number;
  recommendation: string;
  priority: 'High' | 'Medium' | 'Low';
  reason: string;
}