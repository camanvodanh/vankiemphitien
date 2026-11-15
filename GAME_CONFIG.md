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

Mỗi sự kiện có `type`, `name`, `color`, `polarity`. Không đổi `type` nếu chưa cập nhật toàn bộ code xử lý và code vẽ phụ thuộc vào type đó. Tên hiệu ứng không dùng trong banner sự kiện, nhưng Thiên Lý Kính phải hiển thị đúng tên hiệu ứng hiện tại trong vùng thông tin. Khi vẽ nhân vật trong Thiên Lý Kính, `drawCamera()` loại `effectName` khỏi bản sao truyền vào `drawRacer()` để tên không bị vẽ đè lên nhân vật; đồng thời hiển thị `effectName` trực tiếp ở phần thông tin, không thêm tiền tố “Hiệu Ứng:”. Giữ nguyên bố cục camera; chỉ co chữ/ellipsis/xuống dòng khi cần chống tràn.

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
Cấu hình `particleBurst` gốc: count 18; angleStep 0.3490658504 rad; speed 1.2–3.1; life 0.45–0.95 giây; size 2–4. Khi kích hoạt cổng địa hình, hiệu ứng hình ảnh dùng cụm hạt thích ứng theo số tiên nhân (8 hạt dưới 40, 4 hạt từ 40–69, 2 hạt từ 70 trở lên) và ngân sách hạt toàn cục tối đa lần lượt 480 / 280 / 180. Hạt được cập nhật/lọc tại chỗ để tránh cấp phát mảng mỗi frame. Từ 36 tiên nhân, hoạt ảnh phụ quanh từng nhân vật chuyển sang dấu hiệu tối giản; chuyển động, thời gian hiệu ứng, hệ số tốc độ và tên hiệu ứng vẫn giữ nguyên.

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


### 11A. Tiên Bảng, Thiên Lý Kính và thanh điều khiển

- Tiên Bảng dùng ba cột cố định theo tỷ lệ linh hoạt Hạng/Tiên nhân/Thời gian; tên dài được rút gọn trong ô, thời gian `MM:SS:mmm` không tràn khỏi cột và không phát sinh cuộn ngang.
- Thiên Lý Kính giữ bố cục thông tin hiện hành, không ép chia hàng hoặc thêm nhãn mới. Hạng, tên nhân vật, tốc độ/thời gian và tên hiệu ứng chỉ co gọn hoặc tự xuống dòng khi cần chống tràn; tên hiệu ứng hiển thị trực tiếp.
- Trên màn hình ngang từ 600px, thanh Chạy/Dừng nằm ở hàng riêng dưới Canvas, hai nút cân đối quanh tâm và không phủ lên cảnh trao thưởng. Dock điều khiển không có nền đặc che cảnh.
- Khi bảng triệu hồi ở trạng thái thu nhỏ, chỉ hiển thị tiêu đề rút gọn và nút mở lại; pháp luân, ô nhập tên và thông báo phải được ẩn hoàn toàn.

## 12. Bố cục responsive và thông báo cuộc đua

- Màn hình ngang từ 600px: bố cục ba cột cùng hàng gồm trường đua, Thiên Lý Kính, Tiên Bảng. Trên iPhone xoay ngang, ưu tiên Thiên Lý Kính đủ rộng để thấy rõ nhân vật; không để các quy tắc CSS cũ theo chiều cao viewport chuyển camera/bảng thành hàng dọc.
- Desktop sử dụng chiều rộng khả dụng đến giới hạn 2400px; chiều cao khung đua co giãn theo `100dvh`. Canvas chính giữ tỷ lệ 4:3; Thiên Lý Kính giữ tỷ lệ khung 7:4.
- Bảng triệu hồi tăng kích thước pháp luân, chữ, ô nhập và nút theo `vw`/`dvh`; màn hình ngắn tự giảm chi tiết phụ nhưng không làm camera thành thumbnail.
- Màn hình dọc giữ bố cục xếp tầng; Tiên Bảng cuộn nội dung bên trong.
- Banner trong cuộc đua chỉ thông báo người đang dẫn đầu khi người dẫn đầu thay đổi và thông báo thứ hạng/tên người về đích. Các thông báo về đích được xếp hàng theo thứ tự về đích và hiển thị trọn vẹn; sau khi hết hàng mới chuyển sang người dẫn đầu mới. Không phát banner cho dị tượng, trở ngại hoặc hiệu ứng tăng/giảm tốc. Hiệu ứng gameplay và hình ảnh vẫn hoạt động bình thường.

