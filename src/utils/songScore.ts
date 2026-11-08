/**
 * Notes frequency map and melody score for
 * "BÀI CA NGƯỜI GIÁO VIÊN NHÂN DÂN" (Nhạc sĩ Hoàng Vân)
 *
 * Lời mở đầu:
 * "Trên những nẻo đường của tổ quốc xanh tươi,
 * có những loài hoa thơm đậm đà sắc hương,
 * có những bài ca nghe rạo rực lòng người.
 * Bài ca ấy, loài hoa ấy, đẹp như em, người giáo viên nhân dân..."
 */

export interface MusicalNote {
  note: string;
  freq: number;
  duration: number; // in beats (1 = quarter note, 0.5 = eighth, 2 = half, etc.)
}

// Standard frequencies
const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, B4 = 493.88;
const C5 = 523.25, D5 = 587.33, E5 = 659.25, F5 = 698.46, G5 = 783.99, A5 = 880.00, B5 = 987.77;
const C6 = 1046.50;

/**
 * Melody score of "BỤI PHẤN" (Nhạc: Vũ Hoàng - Thơ: Lê Văn Lộc)
 * "Khi thầy viết bảng, bụi phấn rơi rơi...
 * Có hạt bụi nào rơi trên bục giảng, có hạt bụi nào vương trên tóc thầy..."
 */
export const BUI_PHAN_MELODY: MusicalNote[] = [
  // "Khi thầy viết bảng, bụi phấn rơi rơi"
  { note: 'C4', freq: C4, duration: 1 },
  { note: 'E4', freq: E4, duration: 1 },
  { note: 'G4', freq: G4, duration: 1 },
  { note: 'A4', freq: A4, duration: 1.5 },
  { note: 'G4', freq: G4, duration: 0.5 },
  { note: 'A4', freq: A4, duration: 0.5 },
  { note: 'G4', freq: G4, duration: 1 },
  { note: 'E4', freq: E4, duration: 2 },

  // "Có hạt bụi nào rơi trên bục giảng"
  { note: 'C4', freq: C4, duration: 1 },
  { note: 'E4', freq: E4, duration: 1 },
  { note: 'G4', freq: G4, duration: 1 },
  { note: 'A4', freq: A4, duration: 1.5 },
  { note: 'C5', freq: C5, duration: 0.5 },
  { note: 'A4', freq: A4, duration: 0.5 },
  { note: 'G4', freq: G4, duration: 1 },
  { note: 'E4', freq: E4, duration: 2 },

  // "Có hạt bụi nào vương trên tóc thầy"
  { note: 'C4', freq: C4, duration: 1 },
  { note: 'E4', freq: E4, duration: 1 },
  { note: 'G4', freq: G4, duration: 1 },
  { note: 'A4', freq: A4, duration: 1.5 },
  { note: 'G4', freq: G4, duration: 0.5 },
  { note: 'A4', freq: A4, duration: 0.5 },
  { note: 'C5', freq: C5, duration: 1 },
  { note: 'D5', freq: D5, duration: 2 },

  // "Em yêu phút giây này, thầy em tóc như bạc thêm"
  { note: 'C5', freq: C5, duration: 1 },
  { note: 'A4', freq: A4, duration: 1 },
  { note: 'G4', freq: G4, duration: 1 },
  { note: 'E4', freq: E4, duration: 1.5 },
  { note: 'G4', freq: G4, duration: 0.5 },
  { note: 'A4', freq: A4, duration: 1 },
  { note: 'C5', freq: C5, duration: 1 },
  { note: 'D5', freq: D5, duration: 2 },

  // "Bạc thêm vì bụi phấn, cho em bài học hay"
  { note: 'D5', freq: D5, duration: 1 },
  { note: 'E5', freq: E5, duration: 1 },
  { note: 'D5', freq: D5, duration: 1 },
  { note: 'C5', freq: C5, duration: 1.5 },
  { note: 'A4', freq: A4, duration: 0.5 },
  { note: 'C5', freq: C5, duration: 1 },
  { note: 'D5', freq: D5, duration: 1 },
  { note: 'C5', freq: C5, duration: 2 },

  // "Mai sau lớn nên người, làm sao có thể nào quên"
  { note: 'C5', freq: C5, duration: 1 },
  { note: 'A4', freq: A4, duration: 1 },
  { note: 'G4', freq: G4, duration: 1 },
  { note: 'E4', freq: E4, duration: 1.5 },
  { note: 'G4', freq: G4, duration: 0.5 },
  { note: 'A4', freq: A4, duration: 1 },
  { note: 'C5', freq: C5, duration: 1 },
  { note: 'D5', freq: D5, duration: 2 },

  // "Ngày xưa thầy dạy dỗ khi em tuổi còn thơ"
  { note: 'D5', freq: D5, duration: 1 },
  { note: 'E5', freq: E5, duration: 1 },
  { note: 'D5', freq: D5, duration: 1 },
  { note: 'C5', freq: C5, duration: 1.5 },
  { note: 'A4', freq: A4, duration: 0.5 },
  { note: 'C5', freq: C5, duration: 1 },
  { note: 'D5', freq: D5, duration: 1 },
  { note: 'C5', freq: C5, duration: 3 },
];

/**
 * Melody score of "Bài ca người giáo viên nhân dân" in F Major / C Major harmonious transcription
 * Tempo: ~90 BPM (1 beat = ~0.67s)
 */
