# GAME CONFIG — Quy chuẩn thiết lập và cân bằng game

> Tài liệu mô tả các thiết lập hiện có, giá trị mặc định, giới hạn và nguồn dữ liệu chuẩn của Vạn Kiếm Phi Tiên. Đây là tài liệu đối chiếu bắt buộc khi thêm/sửa thiết lập, cân bằng gameplay hoặc chỉnh giao diện điều khiển. Không tự ý coi các con số trong tài liệu là nguồn chạy của game: giá trị thực thi phải nằm ở đúng tệp cấu hình/code được ghi dưới đây.

## 1. Nguyên tắc nguồn dữ liệu

- Các tệp JSON trong thư mục `data/` là nguồn cấu hình dữ liệu cho các nhóm đã được code đọc từ `window.VKP_DATA`.
- `data-loader.js` hiện tải 6 tệp: `characters.json`, `swords.json`, `effects.json`, `summoning.json`, `ceremony.json`, `scenery.json`; chỉ sau khi tải thành công mới nạp các script game.
- Không tạo thêm giá trị mặc định trùng lặp trong JavaScript nếu giá trị đã có trong JSON. Nếu UI cần danh sách lựa chọn tĩnh (HTML select, slider, aria min/max), phải đồng bộ với JSON hoặc chuyển sang sinh từ JSON.
- Không sửa riêng tài liệu mà bỏ quên JSON, UI hoặc logic đang sử dụng thiết lập đó. Sau khi đổi giá trị phải kiểm tra toàn bộ nơi đọc giá trị.
- Các thông số chưa được đưa vào JSON vẫn có thể đang được đặt trực tiếp trong JavaScript/CSS/HTML. Không được tự ý chuyển chúng sang JSON trong một lần sửa nhỏ nếu chưa kiểm tra đầy đủ tác động.

## 2. Thiết lập người chơi nhìn thấy

| Thiết lập | Giá trị hiện tại | Nguồn thực tế |
|---|---|---|
| Số tiên nhân mặc định | 10 | `index.html` input `#quantity` |
| Số tiên nhân tối thiểu | 2 | `index.html` input `#quantity` |
| Số tiên nhân tối đa | 100 | `data/summoning.json` `maximumRacers`; logic triệu hồi cũng kiểm tra giới hạn |
| Danh sách tên | Mỗi dòng một tên; để trống thì tạo tên Tiên nhân tự động | `index.html` `#names`, logic `summon()` |

**Quy tắc tên tự sinh:** với tối đa 40 tiên nhân, không lặp tên riêng dù họ khác nhau. Trên 40 tiên nhân, tên riêng được tái sử dụng cân bằng; mỗi lần lặp phải đi cùng một họ khác, không trùng toàn bộ họ và tên.
| Thời lượng đua | 30, 60, 120, 180, 300 giây ở native select hiện tại; vòng pháp luân có danh sách tùy chọn riêng | `index.html` `#speed`, `data/summoning.json` `durationOptions`, logic điều khiển pháp luân |
| Ngôn ngữ | Bộ chọn ngôn ngữ trên thanh đầu trang | `index.html`, `i18n.js` |
| Nhạc | Nút bật/tắt; trạng thái bật/tắt được lưu theo cơ chế của `music.js` | `index.html`, `music.js` |

### Danh sách thời lượng chuẩn

`data/summoning.json` hiện quy định:

`[5, 10, 15, 30, 60, 120, 180, 240, 300, 600]` giây.

**Lưu ý đồng bộ:** native select ẩn trong `index.html` hiện chỉ khai báo 30, 60, 120, 180, 300 giây, trong khi dữ liệu pháp luân có đủ 10 mức. Khi sửa danh sách thời lượng, phải kiểm tra pháp luân, select dự phòng, nhãn hiển thị và giá trị được dùng lúc bắt đầu đua; không được mặc định rằng tất cả các giao diện đã tự đồng bộ.

## 2A. Nhịp cập nhật Tiên Bảng

- Trong khi đua, thứ tự hàng của Tiên Bảng được làm mới theo nhịp 1 giây, áp dụng đồng nhất cho tất cả thời lượng: 5, 10, 15, 30, 60, 120, 180, 240, 300 và 600 giây.
- Các thay đổi thứ hạng phát sinh giữa hai nhịp được gộp lại; lần cập nhật kế tiếp luôn dùng thứ tự mới nhất, không yêu cầu thứ tự phải ổn định.
- Thời gian về đích và mũi tên tăng/giảm hạng vẫn được đồng bộ riêng mỗi khung hình; việc giảm tần suất sắp xếp hàng không làm chậm các chỉ báo này.
- Khi tất cả tiên nhân về đích, bảng kết quả được chốt ngay, không chờ hết chu kỳ 1 giây.
- Đây là nhịp cập nhật giao diện, không thay đổi tốc độ mô phỏng, thời lượng cuộc đua hay tần suất phát sinh sự kiện.