## 13. Tinh chỉnh responsive Thiên Lý Kính, Tiên Bảng và nút điều khiển

- Giữ nguyên bố cục Thiên Lý Kính như trước khi tinh chỉnh tràn viền. Không thêm nhãn “Hiệu Ứng:” và không tự ý đổi vị trí thành phần; tên hiệu ứng hiển thị trực tiếp. Chỉ co chữ, ellipsis hoặc xuống dòng khi cần để nội dung nằm gọn trong khung.
- Tiên Bảng giữ ba cột Hạng / Tiên nhân / Thời gian. Cột thời gian phải đủ rộng cho chuỗi `MM:SS:mmm`; tên dài tự ellipsis trong cột riêng, không làm tràn bảng.
- Ở màn hình ngang, nút Chạy/Dừng có hàng riêng dưới Canvas trường đua, canh giữa theo cột game; nền container trong suốt. Hàng này bảo vệ vùng chữ TOP 1 trong hoạt cảnh trao thưởng.
- Bảng triệu hồi khi thu nhỏ chỉ giữ thanh tiêu đề và nút mở rộng; không để textarea, pháp luân hoặc thông báo còn lộ ra ở bất kỳ breakpoint nào.
- Các quy tắc trên áp dụng theo viewport ngang và dọc; không thay đổi gameplay, thời lượng đua, hiệu ứng hay thứ hạng.


## 14. Thiên phú và Photo Finish

- Mỗi tiên nhân thông thường nhận một trong 20 thiên phú luân phiên: Phong Linh Thể, Lôi Linh Thể, Kiếm Tâm, Ảnh Độn Thể, Huyền Quy Thể, Hỏa Linh Căn, Băng Tâm, Thanh Loan Huyết Mạch, Côn Bằng Chi Thể, Thiên Cơ Đạo Thể, Vô Ảnh Kiếm Cốt, Tử Điện Linh Thể, Nguyệt Ảnh Thể, Kim Cang Thể, Cửu Dương Thể, Hư Không Đạo Thể, Tinh Thần Linh Thể, Long Tượng Bá Thể, Thanh Mộc Linh Thể và Hàn Nguyệt Kiếm Thể. Thiên phú tạo chênh lệch nhỏ theo cấu hình hiện hành. **Thần Sầu là ngoại lệ:** không tham gia vòng thiên phú này và chỉ có thể chất duy nhất `Bún Chua Cay Thánh Thể`.
- Photo Finish được nhận diện khi hai lần về đích liên tiếp cách nhau không quá 120 ms; thông báo kết quả được xếp sau thông báo về đích, không thay đổi thời gian hoặc thứ hạng đã chốt.
- Không còn ba mốc sự kiện đường đua 24% / 53% / 78%; không kích hoạt tăng tốc, giảm tốc, hiệu ứng riêng hoặc cổng trang trí tại các mốc này. Các hiệu ứng ngẫu nhiên thông thường của từng tiên nhân vẫn giữ nguyên.

## 15. Hành trình bản đồ xuyên ngũ cảnh giới — `data/scenery.json`