export const BAI_CA_NGUOI_GIAO_VIEN_NHAN_DAN_MELODY: MusicalNote[] = [
  // Đoạn 1: "Trên những nẻo đường của tổ quốc xanh tươi"
  { note: 'C4', freq: C4, duration: 1 },
  { note: 'E4', freq: E4, duration: 0.5 },
  { note: 'G4', freq: G4, duration: 0.5 },
  { note: 'A4', freq: A4, duration: 1 },
  { note: 'G4', freq: G4, duration: 1 },
  { note: 'C5', freq: C5, duration: 1.5 },
  { note: 'B4', freq: B4, duration: 0.5 },
  { note: 'A4', freq: A4, duration: 1 },
  { note: 'G4', freq: G4, duration: 2 },

  // "Có những loài hoa thơm đậm đà sắc hương"
  { note: 'E4', freq: E4, duration: 1 },
  { note: 'G4', freq: G4, duration: 0.5 },
  { note: 'A4', freq: A4, duration: 0.5 },
  { note: 'C5', freq: C5, duration: 1 },
  { note: 'A4', freq: A4, duration: 1 },
  { note: 'G4', freq: G4, duration: 1 },
  { note: 'E4', freq: E4, duration: 1 },
  { note: 'D4', freq: D4, duration: 2 },

  // "Có những bài ca nghe rạo rực lòng người"
  { note: 'C4', freq: C4, duration: 1 },
  { note: 'E4', freq: E4, duration: 0.5 },
  { note: 'G4', freq: G4, duration: 0.5 },
  { note: 'A4', freq: A4, duration: 1 },
  { note: 'C5', freq: C5, duration: 1 },
  { note: 'D5', freq: D5, duration: 1.5 },
  { note: 'C5', freq: C5, duration: 0.5 },
  { note: 'A4', freq: A4, duration: 1 },
  { note: 'G4', freq: G4, duration: 2 },

  // "Bài ca ấy, loài hoa ấy, đẹp như em, người giáo viên nhân dân"
  { note: 'E4', freq: E4, duration: 1 },
  { note: 'G4', freq: G4, duration: 1 },
  { note: 'A4', freq: A4, duration: 1 },
  { note: 'C5', freq: C5, duration: 1 },
  { note: 'D5', freq: D5, duration: 1 },
  { note: 'E5', freq: E5, duration: 1 },
  { note: 'D5', freq: D5, duration: 0.5 },
  { note: 'C5', freq: C5, duration: 0.5 },
  { note: 'A4', freq: A4, duration: 1 },
  { note: 'G4', freq: G4, duration: 1 },
  { note: 'C5', freq: C5, duration: 3 },

  // Điệp khúc: "Tâm hồn em tươi mát xanh như bóng lá bàng"
  { note: 'C5', freq: C5, duration: 1 },
  { note: 'E5', freq: E5, duration: 1.5 },
  { note: 'D5', freq: D5, duration: 0.5 },
  { note: 'C5', freq: C5, duration: 1 },
  { note: 'A4', freq: A4, duration: 1 },
  { note: 'G4', freq: G4, duration: 1 },
  { note: 'C5', freq: C5, duration: 1 },
  { note: 'D5', freq: D5, duration: 2 },

  // "Trái tim em đỏ nhiệt tình như hoa phượng vĩ"
  { note: 'D5', freq: D5, duration: 1 },
  { note: 'G5', freq: G5, duration: 1.5 },
  { note: 'E5', freq: E5, duration: 0.5 },
  { note: 'D5', freq: D5, duration: 1 },
  { note: 'C5', freq: C5, duration: 1 },
  { note: 'A4', freq: A4, duration: 1 },
  { note: 'C5', freq: C5, duration: 1 },
  { note: 'G4', freq: G4, duration: 2 },

  // "Như chim bay về khắp miền em lên đường"
  { note: 'E4', freq: E4, duration: 1 },
  { note: 'G4', freq: G4, duration: 0.5 },
  { note: 'A4', freq: A4, duration: 0.5 },
  { note: 'C5', freq: C5, duration: 1 },
  { note: 'D5', freq: D5, duration: 1 },
  { note: 'E5', freq: E5, duration: 1.5 },
  { note: 'D5', freq: D5, duration: 0.5 },
  { note: 'C5', freq: C5, duration: 2 },

  // "Tung bay xa nhiều thế hệ cháu Bác Hồ"
  { note: 'A4', freq: A4, duration: 1 },
  { note: 'C5', freq: C5, duration: 1 },
  { note: 'D5', freq: D5, duration: 1 },
  { note: 'E5', freq: E5, duration: 1 },
  { note: 'G5', freq: G5, duration: 1.5 },
  { note: 'E5', freq: E5, duration: 0.5 },
  { note: 'D5', freq: D5, duration: 2 },

  // "Tự hào như em người chiến sĩ văn hóa"
  { note: 'E5', freq: E5, duration: 1 },
  { note: 'D5', freq: D5, duration: 0.5 },
  { note: 'C5', freq: C5, duration: 0.5 },
  { note: 'A4', freq: A4, duration: 1 },
  { note: 'G4', freq: G4, duration: 1 },
  { note: 'C5', freq: C5, duration: 1 },
  { note: 'D5', freq: D5, duration: 1 },
  { note: 'E5', freq: E5, duration: 2 },

  // "Lớn lên rồi trong chiếc nôi quê hương Việt Nam..."
  { note: 'D5', freq: D5, duration: 1 },
  { note: 'C5', freq: C5, duration: 0.5 },
  { note: 'A4', freq: A4, duration: 0.5 },
  { note: 'G4', freq: G4, duration: 1 },
  { note: 'E4', freq: E4, duration: 1 },
  { note: 'A4', freq: A4, duration: 1 },
  { note: 'D4', freq: D4, duration: 1 },
  { note: 'C4', freq: C4, duration: 3 },
];
