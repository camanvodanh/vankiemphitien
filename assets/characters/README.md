# Character assets

Mỗi nhân vật có một thư mục riêng theo ID ASCII, chữ thường, nối bằng dấu gạch ngang.

## Quy ước

`assets/characters/<character-id>/`

- `<character-id>-spritesheet.png`: sprite sheet, các frame xếp trái sang phải rồi xuống hàng.
- `frames/<character-id>-00.png`, `-01.png`, ...: từng frame PNG nền trong suốt.
- `README.md`: tên hiển thị, ID, số frame, kích thước, FPS và thứ tự phát.

Tên file không dấu, ổn định và không phụ thuộc tên hiển thị. Ví dụ: `than-sau`, `kiem-tien`, `bach-long`.