- Cuộc đua vẫn là một đường liên tục; không chia lại lượt, không tăng `distance`, không thay đổi thời lượng hoặc công thức vận tốc nền. Bốn cổng có hiệu ứng riêng, có thể điều chỉnh hệ số vận tốc trong giới hạn cân bằng.
- Tiến độ cảnh quan lấy theo nhân vật đang đi xa nhất, chuẩn hóa từ 0 đến 1. Cảnh gốc hiện tại được giữ nguyên từ lúc bắt đầu đến khi đoàn đua vượt cổng đầu tiên ở 20%. Sau đó, các vùng tiếp theo lần lượt bắt đầu tại 20%, 40%, 60% và 80%; chỉ sau khi vượt qua cổng tương ứng mới bắt đầu crossfade sang cảnh mới. Vùng clip đến y=535 để xóa cả dòng linh thủy từ pháp bảo, nhưng giữ phần quảng trường/Chưởng Môn phía dưới.
  1. Tiên Môn Sơn Đạo — sơn cốc, vách núi ngọc và thác xa.
  2. Vân Hải Thiên Không — biển mây bốn tầng cuộn ngược chiều, thiên nhãn mây xoắn, tám đảo tiên nhiều cao độ, tiên các rải trên đảo, nhiều dải mây uốn lượn, bảy dòng thác mây và sương tiền cảnh.
  3. Vạn Kiếm Kiếm Vực — kiếm sơn dựng đứng, tối nền để làm nổi bật lưỡi kiếm dài; sáu chủng kiếm có dáng lưỡi/kiếm cách/chuôi riêng, cổ kiếm dài cắm dày trên sườn núi, linh kiếm bay ở nhiều cao độ, ba tầng kiếm trận phù văn, tia nối kiếm, tám trụ kiếm trấn trận và kiếm chủ ở tâm trận.
  4. Cửu Thiên Lôi Vực — bốn tầng siêu mây giông đen dày, khối mây bất quy tắc cuộn ngược, đáy mây xé tua, gió xoáy và mưa xiên; nhiều tia sét dài phân nhánh, chớp theo nhịp và chỉ lóe sáng cục bộ.
  5. Thiên Cung Tiên Đài — quần thể lục điện nhiều lớp phối cảnh, đại điện trung tâm ba tầng mái cong và đấu củng, thiên môn/cổng phụ, cột chạm rồng, sân bậc đá ngọc, cầu nối điện, hồ sen-vườn tùng và đèn cung; vàng cổ, ngọc xanh trầm, ánh sáng ấm tiết chế.