## 3. Triệu hồi tiên nhân — `data/summoning.json`

Giá trị hiện tại:

| Khóa | Giá trị | Ý nghĩa |
|---|---:|---|
| `ritualDuration` | 5 | Thời lượng nghi thức (giây) |
| `maximumWaves` | 12 | Số đợt triệu hồi tối đa |
| `minimumBatchSize` | 1 | Số nhân vật tối thiểu mỗi đợt |
| `groupStep` | 0.3 | Khoảng cách thời gian giữa các đợt (giây) |
| `groupStartDelay` | 0.18 | Độ trễ bắt đầu nhóm (giây) |
| `revealDuration` | 0.42 | Thời gian hiện thân (giây) |
| `beamDuration` | 0.78 | Thời lượng cột sáng (giây) |
| `beamTailDuration` | 1.05 | Thời lượng đuôi cột sáng (giây) |
| `maximumRacers` | 100 | Giới hạn số tiên nhân |
| `formationCenter` | x=550, y=674 | Tâm đội hình trên Canvas 1100×825 |
| `durationOptions` | 5–600 giây, 10 mức | Các mức thời lượng |

Khi chỉnh hiệu ứng triệu hồi, phải giữ quan hệ hợp lý giữa số đợt, kích thước nhóm, thời gian hiện thân, cột sáng và thời điểm cho phép bắt đầu đua. Nút Dừng vẫn hoạt động trong toàn bộ giai đoạn nghi thức/hiện thân để hủy lượt triệu hồi; nút Chạy vẫn chờ đến khi toàn bộ tiên nhân hiện thân. Reset/triệu hồi lại phải dọn timer và trạng thái của lượt trước. Việc mở khóa sau khi hiện thân phải được kiểm tra cả bằng timer lẫn mốc thời gian trong vòng lặp animation; timer của lượt cũ không được phép tác động lên lượt mới.

## 4. Nhân vật — `data/characters.json`

### Bảng màu
- `racerPalette`: 10 cặp màu chính/tối dùng để phân biệt tiên nhân.
- `appearance.skinTones`: 5 tông màu da.
- `appearance.hairColors`: 6 màu tóc.

### Cấp bậc tạo hình

| Mã | Danh xưng | Tỷ lệ |
|---|---|---:|
| servant | Tạp dịch | 0.72 |
| outer | Ngoại môn | 0.80 |
| inner | Nội môn | 0.88 |
| core | Nòng cốt | 0.98 |
| disciple | Thân truyền | 1.08 |
| elder | Trưởng lão | 1.15 |
| master | Môn chủ | 1.38 |

Mỗi vai trò có màu áo, màu tối, đai lưng và hào quang riêng. Khi thêm/sửa vai trò phải giữ đủ các thuộc tính mà hàm vẽ đang sử dụng; không xóa mã vai trò đang được tham chiếu.

## 5. Phi kiếm — `data/swords.json`

- `racingPalettes`: 8 bộ màu phi kiếm, mỗi bộ gồm 4 màu.
- `shapeCount`: 8 hình dáng.
- `styleCount`: 12 phong cách.

Khi thay số lượng hình dáng/phong cách, phải kiểm tra chỉ số được chọn trong logic nhân vật và các hàm vẽ; không để chỉ số ngẫu nhiên vượt phạm vi cấu hình.

## 6. Sự kiện và cân bằng đua — `data/effects.json`

### Nhóm sự kiện hiện có
Gồm các hiệu ứng bất lợi và có lợi như Trúng độc, Suy lực, Hồi Linh Đan, Va chạm, Lôi kích, Cuồng phong, Choáng, Ngất, Du Long Bộ, Tụ Khí Đan, Kiếm ý, Đạp Vân, Tụ Linh Trận, Vạn Kiếm Trận, Bát Quái Trận, Kiếm Vũ, Phù tốc, Hộ Thân Phù, Lôi Phù, Phong Hành, Ảnh Độn, Kiếm Độn, Bạo Bộ và Lưu Vân Bộ.

