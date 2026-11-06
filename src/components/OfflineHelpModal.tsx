import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Monitor, Download, Globe, CheckCircle2, ShieldCheck, Laptop } from 'lucide-react';
import { downloadStandaloneSingleHtml } from '../utils/htmlExporter';

interface OfflineHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OfflineHelpModal: React.FC<OfflineHelpModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl max-h-[85vh] bg-[#0c1935] border border-amber-400/40 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-800 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                <Laptop className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-amber-100">
                  Hướng Dẫn Sử Dụng & Triển Khai
                </h3>
                <p className="text-xs text-stone-300">
                  Tổ Toán – Trường THPT Gia Hội · Mừng Ngày 20/11
                </p>
              </div>
            </div>

            {/* Section 1: Hướng dẫn mở trên Windows */}
            <div className="space-y-6 text-sm text-stone-200">
              <div className="bg-slate-900/70 border border-slate-700/60 rounded-2xl p-4">
                <h4 className="text-amber-300 font-semibold text-sm flex items-center gap-2 mb-2">
                  <Monitor className="w-4 h-4" />
                  <span>1. Cách chạy trên máy tính Windows (Ngoại tuyến 100%)</span>
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm text-stone-300">
                  <li>
                    Nhấn nút <strong className="text-amber-200">“Tải 1 file HTML mở ngoại tuyến”</strong> bên dưới hoặc ở chân trang.
                  </li>
                  <li>
                    Lưu file <code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300 text-xs">Tri-An-Thay-Co-20-11-To-Toan-THPT-Gia-Hoi.html</code> vào USB hoặc màn hình máy tính (Desktop).
                  </li>
                  <li>
                    Nhấp đúp chuột vào file để mở trực tiếp bằng <strong>Google Chrome, Microsoft Edge, Cốc Cốc hoặc Firefox</strong>.
                  </li>
                  <li>
                    Không cần kết nối mạng Internet, không cần cài đặt Node.js hay phần mềm máy chủ.
                  </li>
                </ol>
              </div>

              {/* Section 2: Trình chiếu Hội trường & Máy chiếu */}
              <div className="bg-slate-900/70 border border-slate-700/60 rounded-2xl p-4">
                <h4 className="text-amber-300 font-semibold text-sm flex items-center gap-2 mb-2">
                  <Monitor className="w-4 h-4" />
                  <span>2. Chế độ Trình chiếu Hội trường / Tivi thông minh lớp học</span>
                </h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-stone-300">
                  <li>
                    ✦ Nhấn phím <strong className="text-amber-200">F11</strong> (hoặc biểu tượng Toàn màn hình ở góc trên) để mở chế độ trình chiếu không viền.
                  </li>
                  <li>
                    ✦ Âm thanh giai điệu tri ân được tạo tự động bằng Web Audio API, sẵn sàng phát qua loa hội trường mà không lo lỗi bản quyền hay nghẽn mạng.
                  </li>
                </ul>
              </div>

              {/* Section 3: Triển khai miễn phí lên GitHub Pages */}
              <div className="bg-slate-900/70 border border-slate-700/60 rounded-2xl p-4">
                <h4 className="text-amber-300 font-semibold text-sm flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4" />
                  <span>3. Triển khai miễn phí lên GitHub Pages</span>
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm text-stone-300">
                  <li>Đăng nhập <strong className="text-amber-200">github.com</strong> và tạo một kho lưu trữ mới (Repository) ở chế độ Public.</li>
                  <li>Tải file <code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300 text-xs">index.html</code> lên nhánh chính (<code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300 text-xs">main</code>).</li>
                  <li>Vào mục <strong>Settings</strong> → <strong>Pages</strong> → Tại <strong>Build and deployment</strong>, chọn Branch là <strong>main / (root)</strong> rồi nhấn <strong>Save</strong>.</li>
                  <li>Sau 1-2 phút, bạn sẽ nhận được đường link web miễn phí vĩnh viễn (dạng: <code className="bg-slate-800 px-1 py-0.5 rounded text-xs text-amber-300">https://ten-ban.github.io/ten-repo/</code>) để gửi cho toàn thể Thầy Cô!</li>
                </ol>
              </div>

              {/* Section 4: Danh mục chức năng đã hoàn thiện */}
              <div className="bg-slate-900/70 border border-slate-700/60 rounded-2xl p-4">
                <h4 className="text-amber-300 font-semibold text-sm flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>4. Danh mục tính năng hoàn thiện</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-300">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> Màn hình mở đầu chuyển động nghệ thuật
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> Bó hoa nghệ thuật 8 đóa hoa tương tác
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> Biểu tượng 20·11 mạ vàng & họa tiết Toán
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> Bức thư tri ân nguyên văn từ Tổ Toán
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> Vườn tri thức kết hợp hoa & đồ thị hàm số
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> Thiệp 3D cá nhân hóa tên người nhận
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> Nhạc nền hòa tấu Bài ca người giáo viên nhân dân (hỗ trợ MP3/WAV)
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> Pháo hoa 3D Golden Sapphire với 12 hình dạng nghệ thuật
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> Tương tác cảm ứng / kích chuột bắn pháo hoa theo tọa độ chính xác
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> 3 cấp độ pháo hoa: Lung linh, Rực rỡ, Đại tiệc ánh sáng
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> Hiệu ứng phản chiếu mặt nước, sao băng & bụi vàng rơi
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> Tương thích toàn diện iPhone (Safari), iPad, Android và PC
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> Xuất file HTML đơn mở ngoại tuyến
                  </div>
                </div>
              </div>

              {/* Section 5: Hướng dẫn tải file nhạc MP3 cho Quản trị viên */}
              <div className="bg-slate-900/70 border border-amber-400/40 rounded-2xl p-4">
                <h4 className="text-amber-300 font-semibold text-sm flex items-center gap-2 mb-2">
                  <Laptop className="w-4 h-4" />
                  <span>5. Vị trí tải file nhạc MP3 / WAV (Quản trị viên)</span>
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Để phát bản hòa tấu MP3 do bạn chuẩn bị, chỉ cần đặt file âm thanh vào thư mục công khai của dự án theo một trong các tên sau:
                </p>
                <div className="mt-2 p-2 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono text-amber-300 space-y-1">
                  <div>/public/assets/audio/bai-ca-nguoi-giao-vien-nhan-dan.mp3</div>
                  <div className="text-stone-400">hoặc: /public/assets/audio/bai_ca_nguoi_giao_vien_nhan_dan.mp3</div>
                </div>
                <p className="mt-2 text-[11px] text-stone-400">
                  ✦ Hệ thống sẽ tự động phát hiện và phát file MP3 của bạn ngay khi có sẵn. Nếu chưa tải file lên, hệ thống sẽ tự động hòa tấu giao hưởng phòng thu chuẩn giai điệu nhạc sĩ Hoàng Vân, đảm bảo trải nghiệm liên tục và giàu cảm xúc.
                </p>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  downloadStandaloneSingleHtml();
                }}
                className="flex-1 min-w-[200px] flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Tải ngay 1 file HTML chạy Offline</span>
              </button>

              <button
                onClick={onClose}
                className="py-3 px-5 bg-slate-800 hover:bg-slate-700 text-stone-200 text-sm font-semibold rounded-xl transition-all"
              >
                Đóng
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