- Hiệu ứng cố định theo cổng: 20% Vân Hải Gia Trì (×1.035, 4s); 40% Kiếm Vực Khai Phong (×1.045, 4s); 60% Lôi Vực Thiên Phạt (×0.97, 4s); 80% Thiên Cung Tiên Quang (×1.05, 4.5s). Sau khi xóa hiệu ứng cũ, mỗi tiên nhân nhận hiệu ứng cổng và có 95% cơ hội nhận thêm hiệu ứng cá nhân tốt/xấu theo tỷ lệ vị trí trong `effects.json`; 5% không nhận hiệu ứng cá nhân. Hai hệ số được nhân rồi giới hạn trong `speedLimits`.
- Chỉ giữ bốn cổng chuyển cảnh ở 20%, 40%, 60% và 80%, tạo hình vết nứt không gian. Trong trạng thái chờ/triệu hồi và suốt đếm ngược 3 giây không hiển thị vết nứt; chỉ khi `started=true` (đếm ngược kết thúc, cuộc đua thực sự bắt đầu) mới hiển thị cổng kế tiếp. Luôn hiển thị cổng kế tiếp ngay sau khi cổng trước được vượt qua, kể cả khi còn cách xa; khi nhân vật chạm/vượt mốc cổng thì cổng đó biến mất ngay và cổng kế tiếp xuất hiện. Cổng cuối biến mất khi đã qua 80%. Khi vượt cổng, hiển thị rõ tên đầy đủ của cảnh giới mới bằng bảng tiêu đề nổi bật trong thời gian đầu của cảnh mới. Xóa hoàn toàn ba mốc sự kiện 24% / 53% / 78%, bao gồm hình ảnh, cấu hình và hiệu ứng tăng/giảm tốc của chúng.
- Chuyển cảnh chỉ bắt đầu sau khi vượt cổng; quá trình hòa trộn kéo dài 6% tiến độ tiếp theo. Các bảng màu cảnh giới và ánh nắng nền phải dịu, độ bão hòa/độ sáng tiết chế; crossfade dùng source-over với alpha bổ sung nhau, không cộng sáng additive gây lóa. Cảnh cũ được chụp lại trước khi phủ lớp cảnh giới; lớp trời/sơn mạch được xóa rồi hòa trộn trực tiếp giữa cảnh cũ và cảnh mới, không để nền ban đầu hiện xuyên qua các cảnh sau. Không hé lộ cảnh giới kế tiếp trước cổng.
- Thiên Lý Kính phải thay nền bằng đúng cảnh giới hiện tại, hòa trộn cùng mốc và alpha với Canvas chính; không chỉ phủ tint lên nền cũ.
- Khi từng tiên nhân vượt cổng, xóa hiệu ứng đang có và hiệu ứng đang chờ; áp dụng hiệu ứng riêng của cổng, sau đó có 95% cơ hội nhận thêm một hiệu ứng cá nhân tốt/xấu theo `positionGoodChance` (top 42%, giữa 50%, cuối 58%) và 5% không nhận hiệu ứng cá nhân. Hiệu ứng cá nhân dùng `tierWeights`, `multipliers`, giới hạn tốc độ và thời lượng chung trong `effects.json`; hệ số cổng và cá nhân được nhân với nhau rồi clamp theo giới hạn tốc độ.
- `journey-world.js` chỉ bổ sung lớp Canvas phía sau nhân vật; không tạo DOM, không thêm timer, listener hoặc vòng lặp animation riêng. Mỗi frame chỉ duyệt tối đa 100 tiên nhân để xác định tiến độ xa nhất và phát hiện cổng đã vượt.
- Không thêm hạt hiệu ứng theo từng tiên nhân; ngân sách hạt hiện tại được giữ nguyên. Cảnh quan dùng Canvas, chuyển động xác định theo thời gian render, không tạo timer/RAF/listener riêng; giới hạn số lớp mây, kiếm và tia sét để phù hợp tối đa 100 nhân vật.


## 15. Tinh chỉnh bố cục Vân Hải và Kiếm Vực

- Vân Hải bỏ các vòng xoắn/vòng elip đồng tâm. Thay bằng tầng mây ngang nhiều độ sâu, vân đài, cầu mây nối đảo, đảo tiên, lầu các và thác mây; chuyển động chậm, phân lớp rõ, không tạo họa tiết xoáy gây rối mắt.
- Kiếm Vực giữ sáu chủng kiếm nhưng phân bổ theo các cụm nhỏ và nhiều cao độ: khoảng 28 kiếm cổ ở tầng xa, 12 linh kiếm bay, 22 kiếm cắm theo sườn núi và 8 kiếm hộ vệ quanh kiếm chủ. Tỷ lệ vẽ từng lớp giảm để kiếm không quá lớn; kiếm chủ trung tâm cũng thu nhỏ để không lấn át toàn cảnh.
- Đây là mật độ và bố cục hình ảnh, không thay đổi gameplay, số tiên nhân, tốc độ, hiệu ứng hay thời lượng cuộc đua.


## 16. Hiển thị thể chất và tiêu đề cảnh giới

