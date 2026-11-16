# Nhạc nền Vạn Kiếm Phi Tiên

Lưu 3 file MP3 của game trong thư mục này. Giữ đúng tên file để khớp với ba giai đoạn nhạc trong `music.js`.

| File | Giai đoạn | Tên hiển thị |
|---|---|---|
| `setup.mp3` | Mở đầu / chuẩn bị | Tĩnh Tâm Tu Luyện |
| `race.mp3` | Đang diễn ra cuộc đua | Vạn Kiếm Tranh Phong |
| `award.mp3` | Kết thúc / vinh danh | Tiên Hội Vinh Danh |

## Cách tải lên
1. Mở thư mục `assets/music/` trên GitHub.
2. Chọn **Add file → Upload files**.
3. Tải lên đúng ba file `setup.mp3`, `race.mp3`, `award.mp3`.
4. Commit lên nhánh `main`.

**Lưu ý:** Dùng chữ thường, không dấu, không khoảng trắng; định dạng MP3. `setup.mp3` hiện được game dùng làm nhạc mở đầu. `race.mp3` và `award.mp3` vẫn chưa được chuyển sang nguồn local. Đường dẫn các file là:
- `assets/music/setup.mp3`
- `assets/music/race.mp3`
- `assets/music/award.mp3`

`music.js` phát nhạc mở đầu từ `assets/music/setup.mp3`; hai giai đoạn đua và vinh danh vẫn dùng URL bên ngoài cho đến khi tải lên đủ file tương ứng và cập nhật nguồn phát.