Mỗi sự kiện có `type`, `name`, `color`, `polarity`. Không đổi `type` nếu chưa cập nhật toàn bộ code xử lý và code vẽ phụ thuộc vào type đó. Tên hiệu ứng chỉ dùng nội bộ để xử lý; thông báo trên sân đua và camera chỉ hiển thị thông tin tổng quát như tăng tốc/giảm tốc, không hiển thị tên hiệu ứng cụ thể. Khi vẽ nhân vật trong Thiên Lý Kính, `drawCamera()` phải loại `effectName` khỏi bản dữ liệu truyền vào `drawRacer()`; không chỉ dựa vào điều kiện kiểm tra context bên trong hàm vẽ.

### Giá trị cân bằng hiện tại

| Khóa | Giá trị |
|---|---|
| `positionGoodChance.front` | 0.42 |
| `positionGoodChance.middle` | 0.50 |
| `positionGoodChance.back` | 0.58 |
| `noEffectChance` | 0.05 |
| `tierWeights` | light 0.35, medium 0.40, strong 0.25 |
| `durationSeconds` | 2–5 giây |
| `waitSeconds` | 1–4 giây |
| `recoverySeconds` | 1–3 giây |
| `multiplierVariation` | 0.02 |
| `speedLimits` | min 0.75, max 1.25 |
| `sameEffect` | extend |
| `oppositeEffect` | replace |
| `oppositePolarity` | clear-and-apply |
| `antiBadLuck` | gentle-only |

Hệ số tốc độ:
- Tăng tốc: nhẹ 1.08–1.12; vừa 1.13–1.18; mạnh 1.19–1.25.
- Giảm tốc: nhẹ 0.90–0.95; vừa 0.82–0.89; mạnh 0.75–0.81.

### Hồ sơ theo thời lượng cuộc đua

| Thời lượng tối đa | Khoảng cách sự kiện | Độ trễ kích hoạt |
|---:|---:|---:|
| 5 giây | 0.35–0.65s | 0.15–0.35s |
| 10 giây | 0.45–0.80s | 0.20–0.45s |
| 15 giây | 0.60–1.00s | 0.25–0.55s |
| 30 giây | 0.80–1.40s | 0.40–0.80s |
| 60 giây | 1.20–2.00s | 0.60–1.20s |
| 120 giây | 1.50–2.80s | 0.80–1.80s |
| 300 giây | 2.00–3.50s | 1.00–2.50s |
| 600 giây | 2.50–4.00s | 1.00–4.00s |

Các khoảng trên là khoảng ngẫu nhiên, không phải giá trị cố định. Khi cân bằng hiệu ứng phải thử các thời lượng ngắn và dài, số lượng ít và nhiều; không làm một hiệu ứng khiến cuộc đua mất khả năng phân hạng.

### Hạt hiệu ứng
`particleBurst`: count 18; angleStep 0.3490658504 rad; speed 1.2–3.1; life 0.45–0.95 giây; size 2–4.

## 7. Nghi thức trao thưởng — `data/ceremony.json`

- Giai đoạn rời vị trí: `disperseEnd=2`, `seatEnd=3`, `standEnd=3.55`, `swordArrivalEnd=4.55`, `flightEnd=7.15`, `transitionEnd=7.7` (giây).
- Trao thưởng: `awardStart=8.05`, `masterFlightDuration=3.9`, `giftDropDuration=0.72` (giây).
- `topCount=3`: số vị trí nhận thưởng theo cấu hình hiện tại.

Không thay đổi mốc thời gian riêng lẻ nếu chưa kiểm tra toàn bộ chuỗi hoạt ảnh và camera mini; hai khung cảnh phải đồng bộ cùng mốc nghi thức.

## 8. Cảnh quan — `data/scenery.json`

Hiện cấu hình dữ liệu có nhóm `sky.gradient` (các điểm màu chuyển sắc) và `sky.sun` (tọa độ, bán kính, vùng vẽ và các điểm màu). Cảnh quan còn có nhiều thông số/hình vẽ được đặt trực tiếp trong `scenery.js`, `audience.js` và `visual-overrides.js`; JSON không phải toàn bộ nguồn cấu hình cảnh quan.

Khi chỉnh màu trời/mặt trời phải kiểm tra tương quan với núi, mây, sương, thác nước, sông, lầu các và ánh sáng nhân vật.

## 9. Thiết lập đang nằm trong code, chưa phải cấu hình JSON

Một số ví dụ đang được quyết định trong JavaScript hoặc HTML:
- Thời gian đích dự kiến ban đầu của mỗi tiên nhân: `duration × random(0.89, 0.995)` trong `assignFinishTimes()`.
- Dao động nhịp bay: biên độ ngẫu nhiên 0.018–0.042 và pha ngẫu nhiên; hàm cập nhật dùng dao động sin theo thời gian.
- Số đếm ngược bắt đầu đua: 3 giây trong `startRace()`.
- Thời gian hiệu ứng mũi tên đổi hạng: 3.5 giây trong logic đua.
- Một số kích thước Canvas, vị trí, tốc độ chuyển động, mật độ chi tiết, responsive và hiệu ứng hình ảnh được đặt trực tiếp trong JS/CSS.

