# Dữ liệu Vạn Kiếm Phi Tiên

Các tệp JSON trong thư mục này chứa dữ liệu và thông số có thể chỉnh sửa độc lập với mã xử lý.

- `characters.json`: bảng màu nhân vật, cấp bậc môn phái, màu da và tóc.
- `swords.json`: bảng màu phi kiếm/pháp khí và số kiểu hình.
- `effects.json`: danh sách hiệu ứng cuộc đua, hệ số tốc độ, thời lượng, màu và hạt hiệu ứng.
- `summoning.json`: thời gian nghi lễ, nhịp triệu hồi, số đợt, cột sáng và giới hạn nhân vật.
- `ceremony.json`: thời gian giải tán, chưởng môn lên kiếm, bay đi và trao thưởng.
- `scenery.json`: bảng màu bầu trời và mặt trời.

## Chỉnh sửa
Sửa giá trị trong tệp JSON, giữ nguyên tên khóa và cú pháp JSON. Sau khi commit, tải lại trang; `data-loader.js` sẽ tải các JSON trước rồi mới khởi chạy JavaScript.

JSON chứa dữ liệu/thông số. JavaScript vẫn giữ phần hình học Canvas, đường nét vẽ, thuật toán chuyển động và logic. Khi thêm một kiểu hình hoặc chuyển động hoàn toàn mới, vẫn cần bổ sung bộ vẽ/xử lý tương ứng trong JavaScript.