- Mỗi tiên nhân có một dấu ấn thể chất nhỏ trên Canvas chính, dùng mã hai ký tự và màu riêng theo ID để dễ nhận ra khi đang đua; dấu ấn chỉ là lớp hiển thị, không tác động chỉ số.
- Hai mươi mã dấu ấn theo thứ tự ID: PH (Phong Linh Thể), LD (Lôi Linh Thể), KT (Kiếm Tâm), AD (Ảnh Độn Thể), HQ (Huyền Quy Thể), HL (Hỏa Linh Căn), BT (Băng Tâm), TL (Thanh Loan Huyết Mạch), CB (Côn Bằng Chi Thể), TC (Thiên Cơ Đạo Thể), VA (Vô Ảnh Kiếm Cốt), TD (Tử Điện Linh Thể), NA (Nguyệt Ảnh Thể), KC (Kim Cang Thể), CD (Cửu Dương Thể), HK (Hư Không Đạo Thể), TT (Tinh Thần Linh Thể), LT (Long Tượng Bá Thể), TM (Thanh Mộc Linh Thể), HN (Hàn Nguyệt Kiếm Thể).
- Thiên Lý Kính hiển thị đầy đủ tên thể chất của nhân vật đang được chiếu trong dòng thông tin; nếu có hiệu ứng thì tiếp tục hiển thị tên hiệu ứng cùng dòng.
- Tiêu đề cảnh giới mới chuyển xuống vùng y=160 của Canvas; banner thông báo cuộc đua giữ vùng y=96. Hai vùng không được chồng lấn để tên cảnh giới luôn hiện đủ.
- Không thay đổi thiên phú, hệ số boost, xác suất hiệu ứng, thứ hạng hoặc thời lượng đua.


## 17. Bố cục thông tin Thiên Lý Kính

- Phần thông tin được chia thành các hàng: hạng và tên nhân vật ở hàng đầu; hệ số tốc độ cùng thời gian hiệu ứng ở hàng riêng; thể chất (chỉ tên, bỏ tiền tố “Thể chất:”) và tên hiệu ứng ở hàng phụ.
- Hạng ưu tiên canh trái, tên nhân vật canh giữa và tự ellipsis, tốc độ canh giữa; thông tin thể chất/hiệu ứng canh giữa và tự ellipsis khi quá dài.
- Canvas Thiên Lý Kính nằm ở đáy panel, chiếm phần không gian còn lại và giữ tỷ lệ khung 7:4.
- Hệ số tốc độ và số giây còn lại dùng cùng màu: xanh lá khi hệ số từ 1 trở lên, đỏ khi hệ số dưới 1. Đây chỉ là quy tắc màu hiển thị, không thay đổi hệ số gameplay.


## 18. Thiên Lý Kính — bố cục thông tin tinh gọn

- Hàng 1: Hạng canh trái, tốc độ và thời gian hiệu ứng canh phải trên cùng một hàng.
- Hàng 2: Tên nhân vật canh giữa, một dòng và tự ellipsis nếu dài.
- Hàng 3: Tên thể chất và tên hiệu ứng đặt cùng hàng, canh giữa, giữ khoảng cách tự nhiên; không dùng dấu chấm hoặc ký tự phân cách.
- Khung Canvas nhân vật nằm dưới toàn bộ phần thông tin, neo sát đáy panel và chiếm phần diện tích còn lại theo tỷ lệ 7:4.
- Dấu hiệu thể chất trên nhân vật chính đổi từ huy hiệu lớn sang chấm ngọc nhỏ cạnh pháp bảo; màu chấm vẫn phân biệt theo ID, không che mặt hoặc tên.
- Hệ số tốc độ và thời gian còn lại dùng cùng màu xanh lá khi tăng tốc, đỏ khi giảm tốc. Đây chỉ là quy tắc hiển thị, không thay đổi logic hiệu ứng hoặc gameplay.

## 19. Khung Thiên Lý Kính và vùng nhìn Tiên Bảng

- Vòng nét đứt quanh thân do lớp vẽ hiệu ứng cá nhân trong visual-overrides.js đã được loại bỏ; trạng thái hiệu ứng cá nhân, xác suất 95%/5%, hệ số và thời lượng vẫn giữ nguyên.
- Thiên Lý Kính giữ khung panel cố định, không cho phần chữ làm tăng tràn chiều cao hoặc chiều rộng. Thông tin hiển thị thành bốn dòng gọn: hạng/tốc độ; tên nhân vật; tên thể chất; tên hiệu ứng. Mỗi dòng tự ellipsis nếu quá dài; Canvas chiếm phần còn lại, giữ tỷ lệ 7:4.
- Tiên Bảng vẫn render đầy đủ danh sách; vùng cuộn dọc được tăng chiều cao để nhìn thấy khoảng 10 hạng trước khi cần kéo. Không thay đổi thứ tự, dữ liệu, nhịp cập nhật hoặc kết quả xếp hạng.