Các thông số này chỉ là ghi nhận hiện trạng; không tự ý chỉnh khi yêu cầu chỉ liên quan đến một nhóm thiết lập khác. Nếu người dùng muốn một bảng điều khiển cấu hình tập trung, phải lập kế hoạch chuyển từng nhóm sang JSON có kiểm soát, đảm bảo giá trị cũ và hành vi cũ được giữ nguyên.


## 11. Responsive arena — giao diện theo viewport

- Màn hình ngang 600–999px (điện thoại xoay ngang và tablet nhỏ): Canvas trường đua, Thiên Lý Kính và Tiên Bảng hiển thị cùng một hàng ba cột; Canvas giữ tỷ lệ 4:3, hai bảng chiếm toàn bộ chiều cao còn lại.
- Thiên Lý Kính dùng phần diện tích riêng, khung hình nhân vật co giãn theo tỷ lệ 7:4 và không bị ép thành một dải quá nhỏ.
- Màn hình ngang từ 1000px trở lên: giữ bố cục ba cột; khi viewport rộng hoặc full-screen, giới hạn chiều rộng trang được nới và các thành phần bảng triệu hồi (pháp luân, chữ, ô nhập, nút) tăng theo kích thước màn hình.
- Màn hình dọc giữ cách xếp tầng hiện hành. Các bảng có danh sách dài cuộn bên trong thay vì làm tràn toàn bộ arena.
- Các kích thước được điều chỉnh theo cả chiều rộng và chiều cao viewport; không thay đổi tỷ lệ nội tại Canvas trường đua 4:3 hoặc Canvas Thiên Lý Kính 7:4.

## 10. Quy tắc khi thêm hoặc sửa thiết lập

1. Xác định thiết lập thuộc gameplay, triệu hồi, nhân vật, phi kiếm, hiệu ứng, nghi thức, cảnh quan hay giao diện.
2. Tìm nguồn thực thi đang hoạt động và mọi nơi đọc/hiển thị thiết lập đó.
3. Ưu tiên sửa đúng JSON đang làm nguồn dữ liệu; chỉ sửa code khi cần thay logic hoặc khi thông số hiện vẫn hard-code.
4. Đồng bộ các giá trị mặc định, min/max, danh sách lựa chọn, nhãn, aria attributes và giá trị fallback ở UI.
5. Kiểm tra giá trị biên, dữ liệu thiếu/sai kiểu, số lượng 2 và 100, thời lượng ngắn nhất/dài nhất.
6. Không đổi xác suất, tốc độ, giới hạn hoặc cân bằng gameplay ngoài yêu cầu được nêu.
7. Nếu thay đổi nguồn cấu hình, cập nhật tài liệu này trong cùng đợt sửa.
8. Không ghi một giá trị là “đang được áp dụng” nếu chưa xác nhận code thực sự đọc và sử dụng nó.

## 12. Bố cục responsive và thông báo cuộc đua

- Màn hình ngang từ 600px: bố cục ba cột cùng hàng gồm trường đua, Thiên Lý Kính, Tiên Bảng. Trên iPhone xoay ngang, ưu tiên Thiên Lý Kính đủ rộng để thấy rõ nhân vật; không để các quy tắc CSS cũ theo chiều cao viewport chuyển camera/bảng thành hàng dọc.
- Desktop sử dụng chiều rộng khả dụng đến giới hạn 2400px; chiều cao khung đua co giãn theo `100dvh`. Canvas chính giữ tỷ lệ 4:3; Thiên Lý Kính giữ tỷ lệ khung 7:4.
- Bảng triệu hồi tăng kích thước pháp luân, chữ, ô nhập và nút theo `vw`/`dvh`; màn hình ngắn tự giảm chi tiết phụ nhưng không làm camera thành thumbnail.
- Màn hình dọc giữ bố cục xếp tầng; Tiên Bảng cuộn nội dung bên trong.
- Banner trong cuộc đua chỉ thông báo người đang dẫn đầu khi người dẫn đầu thay đổi và thông báo thứ hạng/tên người về đích. Thông báo về đích được ưu tiên; sau khi hiển thị xong mới chuyển sang người dẫn đầu mới. Không phát banner cho dị tượng, trở ngại hoặc hiệu ứng tăng/giảm tốc. Hiệu ứng gameplay và hình ảnh vẫn hoạt động bình thường.