## 20. Căn giữa tên hiệu ứng Thiên Lý Kính

- Tên hiệu ứng nằm ở hàng riêng và được căn giữa độc lập trên toàn bộ chiều rộng vùng thông tin; không phụ thuộc vị trí/độ rộng tên thể chất. Khi thể chất trống, tên hiệu ứng vẫn chính giữa.
- Chỉ thay đổi căn chỉnh hiển thị; không thay đổi tên, trạng thái, xác suất, thời lượng hoặc hệ số hiệu ứng.


## 21. Quy ước thư mục sprite nhân vật

- Tài nguyên nhân vật đặt tại `assets/characters/<character-id>/`; ID dùng ASCII chữ thường và dấu gạch ngang, ví dụ `than-sau`.
- Mỗi nhân vật lưu sprite sheet `<character-id>-spritesheet.png`, frame PNG riêng tại `frames/<character-id>-00.png`, `-01.png`, ... và `README.md` ghi metadata.
- Bộ frame giữ cùng kích thước canvas và nền trong suốt; thứ tự mặc định trái sang phải, trên xuống dưới.
- Thư mục `assets/characters/than-sau/` dành cho Thần Sầu. Nhân vật chưa được bật trong gameplay cho đến khi các ảnh PNG thực tế được thêm vào repository và bộ nạp/render được tích hợp.


## 22. Nhân vật huyền thoại Thần Sầu

- ID nội bộ: `than-sau`; tên hiển thị: `Thần Sầu`; tài nguyên: `assets/characters/than-sau/than-sau-spritesheet.png`.
- Sprite sheet gồm 10 frame theo lưới 5 cột × 2 hàng, thứ tự trái sang phải rồi từ hàng trên xuống hàng dưới. Renderer dùng chung cho Canvas trường đua và Thiên Lý Kính; tốc độ hoạt ảnh khoảng 105 ms/frame, nội suy nearest-neighbor để giữ nét pixel.
- Nhập thủ công các tên `Shen`, `Sầu`, `Trần Đạt Thọ`, `Thần Sầu`, `神愁` đều quy về nhân vật `Thần Sầu`.
- Chỉ ở chế độ triệu hồi ngẫu nhiên: xác suất có một Thần Sầu trong lượt là `min(40%, 1.2% + 0.38% × số lượng triệu hồi)`. Ví dụ 10 nhân vật ≈ 5%, 50 ≈ 20.2%, 100 ≈ 39.2%. Tối đa một bản thể mỗi lượt; không cộng thêm nhân vật ngoài số lượng đã chọn.
- Thần Sầu giữ nguyên hệ thống tiến độ, tốc độ, hiệu ứng, thứ hạng và về đích của tiên nhân thường; chỉ thay hình ảnh bằng sprite animation. Nếu ảnh không tải được, renderer cũ được dùng làm dự phòng.


## 23. Thần Sầu — Bún Chua Cay Thánh Thể và tuyệt chiêu

- Thần Sầu không nhận bất kỳ thiên phú luân phiên nào khác. Giá trị `talent` của nhân vật luôn cố định `{ id: "bun-chua-cay", name: "Bún Chua Cay Thánh Thể" }`, kể cả sau các lớp wrapper tạo tiên nhân.

- Thể chất riêng: `Bún Chua Cay Thánh Thể`, hiển thị trong Thiên Lý Kính như thể chất của Thần Sầu.
- Tạo hình: sprite pixel Thần Sầu cầm tô bún chua cay trên tay; khi ăn, tô bún có hơi nóng/khói cay và điểm nhấn ớt.
- Tuyệt chiêu tự kích hoạt trong cuộc đua khi cooldown về 0 và Thần Sầu không đang chịu hiệu ứng khác: ăn bún, nhận tăng tốc ×1.20 trong 3.5 giây; cooldown 11.5 giây. Hệ số vẫn bị giới hạn bởi `effects.balance.speedLimits` hiện hành.
- Hiệu ứng hiển thị: `Bún Chua Cay`; hiệu ứng gameplay dùng loại boost tích cực, không sửa xác suất hay thông số hiệu ứng của các tiên nhân khác.


## 24. Kích thước panel phụ và tư thế Thần Sầu nhận thưởng

- Thiên Lý Kính và Tiên Bảng dùng chiều cao panel đồng bộ theo bố cục viewport, không phụ thuộc số lượng hàng trong bảng.
- Danh sách Tiên Bảng cuộn dọc bên trong vùng nội dung có chiều cao cố định; phần tiêu đề không cuộn. Thiên Lý Kính giữ khung camera riêng, không bị kéo nhỏ theo chiều dài danh sách.
- Trên landscape từ 600px, hai panel lấp đầy cùng hàng; trên portrait, hai panel dùng cùng chiều cao responsive. Không thay đổi số hàng, thứ tự hoặc dữ liệu xếp hạng.
- Trong cảnh trao thưởng, Thần Sầu dùng hoạt ảnh tay áo, cẳng tay và bàn tay ôm hộp thưởng trước ngực; lúc quà đang hạ xuống, hai tay chuyển động đón quà. Các nhân vật khác giữ nguyên hoạt ảnh nhận thưởng hiện tại.


## 25. Tên thể chất và hiệu ứng trong Thiên Lý Kính

- Thể chất của Thần Sầu hiển thị chính xác là Bún Chua Cay Thánh Thể; tên tuyệt chiêu/hiệu ứng vẫn là Bún Chua Cay.
- Dòng tên thể chất và dòng tên hiệu ứng đều căn giữa độc lập theo toàn bộ chiều rộng vùng thông tin.
- Khi chuỗi dài, renderer giao diện tự giảm cỡ chữ dựa trên độ rộng thực tế của dòng. Chỉ hiển thị ellipsis nếu chuỗi vẫn vượt quá chiều rộng sau khi đạt cỡ chữ tối thiểu.
- Không thay đổi tên nhân vật, gameplay, hệ số, thời lượng hoặc thứ tự hiển thị các hàng.


## 26. Hiệu ứng và bí danh tên Thần Sầu

- Sprite Thần Sầu phải có hoạt ảnh hành động theo effectType thay vì chỉ vẽ một vòng sáng mờ. Các nhóm hiệu ứng như tăng tốc/thân pháp, suy yếu/ngất, độc, va chạm, lôi kích, cuồng phong, choáng, linh đan, kiếm ý/kiếm trận, phù chú và tụ linh đều có dấu hiệu Canvas riêng dễ nhận biết.
- Khi có hiệu ứng, dáng bay của Thần Sầu thay đổi theo loại hiệu ứng; hiệu ứng hình ảnh được vẽ cả ở Canvas đường đua và Thiên Lý Kính. Thiên Lý Kính ưu tiên theo dõi Thần Sầu khi nhân vật này kích hoạt hiệu ứng.
- Tuyệt chiêu Bún Chua Cay tiếp tục giữ hệ số ×1.20, thời lượng 3.5 giây và cooldown 11.5 giây; khi kích hoạt, tô bún được nâng lên, khói cay và hạt ớt xuất hiện.
- Khi nhập tên thủ công, chỉ cần chuỗi sau chuẩn hóa có chứa sau (từ “Sầu”) hoặc shen là tên được quy về “Thần Sầu”, không phân biệt hoa thường và dấu. Các bí danh đầy đủ “Trần Đạt Thọ” và “神愁” vẫn được hỗ trợ.
- Không thay đổi xác suất hiệu ứng chung, hệ số tốc độ, thời lượng đua hoặc chỉ số các nhân vật khác.
