# GAME CONFIG — Quy chuẩn thiết lập và cân bằng game

> Tài liệu mô tả các thiết lập hiện có, giá trị mặc định, giới hạn và nguồn dữ liệu chuẩn của Vạn Kiếm Phi Tiên. Đây là tài liệu đối chiếu bắt buộc khi thêm/sửa thiết lập, cân bằng gameplay hoặc chỉnh giao diện điều khiển. Không tự ý coi các con số trong tài liệu là nguồn chạy của game: giá trị thực thi phải nằm ở đúng tệp cấu hình/code được ghi dưới đây.

## 1. Nguyên tắc nguồn dữ liệu

- Các tệp JSON trong thư mục `data/` là nguồn cấu hình dữ liệu cho các nhóm đã được code đọc từ `window.VKP_DATA`.
- `data-loader.js` hiện tải 6 tệp: `characters.json`, `swords.json`, `effects.json`, `summoning.json`, `ceremony.json`, `scenery.json`; chỉ sau khi tải thành công mới nạp các script game. Sau `i18n.js`, loader nạp thêm `tournament.js` để điều phối nghi thức Đại hội Tông Môn và lời bình giao diện.
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
- Mục `opening`: nghi thức khai mạc giao diện trước khi gọi `startRace()`; `stageDurationsMs=[2200,2500,2800]` là thời lượng ba hồi (ms), `featuredNames=6` là số đạo danh giới thiệu tối đa, `commentaryDurationMs=3400` là thời gian hiển thị lời bình (ms).

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
- Tiến độ cảnh quan lấy theo nhân vật đang đi xa nhất, chuẩn hóa từ 0 đến 1. Cảnh gốc hiện tại được giữ nguyên từ lúc bắt đầu đến khi đoàn đua vượt cổng đầu tiên ở 20%. Sau đó, các vùng tiếp theo lần lượt bắt đầu tại 20%, 40%, 60% và 80%; chỉ sau khi vượt qua cổng tương ứng mới bắt đầu crossfade sang cảnh mới. Vùng clip đến y=480 chỉ thay lớp trời/núi, bảo vệ toàn bộ linh quang/bảo vật Chưởng Môn và dòng sông phía dưới.
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
- Tên tuyệt chiêu/hiệu ứng hiển thị: `Ăn Bún Chua Cay`; hiệu ứng gameplay dùng loại boost tích cực, không sửa xác suất hay thông số hiệu ứng của các tiên nhân khác.


## 24. Kích thước panel phụ và tư thế Thần Sầu nhận thưởng

- Thiên Lý Kính và Tiên Bảng dùng chiều cao panel đồng bộ theo bố cục viewport, không phụ thuộc số lượng hàng trong bảng.
- Danh sách Tiên Bảng cuộn dọc bên trong vùng nội dung có chiều cao cố định; phần tiêu đề không cuộn. Thiên Lý Kính giữ khung camera riêng, không bị kéo nhỏ theo chiều dài danh sách.
- Trên landscape từ 600px, hai panel lấp đầy cùng hàng; trên portrait, hai panel dùng cùng chiều cao responsive. Không thay đổi số hàng, thứ tự hoặc dữ liệu xếp hạng.
- Trong cảnh trao thưởng, Thần Sầu dùng hoạt ảnh tay áo, cẳng tay và bàn tay ôm hộp thưởng trước ngực; lúc quà đang hạ xuống, hai tay chuyển động đón quà. Các nhân vật khác giữ nguyên hoạt ảnh nhận thưởng hiện tại.


## 25. Tên thể chất và hiệu ứng trong Thiên Lý Kính

- Thể chất của Thần Sầu hiển thị chính xác là Bún Chua Cay Thánh Thể; tên tuyệt chiêu/hiệu ứng là Ăn Bún Chua Cay.
- Dòng tên thể chất và dòng tên hiệu ứng đều căn giữa độc lập theo toàn bộ chiều rộng vùng thông tin.
- Khi chuỗi dài, renderer giao diện tự giảm cỡ chữ dựa trên độ rộng thực tế của dòng. Chỉ hiển thị ellipsis nếu chuỗi vẫn vượt quá chiều rộng sau khi đạt cỡ chữ tối thiểu.
- Không thay đổi tên nhân vật, gameplay, hệ số, thời lượng hoặc thứ tự hiển thị các hàng.


## 26. Hiệu ứng và bí danh tên Thần Sầu

- Sprite Thần Sầu phải có hoạt ảnh hành động theo effectType thay vì chỉ vẽ một vòng sáng mờ. Các nhóm hiệu ứng như tăng tốc/thân pháp, suy yếu/ngất, độc, va chạm, lôi kích, cuồng phong, choáng, linh đan, kiếm ý/kiếm trận, phù chú và tụ linh đều có dấu hiệu Canvas riêng dễ nhận biết.
- Khi có hiệu ứng, dáng bay của Thần Sầu thay đổi theo loại hiệu ứng; hiệu ứng hình ảnh được vẽ cả ở Canvas đường đua và Thiên Lý Kính. Thiên Lý Kính ưu tiên theo dõi Thần Sầu khi nhân vật này kích hoạt hiệu ứng.
- Tuyệt chiêu Ăn Bún Chua Cay tiếp tục giữ hệ số ×1.20, thời lượng 3.5 giây và cooldown 11.5 giây; khi kích hoạt, tô bún được nâng lên, khói cay và hạt ớt xuất hiện.
- Khi nhập tên thủ công, chỉ cần chuỗi sau chuẩn hóa có chứa sau (từ “Sầu”) hoặc shen là tên được quy về “Thần Sầu”, không phân biệt hoa thường và dấu. Các bí danh đầy đủ “Trần Đạt Thọ” và “神愁” vẫn được hỗ trợ.
- Không thay đổi xác suất hiệu ứng chung, hệ số tốc độ, thời lượng đua hoặc chỉ số các nhân vật khác.


## 27. Tay pixel gốc của Thần Sầu trong cảnh nhận thưởng
- Không dùng Canvas path/stroke/ellipse để dựng cánh tay, tay áo hoặc bàn tay của Thần Sầu trong animation nhận quà.
- Giữ nguyên tay theo frame pixel gốc từ sprite sheet 5×2; lớp thưởng chỉ vẽ hộp quà và ánh sao, không phủ tay giả lên nhân vật.

## 28. Vị trí bảng Triệu Hồi khi thu nhỏ

- Khi `.game-setup` có class `.is-minimized`, chỉ thanh tiêu đề còn hiển thị và phải nằm gọn trong vùng Canvas trường đua, không phủ Thiên Lý Kính hoặc Tiên Bảng.
- Landscape 600–999px: ghim thanh vào góc phải phía dưới của cột game, nhưng nằm phía trên hàng điều khiển Chạy/Dừng; không dùng phần trăm right tính theo toàn bộ arena nếu làm thanh trôi sang cột bên cạnh.
- Desktop landscape từ 1000px: ghim góc phải bên trong cột Canvas, phía trên hàng điều khiển.
- Portrait: ghim góc phải phía trên của vùng game. Khi đổi hướng hoặc breakpoint, phải áp dụng lại đủ inset để không kế thừa tọa độ cũ.
- Không thay đổi vị trí bảng khi đang mở rộng, nội dung triệu hồi hoặc logic gameplay.


## 29. Hoạt ảnh ăn Bún Chua Cay và nâng cấp đạo cụ

- Khi tuyệt chiêu kích hoạt, Thần Sầu thực hiện động tác đưa tô bún lên sát miệng, nghiêng tô và có dòng bún/nước dùng chảy vào miệng; chuyển động diễn ra trong pha ăn khoảng 0.9 giây đầu.
- Tô bún được vẽ nhiều lớp: tô sứ men ngà/đỏ son, chân đế, nước dùng đỏ cam, sợi bún, cà chua, thịt, rau thơm, ớt và hơi nóng/giọt dầu ớt.
- Hoạt ảnh và tô bún hiển thị đồng nhất trên Canvas chính và Thiên Lý Kính thông qua cùng renderer drawRacer.
- Chỉ thay đổi cách thể hiện; giữ nguyên gameplay ×1.20 trong 3.5 giây, cooldown 11.5 giây và các hiệu ứng chung.


## 30. Bố cục HUD, thông báo và font đa ngôn ngữ

- Hàng 1: đồng hồ đếm ngược ở giữa mép trên trong hộp riêng; hàng 2: thông báo sự kiện/kết thúc; hàng 3: bảng tên cảnh giới. Ba vùng không giao nhau và bảng tên cảnh giới kết thúc trước mép trên đường đua (TRACK.top).
- Cỡ chữ HUD tăng có giới hạn theo chiều rộng Canvas hiển thị để dễ đọc trên điện thoại; hộp thông báo và bảng cảnh giới co theo độ rộng chữ, không tràn khung.
- Canvas ưu tiên Arial/Noto Sans/PingFang SC fallback thay vì font serif dễ thiếu glyph; CSS giao diện dùng system-ui và fallback CJK. Không thay đổi nội dung/gameplay.
- Từ điển EN/CN bao gồm nhãn thời gian, thông báo sự kiện, tên cảnh giới, cổng và các hiệu ứng đua; bản gốc tiếng Việt giữ nguyên dấu. Bản vá i18n phải xử lý cả fillText và strokeText, đồng thời giữ nguyên font gốc sau mỗi lần vẽ.


## 31. An toàn renderer nhân vật và khôi phục Canvas

- Sprite pixel Thần Sầu luôn được vẽ thẳng đứng; các hiệu ứng như choáng, lôi, kiếm dash, Ảnh Độn và thân pháp vẫn thể hiện bằng dịch chuyển/nhịp chuyển động và lớp hiệu ứng riêng, không xoay toàn bộ sprite sheet.
- Mỗi tiên nhân trên Canvas chính có vùng trạng thái Canvas độc lập. Nếu một nhân vật phát sinh lỗi, bỏ qua phần vẽ lỗi của nhân vật đó và tiếp tục các nhân vật còn lại.
- Hàm render toàn cảnh luôn gọi restore() trong finally, tránh giữ lại transform/rotation/clip khi một lớp vẽ gặp lỗi. Thiên Lý Kính có cơ chế cô lập lỗi tương tự.
- Chỉ thay đổi độ an toàn và cách trình bày hình ảnh; không thay đổi dữ liệu cuộc đua, thứ hạng, tốc độ, xác suất hoặc thời lượng hiệu ứng.


## 32. Tách lớp Ăn Bún Chua Cay khỏi Du Long Bộ

- Nhánh boost của Thần Sầu chỉ vẽ Du Long Bộ khi hiệu ứng không mang tên “Ăn Bún Chua Cay”; tuyệt chiêu ăn bún không còn bị rồng phủ lên.
- Tô bún và dòng bún/nước dùng được đặt đúng điểm bắt đầu tại tô và hướng lên miệng; hơi nóng, viền linh khí đỏ cam và hạt ớt được vẽ sau lớp hiệu ứng chung để luôn nhìn rõ.
- Các lượt boost khác tiếp tục hiển thị Du Long Bộ như cũ. Không thay đổi tốc độ ×1.20, thời lượng 3.5 giây hoặc cooldown 11.5 giây.


## 33. Không để dòng linh thủy pháp bảo xuất hiện sai cảnh

- Đã bỏ lời gọi vẽ Long Tuyền Ngọc Hồ và dòng linh thủy của nó khỏi phong cảnh nền dùng chung, vì nền này được giữ bên dưới mọi cảnh giới khi chuyển cảnh.
- Sông, thác tự nhiên và chuyển động mặt nước vẫn được giữ nguyên. Không ảnh hưởng tiến độ, hiệu ứng hay tốc độ đua.


## 34. Nhận diện tuyệt chiêu Bún Chua Cay độc lập với tên hiệu ứng
- Renderer nhận diện hành động ăn bún bằng cờ nhân vật Thần Sầu và thanSauEatingTimer, không phụ thuộc so sánh chuỗi effectName.
- Mọi nhánh Du Long Bộ loại trừ nhân vật Thần Sầu để không thể biến tuyệt chiêu riêng thành hiệu ứng rồng khi tên hiệu ứng bị thay đổi/dịch.
- Tô bún, động tác đưa tô lên miệng, dòng bún/nước dùng và hơi nóng vẫn hiển thị trong thời gian ăn; hiệu ứng boost gameplay giữ nguyên ×1.20 trong 3.5 giây, cooldown 11.5 giây.

## 35. Nguồn nhạc mở đầu local

- Phase `setup` dùng file `assets/music/setup.mp3` (tên hiển thị: Tĩnh Tâm Tu Luyện).
- Phase `race` tiếp tục dùng `imperial-china-cinematic.mp3`; phase `award` tiếp tục dùng `the-victory-of-heroes.mp3` từ nguồn hiện tại.
- Chỉ đổi nguồn phát khi file tương ứng đã tồn tại trong repository. Giữ nguyên cơ chế unlock theo thao tác người dùng, loop, fade chuyển bài, nút bật/tắt và lưu lựa chọn.


## 36. Giai đoạn 2 — hoàn thiện bố cục tiên môn

- Quần thể kiến trúc nền có ba lớp: hàng hậu cảnh gồm Tụ Linh Tháp, Tàng Kinh Các, Lăng Tiêu Chính Điện, Tàng Bảo Các và Bách Thảo Các; hàng trung cảnh là các điện chuyên tu; hàng tiền cảnh là động phủ và các điện phụ.
- Lăng Tiêu Chính Điện có tỷ lệ lớn nhất; các lầu phụ được tăng kích thước vừa phải, giữ khoảng cách mái và biển hiệu để không chồng lấn.
- Vân mặt sông dùng chuyển động ngang chậm hơn bản trước (hệ số drift khoảng 0.0175 px/ms); giữ nguyên lòng sông, màu nước, đường bờ và các cơ chế cảnh giới.
- Đội hình khán đài và số lượng nhân vật giữ nguyên. Các cấp bậc được phân biệt bằng màu đạo bào, đai ngọc, phụ kiện và linh quang lấy từ `data/characters.json`; không phủ nhãn chữ lên nhân vật.
- Đây là thay đổi trình bày Canvas; không tác động tiến độ, tốc độ, thứ hạng, triệu hồi hoặc hiệu ứng đua.


## 37. Nút pháp trận Triệu Hồi thu nhỏ

- Khi `.game-setup.is-minimized`, ẩn chữ tiêu đề và chỉ giữ nút pháp trận tròn vẽ bằng SVG: vòng trận đồng tâm, phù văn và tâm linh lực.
- Kích thước nút dùng `clamp(38px, 5.2vmin, 54px)`, có vùng chạm, viền sáng và focus-visible; giảm/chặn animation khi người dùng bật reduced motion.
- Giữ nguyên các vị trí neo portrait/landscape/desktop tại REVISION 131 trong `style.css`; không đổi thuật toán responsive hoặc vị trí hiện hành.
- Khi nhấn pháp trận, dùng chính nút `.summon-seal-trigger` hiện tại để mở lại bảng; không thêm handler hoặc thay đổi logic triệu hồi.


## 38. Biểu tượng kiếm của nút Triệu Hồi thu nhỏ

- Khi bảng Triệu Hồi thu nhỏ, phần hình bên trong nút tròn là một thanh kiếm tiên dài theo trục dọc, nhìn rõ lưỡi kiếm, sống/rãnh sáng, hộ thủ, chuôi quấn và chóp chuôi.
- Kiếm dùng phối màu ngọc bích, bạc sáng và vàng cổ, có độ tương phản đủ để nhận biết ở kích thước 38–54px; không được rút ngắn thành biểu tượng hình thoi/ngôi sao.
- Nút tròn, kích thước co giãn, vị trí responsive, hiệu ứng focus và thao tác mở rộng bảng giữ nguyên. Chỉ thay hình SVG bên trong, không tác động gameplay.

 
## 39. Phân tách nút thu nhỏ và nút mở lại bảng Triệu Hồi

- Khi bảng đang mở, nút trên thanh tiêu đề chỉ hiển thị dấu “−” để thu nhỏ; không đặt hình kiếm lên nút này.
- Khi bảng thu nhỏ, ẩn panel và hiển thị nút trường kiếm riêng ở góc phải vùng game. Nút kiếm nằm ngoài panel, không trùng vị trí nút “−”, nhấn vào sẽ mở lại bảng.
- Nút kiếm dùng đúng neo responsive trong cột game: portrait góc phải phía trên; landscape điện thoại và desktop ở góc phải phía dưới nhưng nằm trên hàng điều khiển. Giữ nguyên kích thước co giãn và vùng chạm.
- Nút khai trận có id summon bên trong pháp luân vẫn giữ nguyên chức năng; không thay đổi gameplay.


## 40. Pháp trận trường kiếm mở lại bảng Triệu Hồi

- Nút thu nhỏ riêng hiển thị trường kiếm tiên nằm trong pháp trận triệu hồi nhiều lớp, gồm vòng trận, hình học phù văn, điểm linh lực và ánh sáng ngọc bích/vàng cổ.
- Nút được định vị theo góc phải-dưới của chính Canvas trường đua bằng kích thước/vị trí Canvas thực tế; không neo theo toàn bộ arena, không phủ sang Thiên Lý Kính, Tiên Bảng hoặc hàng điều khiển.
- Khi đổi kích thước viewport, xoay màn hình hoặc thay đổi kích thước Canvas, vị trí nút được cập nhật để luôn bám góc Canvas. Nhấn nút mở lại bảng Triệu Hồi.
- Dấu “−” trên tiêu đề và nút khai trận có id summon trong pháp luân không thay đổi; không tác động gameplay.


## 41. Trường kiếm trong tâm pháp luân và nút mở lại ở góc phải vùng game

- Khi bảng Triệu Hồi thu nhỏ, nút trường kiếm-pháp trận neo cố định tại góc phải-bên trong Canvas, sử dụng tọa độ layout thực tế của Canvas trong arena để không lệch sang Thiên Lý Kính/Tiên Bảng hoặc ra ngoài vùng game.
- Khi bảng Triệu Hồi mở, dùng cùng thiết kế trường kiếm-pháp trận cho nút khai trận ở chính tâm pháp luân bên trong bảng.
- Giữ nguyên vòng ngoài chọn số tiên nhân, vòng trong chọn thời lượng, hai ô hiển thị/chỉnh sửa thông số, thao tác kéo/xoay, nút xoay màn hình và logic triệu hồi. Chỉ thay SVG và diện mạo nút tâm.


## 42. HUD đếm ngược, nút Triệu Hồi và khoảng thoáng cổng đích

- HUD đếm ngược chỉ hiển thị giá trị thời gian; bỏ nhãn “THỜI GIAN”. Khung gọn 150×42 đơn vị Canvas, chữ căn giữa và co theo chiều rộng hiển thị.
- Khi bảng Triệu Hồi thu nhỏ, nút trường kiếm-pháp trận có kích thước 48 đơn vị Canvas, đặt ở góc phải-phía trên bên trong Canvas, cách mép trên 7 và mép phải 10 đơn vị; vị trí/kích thước được quy đổi theo Canvas và cập nhật khi resize/xoay màn hình. Nút lớn hơn nhẹ so với HUD 42 đơn vị nhưng không chạm khung đếm ngược hoặc vùng cổng đích.
- Bố cục kiến trúc giữ ba hàng xen kẽ và cân xứng qua x=550; không để mái/biển hiệu lọt vào vùng cổng đích gần x=964.

## 43. Bố cục xen kẽ lầu các và kích thước nút Triệu Hồi theo HUD

- Giữ ba hàng kiến trúc xen kẽ và cân xứng quanh trục x=550. Hàng hậu cảnh: các tâm x=250, 380, 550, 720, 850; hàng trung cảnh: x=220, 420, 680, 880; hàng tiền cảnh: x=250, 400, 550, 700, 850. Không đặt công trình hoặc biển hiệu vào vùng an toàn trước trụ cổng đích gần x=964. Tên công trình đặt gần sát đỉnh mái.
- Nút Triệu Hồi thu nhỏ dùng kích thước 48 đơn vị Canvas, quy đổi theo `canvasRect.height / canvas.height` (và tỷ lệ bố cục arena), cập nhật qua resize/ResizeObserver. CSS chỉ đọc biến `--summon-launcher-size`, không dùng kích thước CSS cố định.

## 44. Tiên Bảng cuộn toàn bộ thứ hạng và căn giữa tên hiệu ứng Thiên Lý Kính

- Hàm cập nhật Tiên Bảng giữ toàn bộ danh sách đã sắp xếp; không cắt dữ liệu ở Top 10. Khung nhìn hiển thị khoảng 10 vị trí đầu, phần còn lại cuộn dọc bên trong.
- Hai dòng thiên phú và hiệu ứng trong Thiên Lý Kính cùng nằm trên trục giữa; căn giữa cả phần tử lẫn nội dung chữ. Riêng `#leaderEffect` không có padding lệch, text-indent hoặc transform.

## 45. Chiều cao Tiên Bảng và Thiên Lý Kính

- Thiên Lý Kính và Tiên Bảng dùng cùng chiều cao panel trên mọi hướng màn hình: `clamp(320px, 36vw, 440px)`.
- Thiên Lý Kính co khung camera theo phần diện tích còn lại; Tiên Bảng cuộn nội bộ, ưu tiên thấy 10 hàng đầu và vẫn giữ toàn bộ thứ hạng phía sau.

## 46. Vị trí mặt trời và nhãn tên cảnh giới

- `data/scenery.json` đặt tâm mặt trời tại x=730, y=68, quầng bán kính 140 và vùng phủ `[545,-92,370,330]`. Trong `scenery.js`, các tia nắng phải lấy đúng tâm x/y này làm điểm xuất phát, không dùng tọa độ cũ cố định.
- `drawRealmArrivalTitle()` đặt tên cảnh giới tại tâm x=550, y=114 với bảng cao 28px, nằm dưới hàng thông báo (kết thúc ở y=97) và phía trên làn đua đầu tiên; không thay đổi vị trí HUD thời gian hay thông báo.


## 47. Footer và ký hiệu thu nhỏ/mở rộng panel

- Footer không hiển thị dòng chú thích nguồn nhạc; phần ghi nhận tác giả vẫn được giữ lại.
- Thiên Lý Kính và Tiên Bảng: panel mở dùng nút `−`; panel thu nhỏ dùng nút `+`. Nhấn nút chuyển trạng thái và ký hiệu ngay lập tức; khi mở lại phải trở về `−`. Đồng bộ thuộc tính trợ năng theo trạng thái thực tế.


## 48. Mở rộng chiều cao trường đua và thu gọn hai panel phụ

- Canvas chính dùng kích thước nội tại 1100×900 (tỷ lệ 11:9), thay cho 1100×825; CSS phải giữ tỷ lệ mới, không kéo méo hình.
- Đường đua có TRACK.bottom=570; vùng bay kết thúc tại TRACK.bottom−90=480, tăng chiều cao làn bay từ 280 lên 365 đơn vị và vẫn chừa khoảng cách với nhãn khán đài.
- Nút pháp trận Triệu Hồi thu nhỏ tăng từ 48 lên 52 đơn vị Canvas; neo theo Canvas, cách mép trên 7 và mép phải 12 đơn vị.
- Thiên Lý Kính và Tiên Bảng cùng cao 290px. Tiên Bảng có viewport 209px cho hàng tiêu đề + 10 hàng dữ liệu; các vị trí còn lại cuộn dọc bên trong, tên dài ellipsis trong cột tên.


## 49. Tiên Bảng tự co chiều cao, không có khoảng trống dưới hạng 10

- Bỏ chiều cao cố định 290px của Tiên Bảng.
- Panel tự co theo tiêu đề + số hàng đang hiển thị, tối đa 10 hàng.
- Vùng .table-wrap có giới hạn tối đa 209px; danh sách dài hơn 10 hàng cuộn bên trong.
- Không ép chiều cao tối thiểu cho table, thead, tbody; không để phần nền trống bên dưới hàng thứ 10.
- Thiên Lý Kính không bị kéo giãn theo chiều cao dư của Tiên Bảng.


## 50. Kích thước đồng bộ Thiên Lý Kính và Tiên Bảng; hiển thị tốc độ

- Thiên Lý Kính là chuẩn chiều cao responsive dùng biến `--side-panel-height`, giới hạn trong khoảng 280–390px theo chiều cao viewport (điện thoại nhỏ tối đa 360px).
- Tiên Bảng luôn dùng chính xác cùng chiều cao với Thiên Lý Kính; không tự co theo số hàng. Toàn bộ danh sách cuộn dọc bên trong phần nội dung, tiêu đề đứng yên.
- Khung Thiên Lý Kính chia vùng thông tin và canvas theo chiều cao còn lại; không ép canvas tràn hoặc làm méo tỷ lệ.
- Dòng Hạng luôn đi kèm hệ số tốc độ. Khi có hiệu ứng tăng/giảm tốc, hiển thị thêm thời gian còn lại dạng giây với một chữ số thập phân. Hệ số và thời gian cùng màu: tăng tốc xanh lá, giảm tốc đỏ; bình thường màu trung tính.


## 51. Sửa chồng hình chưởng môn trong nghi thức kết thúc

- Trong toàn bộ giai đoạn giải tán/đứng dậy/kiếm tiếp cận, lớp khán đài ẩn chưởng môn nền; `drawPodiumScene()` là nguồn duy nhất vẽ chưởng môn nghi thức.
- Khi kiếm tiếp cận, chỉ vẽ chưởng môn đứng cùng kiếm đang bay tới. Tại ngưỡng p=0.86, chuyển một lần sang chưởng môn ngự kiếm; không crossfade hai sprite nên không có hai ảnh đè nhau.
- Khi đã chuyển sang ngự kiếm, không vẽ kiếm tiếp cận độc lập; `drawAwardMaster()` tự vẽ phi kiếm và một Thái Cực Ngọc Luân. Không thay đổi các mốc thời gian nghi thức hoặc bố cục vinh danh TOP 3.


## 52. Căn hàng thông tin và khung màn hình Thiên Lý Kính

- Hàng đầu của HUD: Hạng nằm bên trái; hệ số tốc độ và thời gian hiệu ứng (nếu có) nằm bên phải, cùng một hàng.
- Vùng Canvas phải lấp đầy khung màn hình bên trong panel; khung có viền khép kín sát vùng hình, không có khoảng trống dọc trên/dưới.
- Không thay đổi kích thước nội tại 420×240, cách chọn tiên nhân, hệ số tốc độ hoặc thời lượng hiệu ứng.


## 53. Cleanup mã nguồn — giai đoạn 1
- Đã loại bỏ các helper không có lời gọi trong mã nguồn hiện hành: `drawWaterfallMountain()`, `drawNearBankTerraces()`, `drawWaterfallMouth()`, `drawMountainSpringArtifact()` và `drawSwordLandmark()`.
- Đã loại bỏ khối cache IndexedDB khán đài REVISION 118 cùng biến/hàm liên quan vì không có điểm gọi tải/lưu cache; renderer `drawCrowd()` hiện hành không bị thay đổi.
- Không gộp các hàm trùng tên trong giai đoạn này; các wrapper và các bản khai báo cuối đang hoạt động được giữ nguyên.
- Đây là cleanup cấu trúc, không thay đổi bố cục Canvas, dữ liệu, thứ hạng, tốc độ, thời lượng hoặc xác suất gameplay.


## 54. Dọn phong cảnh cũ — giai đoạn 2
- `visual-overrides.js` giữ một bản renderer phong cảnh cuối cùng. Đã xóa các bản `drawScenery()` cũ và các bản bị ghi đè của `drawRiver()`, `drawMountainRange()`, `drawSpiritBirds()`, `drawDenseForest()`, `drawAmbientEnergy()`, `drawRiverCurrent()` và `drawSectArchitecture()`.
- Đã xóa các lớp cảnh cũ không còn nằm trong cảnh hiện hành: thác nước, dòng thác liên kết, suối núi, vách thác, cụm núi-thác đôi, pháp bảo linh tuyền cũ và các bản vẽ cung điện nền cũ.
- `scenery.js` giữ các thành phần nền còn được cảnh hiện hành dùng: `initStars()`, `drawSky()`, `drawCloud()`, `drawMovingClouds()` và `drawPine()`; `drawTree()` đã được loại bỏ ở giai đoạn 4E vì không còn điểm gọi.
- Đã xóa `drawScenery()` cũ trong `race-render.js`; lời gọi render vẫn dùng `drawScenery()` cuối cùng trong `visual-overrides.js`.
- Giữ nguyên các hàm vẽ hiện hành và kiến trúc tiên môn, rừng cây, sông, khán giả, nghi thức trao thưởng; không thay đổi dữ liệu hoặc thông số gameplay.


## 55. Hợp nhất renderer khán đài — giai đoạn 4A
- Chỉ còn một `drawCrowd()` cuối cùng trong `visual-overrides.js`, một `drawSpectator()` cuối cùng trong `visual-overrides.js` và một wrapper `drawFormalSpectator()` cuối cùng.
- Renderer khán đài giữ nguyên các tầng tạp dịch, ngoại môn, nội môn, nòng cốt, chân truyền đệ tử, trưởng lão và chưởng môn; không thay đổi bố cục, số lượng hay hiệu ứng.
- `audience.js` tiếp tục cung cấp các helper còn được dùng; cache version `audience.js` và `visual-overrides.js` được tăng sau khi hợp nhất.


## 56. Renderer nhân vật, HUD và nghi thức trao thưởng — giai đoạn 4B
- Renderer đang hoạt động nằm ở các khai báo cuối trong `visual-overrides.js`; các khai báo cũ bị ghi đè đã được loại bỏ.
- `drawRacer()` vẫn chuyển sang `__drawRacerBaseThanSau()` nếu sprite sheet Thần Sầu chưa tải xong/không hợp lệ hoặc racer không phải nhân vật Thần Sầu. Không xóa hàm dự phòng này.
- Nghi thức TOP 3 vẫn sử dụng cùng các giai đoạn và helper: `drawAwardPlazaBackdropV2()`, `drawCeremonyBackdrop()`, `drawCeremonySeatedMaster()`, `drawStandingSectMaster()`, `drawAwardMaster()`, `drawGrandAwardPedestalV2()`, `drawCeremonyRankGift()`, `drawThanSauGiftReach()`, `drawThanSauGiftReception()` và `drawRecipientCelebrationGiftV2()`.
- `drawRaceHud()` cuối cùng hiển thị đồng hồ còn lại; `drawAnnouncement()` cuối cùng hiển thị thông báo sự kiện/kết thúc. Không khôi phục các bản HUD cũ đã bị ghi đè.
- Không thay đổi thông số hoặc hình ảnh của các renderer cuối cùng; đây là cleanup khai báo trùng.


## 57. Điều khiển cuộc đua và trạng thái — giai đoạn 4C
- `updateRace()` là vòng cập nhật duy nhất; xử lý hiệu ứng, dao động tốc độ, vượt hạng, thời điểm cắt đích và gọi `finishRace()` khi toàn bộ racer hoàn tất hoặc chạm giới hạn thời lượng.
- Các hàm điều khiển chỉ giữ bản cuối cùng: `summon()`, `startRace()`, `togglePause()`, `resumeRace()`, `finishRace()`, `resetGame()`, `stopRace()`, `setSettingsLocked()`, `syncButtons()` và `leaderOf()`.
- `finishRace()` cuối cùng chuyển nhạc sang pha trao thưởng, đặt `ceremonyStartedAt`, chốt trạng thái racer, khóa hiệu ứng thi đấu, cập nhật Tiên Bảng và mở nghi thức TOP 3. Không thay thế bằng bản `finishRace()` cũ không có nghi thức.
- Giữ các bộ hẹn giờ/chu kỳ triệu hồi, `completeSummonReveal()`, `summonCycleId`, hàng đợi thông báo và wrapper renderer lưu bản gốc để không làm mất hiệu ứng hiện thân hoặc pose khán đài.
- Thứ tự loader vẫn là `race-logic.js` trước `journey-world.js`; không đổi cách chuyển cảnh theo tiến độ.


## 58. Wrapper render, camera Thiên Lý Kính và IIFE — giai đoạn 4D
- Renderer nền camera cũ trong `race-render.js` đã bị bản `drawCameraBackground()` ở `visual-overrides.js` thay thế trước khi game bắt đầu; đã xóa phần khai báo thừa. Camera đang chạy vẫn dùng nền tiên môn hiện hành và lớp cảnh giới từ `journey-world.js`.
- Thứ tự wrapper được giữ: nền camera hiện hành → wrapper `drawCameraBackground()` của `journey-world.js` → `drawCamera()` vẽ người dẫn đầu và thông tin hạng. Không đổi kích thước canvas camera, tỷ lệ nhân vật, tên hoặc thuật toán chọn người dẫn đầu.
- `render()` được `journey-world.js` bọc đúng một lần để cập nhật tiến độ cảnh giới trước renderer gốc. `drawScenery()` chụp nền gốc rồi hòa trộn cảnh chính; `drawTrackLines()` bổ sung cổng không gian; camera dùng cùng tiến độ để hiển thị tiểu cảnh đồng bộ.
- Các wrapper cổng giới trong `createRacer()`, `startRace()` và `updateRace()` vẫn gọi hàm gốc trước khi áp dụng/reset mặt nạ cổng; mỗi racer chỉ nhận hiệu ứng một lần tại mỗi cổng. IIFE giao diện/gesture đang hoạt động được giữ nguyên. Hai IIFE xoay màn hình cũ đã được loại bỏ vì các nút `rotateView`, `rotateScreen`, `rotateHint` không tồn tại trong `index.html`, nên chúng không khởi tạo được chức năng nào.
- Đây là cleanup renderer bị thay thế; không thay đổi phong cảnh, crossfade, cổng, tốc độ, thứ hạng, thời lượng, hiệu ứng hoặc gameplay. Cache `race-render.js` tăng lên `v184`.


## 59. Helper tiện ích, particle và trạng thái không dùng — giai đoạn 4E
- Loại bỏ helper không có điểm gọi trong renderer hiện hành: `drawTree()`, `drawEnergyRings()`, `drawAudiencePlatform()`, `drawDiscipleSeats()`, `drawElderSeats()`, `drawMasterThrone()`, `drawTempleAuras()`, `drawGiftBox()`, `drawPlazaGate()`.
- Loại bỏ trạng thái/dữ liệu không được sử dụng: `waterLines`, `eventMessages`, `miniAwardStart`, `miniMasterFlightDuration`, `masterGiftX`, `returnStart`.
- Particle vẫn giữ nguyên ngân sách thích ứng theo số racer, tạo hạt, cập nhật tại chỗ và vẽ alpha theo vòng đời. Các hiệu ứng linh khí/khán đài và helper nghi thức đang có điểm gọi không bị thay đổi.
- Giữ `discipleCrowdLayout` vì IIFE khởi tạo có tiêu thụ `Math.random()` khi nạp script; loại bỏ sẽ thay đổi chuỗi ngẫu nhiên dùng để tạo sao/mây và các thành phần khởi tạo tiếp theo. Đây là dữ liệu không được đọc nhưng có side effect, nên chưa xóa trong cleanup bảo toàn hành vi.
- Tăng cache version cho các JavaScript đã sửa; không thay đổi thông số gameplay hoặc cách vẽ các renderer đang hoạt động.


## 60. Cấu hình JSON và nguồn mặc định — giai đoạn 4F
- Sáu tệp JSON đang được nạp trước JavaScript: `characters.json`, `swords.json`, `effects.json`, `summoning.json`, `ceremony.json`, `scenery.json`.
- `data/swords.json.shapeCount=8` điều khiển số hình kiếm trong `drawRacingArtifact()`; `styleCount` đã bỏ vì không có nơi sử dụng.
- `data/ceremony.json.awards.topCount=3` điều khiển số tiên nhân được chọn vào nghi thức. Renderer vẫn thiết kế tối đa ba vị trí.
- Các trường chính sách hiệu ứng không có consumer đã được bỏ khỏi `effects.json`; logic hiện hành trong `race-render.js` vẫn giữ nguyên.
- Danh sách thời lượng triệu hồi chỉ lấy từ `summoning.durationOptions`; hai select dùng chung một mảng đã chuẩn hóa.
- `journey-world.js` đọc trực tiếp các giá trị cân bằng hiệu ứng từ `effects.json`, không lặp lại các giá trị mặc định giống hệt trong JavaScript.
- Mọi giá trị JSON còn lại đều có đường đọc đã xác định; không xóa trường được truy cập động hoặc qua destructuring.


## 61. Tài nguyên tĩnh và tải lười — giai đoạn 4G
- Sprite sheet `assets/characters/than-sau/than-sau-spritesheet.png` là tài nguyên đang hoạt động (5 cột × 2 hàng, 10 frame). Renderer chỉ tải ảnh khi gặp nhân vật Thần Sầu; trong lúc chờ ảnh, dùng renderer dự phòng hiện tại.
- Nhạc mở đầu `assets/music/setup.mp3` là tài nguyên đang hoạt động. `music.js` tạo Audio sau tương tác người dùng; nhạc đua và vinh danh vẫn dùng URL ngoài. Không xóa hoặc đổi nguồn nhạc.
- Bản `script.js` cũ không được trang hoặc loader tham chiếu nên đã loại khỏi repository. Đây không phải script runtime hiện tại; game chạy qua `data-loader.js` và 9 script theo thứ tự đã cấu hình.
- Không xóa placeholder `assets/characters/than-sau/frames/.gitkeep`; thư mục này dành cho frame PNG độc lập bổ sung trong tương lai.
- Không thay đổi nội dung hình ảnh, kích thước canvas, frame timing, hiệu ứng hoặc chất lượng âm thanh trong giai đoạn này.


## 62. Tỷ lệ Thiên Lý Kính và tên cảnh trong thông báo
- `#leaderCanvas` có kích thước nội tại 420×240; `.camera-screen` và canvas phải giữ tỷ lệ 7:4. Khung camera không kéo giãn canvas theo chiều cao panel, không dùng flex-grow để ép chiều cao và không dùng `object-fit:fill`.
- Tên cảnh giới không còn được ghép vào mọi thông báo; chỉ thông báo riêng lúc nhân vật đầu tiên vượt khe nứt mới hiển thị tên cảnh đích lấy từ `data/scenery.json`.


## 63. Cố định khung Thiên Lý Kính theo tỷ lệ gốc
- Panel Thiên Lý Kính tự co theo nội dung thực tế thay vì dùng chung chiều cao cố định với Tiên Bảng.
- Canvas 420×240 và vùng hiển thị giữ tỷ lệ 7:4; không kéo dãn theo chiều cao panel và không tạo khoảng trống dư phía dưới.
- Tên cảnh giới được ghép vào đầu thông báo sự kiện/kết thúc thông qua window.__vkGetCurrentRealmName(); nguồn tên và mốc chuyển cảnh vẫn là data/scenery.json.


## 64. Đồng bộ chiều cao Tiên Bảng và thông báo chuyển cảnh
- Tiên Bảng dùng chiều cao hàng grid do Thiên Lý Kính xác định; danh sách tối đa 10 hàng hiển thị trong panel, các hạng sau cuộn nội bộ.
- Chiều cao Tiên Bảng không được làm tăng chiều cao arena hoặc kéo giãn Canvas Thiên Lý Kính.
- `journey-world.js` phát thông báo tên cảnh đúng một lần ở mỗi portal, khi nhân vật đầu tiên vượt qua. Hiệu ứng cổng vẫn áp dụng riêng cho từng nhân vật.
- `drawAnnouncement()` không tự thêm tiền tố cảnh giới vào các thông báo sự kiện/kết thúc khác.

- `journey-world.js` dùng `ResizeObserver` để cập nhật chiều cao Tiên Bảng theo đúng chiều cao thực tế của Thiên Lý Kính; danh sách xếp hạng không điều khiển chiều cao panel.


## 65. Tiên Bảng làm chuẩn chiều cao, Thiên Lý Kính căn giữa
- Tiên Bảng có vùng hiển thị cố định đủ hàng tiêu đề và 10 vị trí đầu; hạng 11 trở đi cuộn trong `.table-wrap`. Vùng này luôn giữ chiều cao dành cho 10 vị trí, không co theo số lượng người tham gia.
- Chiều cao tổng thể Tiên Bảng là nguồn chuẩn. `journey-world.js` quan sát panel này bằng `ResizeObserver` và đồng bộ chiều cao Thiên Lý Kính theo đúng kích thước thực tế.
- Nội dung Thiên Lý Kính (tiêu đề, thông tin và canvas) căn giữa theo chiều dọc; Canvas vẫn giữ tỷ lệ 7:4 và không bị kéo méo.


## 66. Vùng nhìn 10 hạng của Tiên Bảng
- `.table-wrap` cố định 242px, bằng 11 hàng × 22px (gồm hàng tiêu đề cột và 10 vị trí đầu).
- Các hàng tiêu đề và dữ liệu đều khóa 22px theo border-box để không bị co thấp hoặc nở ngoài dự tính. Hạng 11 trở đi cuộn bên trong.
- ResizeObserver tiếp tục lấy chiều cao thực tế Tiên Bảng để đồng bộ Thiên Lý Kính.


## 67. Tên đầy đủ cảnh giới và đồng bộ khung Thiên Lý Kính
- Thông báo vượt khe nứt lấy `name` đầy đủ của cảnh đích trong `data/scenery.json`, không dùng `shortName` nếu đã có tên đầy đủ và không thêm tiền tố “BƯỚC VÀO”.
- Bộ đồng bộ chiều cao được khởi tạo đúng trong cả hai trạng thái DOM đang tải và đã tải; ResizeObserver đặt chiều cao border-box Thiên Lý Kính bằng Tiên Bảng.
- Nội dung camera căn giữa theo chiều dọc, thông tin có thể xuống dòng an toàn, canvas không đổi tỷ lệ 7:4. Padding/viền hai panel được chuẩn hóa để không có phần tử con thò khỏi khung hoặc khoảng đệm lệch.


## 68. Bố cục hàng thứ hạng và tốc độ của Thiên Lý Kính
- `.camera-top-info` hiển thị Hạng trước, theo sau bởi khoảng cách nhỏ và cụm tốc độ + thời gian.
- `#leaderProgress` không có viền, nền, bo góc hoặc shadow. Hàng thông tin căn giữa nguyên cụm; không dùng `space-between` đẩy hai phía ra xa.
- Kích thước chữ co giãn theo viewport, giữ một dòng và giới hạn chiều rộng để tránh tràn khung.

## 69. Cố định tiêu đề Thiên Lý Kính / Tiên Bảng và loại tên cảnh giới trùng
- Hai hàng tiêu đề panel có cùng chiều cao 34px, được căn giữa theo chiều dọc và cố định ở đầu panel. Thiên Lý Kính không dùng căn giữa toàn bộ cột làm tiêu đề lệch hàng với Tiên Bảng.
- Phần danh sách Tiên Bảng cuộn riêng trong `.table-wrap`, không cuộn hàng tiêu đề panel.
- Khi vượt cổng, tên cảnh giới chỉ xuất hiện trong thông báo sự kiện. Không gọi renderer banner tên cảnh giới riêng trên Canvas để tránh hiển thị lặp bên dưới thông báo.

## 70. Nút triệu hồi và nhãn kiến trúc/cấp bậc
- Nút Triệu Hồi dạng thu nhỏ đồng cỡ nút Chạy/Dừng theo breakpoint: 44px mặc định, 40–48px trên desktop ngang lớn và 26px ở màn hình ngang rất thấp.
- `drawRoleLabel()` tăng font cơ sở từ `12 * scale` lên `15 * scale` (tối thiểu 12px), giúp Chưởng Môn, Chân Truyền Đệ Tử và Trưởng Lão dễ đọc hơn.
- `drawSectArchitecture()` tăng nhãn công trình thường lên 12.5px và Lăng Tiêu Chính Điện lên 15px; không thay đổi vị trí các công trình.

## 71. Kích thước nút Triệu Hồi và font nhãn cảnh quan
- Nút chính ở tâm pháp luân tăng lên 68px, biểu tượng 54px; breakpoint mobile ≤600px là 62px/50px và ≤380px là 58px/46px. Các override cuối stylesheet khóa kích thước để không bị quy tắc mobile cũ ghi đè.
- Nút mở lại bảng khi thu nhỏ tăng lên 60px, mobile ≤600px là 56px.
- `drawRoleLabel()` tăng font lên `Math.max(15,18*scale)`; nhãn công trình thường tăng lên 15.5px, công trình trung tâm 18.5px và tăng giới hạn chiều rộng vẽ.

## 72. Chữ biển hiệu và kích thước nút Triệu Hồi
- Biển hiệu kiến trúc chỉ dùng chữ sáng, không còn lớp viền tối dày tạo cảm giác đổ bóng; tắt shadow kế thừa trước khi vẽ.
- Nút tâm pháp luân dùng 48px desktop, 44px mobile và 40px màn hình rất hẹp; biểu tượng lần lượt 42px, 38px và 34px. Nút có z-index cao trong pháp luân, còn bảng thiết lập vẫn ở trên Canvas.
- Nút mở lại khi thu nhỏ dùng 44px desktop, 42px mobile, 40px ở màn hình rất hẹp và z-index cao để không bị cổng đích che.

## 73. Biển hiệu không viền đen và nút Triệu Hồi không chồng cổng
- Chữ biển hiệu Giảng Đạo Các bỏ nét stroke tối; các nhãn công trình reset đầy đủ trạng thái bóng/lọc Canvas để tránh chữ đen lặp phía sau.
- Nút triệu hồi ở tâm pháp luân được định vị tuyệt đối chính giữa, kích thước 44px desktop, 40px mobile, 38px màn hình rất hẹp.
- Nút mở lại khi thu nhỏ chuyển từ góc phải sang góc trái-trên của Canvas để không đè lên cổng về đích ở mép phải; tọa độ luôn giới hạn trong vùng arena. Kích thước 42/40/38px theo breakpoint.


## 74. Chữ nhãn một lớp và điều khiển triệu hồi gọn
- `drawRoleLabel()` và nhãn công trình không còn vẽ nét viền chữ tối; chỉ vẽ một lớp fillText sáng.
- Nút Triệu Hồi: 36px mặc định, 34px mobile, 32px màn hình ≤380px; SVG lần lượt 31/29/27px.
- Nút mở lại bảng: 36/34/32px theo cùng breakpoint, giữ vị trí trái-trên Canvas từ logic hiện hành.

## 75. Viền tương phản cho nhãn kiến trúc và cấp bậc
- Tên các lầu các và điện dùng viền ngoài xanh đen đậm, viền trong vàng nhạt mảnh, rồi tô chữ màu sáng để dễ đọc trên nền có màu tương đồng hoặc nền sáng.
- Nhãn Chưởng Môn, Chân Truyền Đệ Tử và Trưởng Lão dùng cùng kiểu viền, độ dày điều chỉnh theo tỷ lệ chữ.
- Các nét viền vẽ đồng tâm, không đổ bóng hoặc dịch lệch nên không tạo bóng chữ đen phía sau.
- Cache visual-overrides.js: v214.
- Tăng rõ độ dày viền chữ: tên lầu các 5.8px, chính điện 7px; viền trong vàng 2–2.5px. Nhãn cấp bậc có viền ngoài tối tối thiểu 5px và viền trong vàng tối thiểu 1.8px. Cache visual-overrides.js v215.

## 76. Bảng tên nền tối cho lầu các và cấp bậc
- Tên công trình có bảng nền xanh mực bán đục, bo góc, viền vàng kép và chữ sáng có viền tương phản.
- Chưởng Môn, Chân Truyền Đệ Tử và Trưởng Lão cũng dùng bảng tên nền tối riêng để luôn đọc được trên nền mây/núi sáng.
- Cache visual-overrides.js: v216.

## 77. Nhãn chữ viền nhiều lớp, không có bảng nền
- Tên lầu các và chức danh dùng chữ trực tiếp trên cảnh, không có nền hộp/bo góc.
- Viền ba lớp đồng tâm: xanh đen ngoài, vàng sáng giữa, xanh đen mảnh trong; fill màu chữ sáng, không shadow/offset.
- Cache visual-overrides.js: v217.

## 78. Bỏ bảng tên ở hàm nhãn cấp bậc đang chạy
- Hàm hoạt động là `drawRoleLabel()` trong `audience.js`; đã loại bỏ nền bảng, khung, bóng và chỉ giữ chữ viền ba lớp trực tiếp trên cảnh.
- Tên lầu các trong `visual-overrides.js` cũng vẽ trực tiếp không bảng nền.
- Cache audience.js: v182.


## 79. Làm sắc nét chữ nhãn
- Nhãn cấp bậc dùng một viền xanh đen mảnh 1.65px theo scale và màu chữ sáng; bỏ các lớp viền đồng tâm gây nhòe.
- Biển hiệu công trình dùng một viền xanh đen 2.2px, riêng chính điện 2.8px; không có quầng/bóng hoặc bảng nền cấp bậc.
- Cache: `audience.js v183`, `visual-overrides.js v218`.


## 80. Nhãn chức danh và hộp nhập pháp luân
- Bộ vẽ nhãn chức danh đang hoạt động là `drawRoleLabel()` trong `visual-overrides.js`, do file này tải sau và ghi đè hàm cùng tên trong `audience.js`.
- Chữ chức danh tăng cỡ, chỉ có một viền xanh đen 3–3.5px, không chồng nhiều lớp viền.
- Hộp nhập số lượng/thời lượng nằm trên nút kiếm; nút kiếm ẩn trong thời gian hộp nhập mở để không che số và lựa chọn.
- Cache: `visual-overrides.js v219`, `style.css responsive-arena-v203`.


## 81. Phân bố đều khán đài ngoại môn và tạp dịch
- Mỗi hàng tự trải đều theo chiều ngang Canvas dựa trên số nhân vật thực tế trong hàng.
- Hàng cuối không còn dồn về trái và để trống phần phải: ngoại môn 44 người, tạp dịch 36 người vẫn được căn từ trái sang phải.
- Không tăng số lượng: giữ 92 ngoại môn và 132 tạp dịch; giảm dao động ngang để tránh nhân vật chạm mép.
- Cache `visual-overrides.js`: v220.

## 82. Số lượng và mật độ ngoại môn, tạp dịch
- Ngoại môn: 112 nhân vật, chia 2 hàng × 56.
- Tạp dịch: 168 nhân vật, chia 3 hàng × 56.
- Tất cả các hàng dùng cùng khoảng cách ngang cố định trên toàn chiều rộng; không tạo hàng cuối ít người hoặc lệch về một phía.
- Giữ tỷ lệ nhân vật hiện tại; giảm nhẹ dao động dọc, bỏ dao động ngang.
- Cache `visual-overrides.js`: v221.


## 83. Đại hội Tông Môn — cấu hình khai mạc

Nguồn cấu hình: `data/ceremony.json` → `opening`; bộ điều phối: `tournament.js`.

| Thiết lập | Giá trị hiện tại | Ý nghĩa |
|---|---:|---|
| Hồi khai mạc 1 | 2200 ms | Tuyên bố Đại hội Tông Môn |
| Hồi khai mạc 2 | 2500 ms | Giới thiệu chư phong và đạo danh đại diện |
| Hồi khai mạc 3 | 2800 ms | Chưởng môn tuyên lệnh khai chiến |
| Đạo danh giới thiệu tối đa | 6 | Các tên đầu danh sách triệu hồi, phần còn lại hiển thị số lượng bổ sung |
| Lời bình trực tiếp | 3400 ms | Hiển thị ngắn khi đổi người dẫn đầu, có người về đích hoặc kết thúc |

Tổng thời lượng tự động của nghi thức là 7,5 giây; người xem có thể nhấn “Khai chiến ngay” để chuyển sang đếm ngược 3 giây hiện có. Đây chỉ là lớp trình diễn trước cuộc đua và lời bình đọc từ thông báo/trạng thái sẵn có; không tác động cân bằng, tiến độ, thứ hạng hoặc thời gian về đích. Các mốc `departure` và `awards` cũ tiếp tục điều khiển nghi thức trao thưởng Canvas.


## 84. Bong bóng thoại theo nhân vật phát ngôn
- Giao diện lời bình do `tournament.js` quản lý; nội dung lấy từ các thông báo cuộc đua và trạng thái kết thúc sẵn có.
- Mặc định: trưởng lão thứ ba từ trái sang phát lời khai mạc; chưởng môn phát lời chúc mừng tam giáp; tiên nhân đang dẫn đầu hoặc vừa cán đích tự mang lời thoại tương ứng.
- Hỗ trợ mở rộng người nói theo vai: `master`, `elder`, `disciple`, `core`, `inner`, `outer`, `servant`, hoặc đối tượng racer thực tế.
- Vị trí được quy đổi từ tọa độ Canvas sang khung sân và tính cả `gameZoom`, `gamePanX`, `gamePanY`; vòng cập nhật vị trí chỉ chạy trong thời gian bong bóng đang hiện.
- Không thay đổi `data/ceremony.json`, mốc nghi thức, thời gian lời bình hoặc logic xếp hạng.
- Cache: `tournament.js?v=tournament-v4`, `i18n.js v183`, `style.css?v=responsive-arena-v206`.


## 85. Lời thoại trực tiếp và neo đầu nhân vật
- Lời bình không còn tiêu đề chức danh; nội dung trong bong bóng là câu thoại trực tiếp. Tiên nhân dẫn đầu/về đích nói ở ngôi thứ nhất; trưởng lão và chưởng môn phát biểu theo vai.
- Neo các vai khán đài được đặt tại đỉnh đầu/mão thực tế; racer dùng `laneY()` trừ khoảng 42 đơn vị theo scale. Tọa độ Canvas tiếp tục áp dụng pan/zoom hiện tại.
- Nếu thiếu khoảng trống phía trên, bong bóng chuyển xuống dưới nhân vật và đảo đuôi thoại; giới hạn tâm và đuôi để không tràn khỏi sân.
- Trong lúc bong bóng hiện, `drawAnnouncement()` không vẽ banner toàn sân trùng nội dung. Thông báo countdown/gameplay còn lại không bị thay đổi.
- `#event` nhận tín hiệu khai cuộc để observer hiển thị lời của trưởng lão. Cache: tournament.js v5, i18n.js v184, style.css responsive-arena-v207, data-loader.js v154.

## 86. Lời bình đối đáp và bong bóng thoại gọn
- Bong bóng thoại giới hạn chiều rộng, giảm padding, font và bóng đổ để không lấn át nhân vật; mobile dùng giới hạn nhỏ hơn.
- Sự kiện đổi người dẫn đầu kích hoạt lượt đối thoại luân phiên giữa trưởng lão, chưởng môn và chân truyền đệ tử. Tiếp sau là một câu cổ vũ từ hàng ngoại môn/đệ tử phía dưới.
- Lời thoại hiển thị tuần tự trong cùng bong bóng, giữ neo vị trí theo nhân vật đang nói; không thay đổi thuật toán đua hoặc thứ hạng.
- Cache: `tournament.js v6`, `style.css responsive-arena-v208`, `data-loader.js v155`.

## 87. Bong bóng theo cấp bậc và cổ vũ gọi tên
- Kích thước tối đa của bong bóng được phân theo vai phát ngôn và breakpoint; hộp thoại co theo nội dung, không dùng cùng một kích thước lớn cho mọi nhân vật.
- Lời đối đáp của trưởng lão/chưởng môn có nhắc tên người đang dẫn đầu. Đệ tử khán đài cổ vũ trực tiếp bằng tên racer và xưng hô phù hợp.
- Không đổi cách tính hạng, tốc độ, tiến độ hay thời lượng cuộc đua.
- Cache: `tournament.js v7`, `style.css responsive-arena-v209`, `data-loader.js v156`.

## 88. Bong bóng lớn, hội thoại đồng thời và cổ vũ liên tục
- Bong bóng tăng kích thước và phân biệt theo vai nhân vật, có kích thước riêng cho mobile. Bong bóng bám sát đầu người nói; riêng chưởng môn dịch sang bên và xuống thấp, mũi tên vẫn trỏ đúng vị trí.
- Hệ thống hỗ trợ nhiều bong bóng độc lập cùng hiện (giới hạn 7), thay vì ghi đè một hộp thoại duy nhất.
- Trong lúc đua, lời cổ vũ từ các hàng đệ tử xuất hiện liên tục, luân phiên nhiều câu và nhiều tên người thi đấu. Khi tạm dừng, lịch chờ tiếp tục kiểm tra; khi kết thúc sẽ dừng.
- Không còn câu “Ta đã về đích”; kết quả xếp hạng vẫn giữ nguyên.
- Cache: `tournament.js v8`, `style.css responsive-arena-v210`, `data-loader.js v157`.


## 89. Khôi phục bong bóng bình luận trực tiếp
- Loại bỏ điều kiện chặn hiển thị không cần thiết trong hàm tạo bong bóng; bảo đảm phần tử mới luôn được đưa lên lớp trên của sân đua.
- Bổ sung dự phòng khởi động lời cổ vũ từ thay đổi trạng thái khi cuộc đua thực sự chạy; chỉ phát lời khi đã qua đếm ngược, đang chạy và không tạm dừng/kết thúc.
- Giữ nguyên giới hạn số bong bóng, neo nhân vật, lời thoại và logic thứ hạng.
- Cache: `tournament.js v9`, `style.css responsive-arena-v211`, `data-loader.js v158`.


## 90. Hotfix khôi phục bong bóng bình luận (18-11-2026)
- Khởi động bộ lập lịch cổ vũ trực tiếp từ thao tác nhấn Chạy, không phụ thuộc duy nhất vào MutationObserver của thông báo khai cuộc.
- Bộ lập lịch chờ hết đếm ngược và chỉ phát lời khi cuộc đua đang chạy, không tạm dừng.
- Đặt các thuộc tính hiển thị quan trọng ngay trên bong bóng và khóa lớp hiển thị phía trên sân đua; trạng thái hết hạn vẫn ẩn bong bóng.
- Cache: `tournament.js v10`, `style.css responsive-arena-v212`, `data-loader.js v159`.


## 91. Lời bình trực tiếp và tăng tốc về đích trong giây cuối
- `tournament.js` khởi tạo độc lập, không gọi các callback nghi thức không tồn tại; bong bóng được tạo trực tiếp khi bắt đầu/khai cuộc, neo theo Canvas và tự dọn khi hết thời gian.
- Bộ cổ vũ chỉ chạy sau khi qua đếm ngược, đang đua và không tạm dừng; dừng khi cuộc đua kết thúc.
- Trong giây cuối (`00:01`), mọi racer chưa về đích được tăng tiến độ theo phần quãng đường còn lại và thời gian còn lại, bảo đảm cùng chạm vạch khi đồng hồ về `00:00`. Thứ hạng vẫn dựa trên tiến độ và thời điểm chạm đích.
- Cache: `tournament.js v11`, `race-logic.js v204`, `data-loader.js v160`.


## 92. Thu nhỏ bong bóng bình luận theo cấp bậc
- Bong bóng lời bình được thu nhỏ theo thứ bậc: Chưởng môn/trưởng lão lớn nhất; nòng cốt/ngoại môn trung bình; nội môn nhỏ hơn; tạp dịch nhỏ nhất.
- Giảm cỡ chữ, padding, chiều rộng tối thiểu và đuôi bong bóng; trên màn hình nhỏ tiếp tục thu gọn nhưng vẫn cho phép nội dung dài tự xuống dòng.
- CSS cache: `responsive-arena-v213`.


## 93. Dải bình luận không che khu vực thi đấu
- Lời thoại được hiển thị trong một dải bố cục độc lập phía trên Canvas, không còn định vị tuyệt đối đè lên đường đua hoặc thí sinh.
- Mỗi lượt chỉ có một bong bóng; nội dung tối đa hai dòng, giới hạn chiều cao và cắt gọn khi quá dài.
- Cấp bậc nhân vật quyết định kích thước bong bóng; kích thước trên màn hình nhỏ được giảm thêm.
- Cache: `tournament.js v12`, `style.css responsive-arena-v214`, `data-loader.js v161`.


## 94. Bong bóng thoại neo theo đầu nhân vật
- Lời bình xuất hiện trên đầu nhân vật khán đài tương ứng, có thể lệch nhẹ sang trái/phải nhưng mũi tên vẫn trỏ về đầu người nói.
- Vị trí bám theo zoom/pan của Canvas và cập nhật liên tục.
- Bong bóng phân cấp kích thước theo vai trò, thu gọn thêm trên điện thoại.
- Neo trong khu vực khán đài, tách khỏi đường đua và các thí sinh.
- Cache: `tournament.js v13`, `style.css responsive-arena-v216`, `data-loader.js v162`.


## 95. Bong bóng đồng thời, kết thúc lời bình và xưng hô
- Cho phép tối đa 6 bong bóng cùng hiện; bong bóng mới luôn được tạo phía trước (z-index cao hơn), bong bóng cũ vẫn hiện đến khi hết 4,3 giây hoặc bị giới hạn số lượng.
- Khi trạng thái `finished` bật, hủy lịch cổ vũ, xóa tất cả bong bóng đang tồn tại và ngăn các sự kiện/timer tạo lời bình mới.
- Xưng hô với người đua dựa trên nhận diện giới tính từ tên (dấu hiệu danh xưng và một số từ/tên thường gặp). Nếu không đủ dấu hiệu, dùng “đạo hữu”/câu trung tính, không suy đoán giới tính.
- Neo lời bình của Chưởng môn, Trưởng lão, đệ tử và các hàng khán đài được hạ xuống để bong bóng không chồng lên đường đua; vẫn theo camera zoom/pan, đuôi chỉ về speaker.
- Cache: `tournament.js v15`, `style.css responsive-arena-v219`, `data-loader.js v164`.


## 96. Lời bình phong phú, bong bóng tự co giãn và triệu hồi huyền thoại
- Lời bình trực tiếp mở rộng kho câu thoại phong cách tu tiên, đấu pháp, thiên kiêu, linh khí, kiếm ý và hài hước; luân phiên theo cấp bậc phát ngôn.
- Bong bóng thoại tự mở rộng chiều rộng/chiều cao, tự xuống dòng, không giới hạn 2 dòng và không cắt thành dấu ba chấm; giới hạn bề ngang theo khung sân, vị trí theo kích thước thực để không tràn khung.
- Sprite nhân vật huyền thoại Thần Sầu được preload ngay khi renderer tải. Khi sprite chưa sẵn sàng, dùng bóng linh thể tạm thời thay vì vẽ nhân vật thường làm fallback rồi đổi sprite, tránh cảm giác nhân vật bị đè/thay thế sau triệu hồi.
- Cache: `tournament.js v16`, `visual-overrides.js v222`, `style.css responsive-arena-v220`, `data-loader.js v165`.


## 97. Xưng hô có tên riêng và viết hoa theo vị trí câu
- Tên riêng luôn đứng trước danh xưng: `Trần Linh Nhi sư tỷ`, `Thừa Phong sư huynh`, `Diệp đạo hữu`.
- Đầu câu chỉ viết hoa chữ cái đầu của tên/cụm xưng hô (ví dụ `Trần Linh Nhi sư tỷ!`); giữa câu viết thường theo ngữ cảnh (ví dụ `ta thấy Trần Linh Nhi sư tỷ đang dẫn đầu`).
- Khi không nhận diện được giới tính, vẫn đặt tên trước danh xưng trung tính `đạo hữu`; không đảo thành `Sư tỷ Linh Nhi` hoặc `Đạo hữu Diệp`.
- Lời bình sự kiện người dẫn đầu cũng dùng đúng thứ tự tên trước danh xưng.
- Cache: `tournament.js v18`, `data-loader.js v167`.


## 98. Bong bóng lời bình gọn theo cấp bậc
- Bong bóng phải nhỏ, không lấn át nhân vật và đường đua; cỡ chữ giữ cố định, không phóng to theo độ dài câu.
- Lời thoại dài tự xuống dòng và tăng chiều cao/chiều rộng trong giới hạn của khung sân; không cắt bằng dấu ba chấm, không tăng font để chứa nội dung.
- Giao diện phân cấp theo người nói: môn chủ vàng ngự chỉ, trưởng lão tử kim cổ kính, nòng cốt/thân truyền thanh ngọc, nội môn lam ngọc, ngoại môn thanh bạch, tạp dịch giấy ngà nâu mộc, người đua xanh kiếm khí.
- Desktop: chữ khoảng 8.5px, mobile: 7.5px; chiều rộng tối đa lần lượt khoảng 116–158px desktop và 102–132px mobile tùy vai trò.
- CSS revision 168; cache style.css `responsive-arena-v221`.


## 99. Hạ vị trí bong bóng của hàng khán giả phía trên
- Hạ điểm neo lời bình của môn chủ, trưởng lão, nòng cốt/thân truyền, nội môn và người đua để bong bóng không bay cao vào đường đua hoặc che nhân vật thi đấu.
- Bong bóng cùng người nói xếp lệch nhẹ xuống dưới thay vì dồn ngược lên trên; vẫn giới hạn trong khung sân và bám theo camera.
- Cache: `tournament.js v19`, `data-loader.js v168`.

## 100. Khắc phục triệu hồi Thần Sầu bằng sprite pixel gốc
- Xóa phép gán biến toàn cục chưa khai báo trong `visual-overrides.js` chạy ở strict mode; lỗi ReferenceError trước đó có thể làm dừng thực thi renderer trước khi hàm vẽ Thần Sầu được khởi tạo.
- Tiếp tục dùng đúng tệp `assets/characters/than-sau/than-sau-spritesheet.png`, sprite sheet 5 cột × 2 hàng, 10 frame; không thay bằng nhân vật Canvas tự vẽ.
- Khi vẽ từng frame, giữ tỷ lệ gốc theo `frameWidth / frameHeight`, không ép ảnh dọc thành khung vuông; tắt làm mịn ảnh để bảo toàn pixel art.
- Cache: `visual-overrides.js v223`, sprite sheet `?v=3`, `data-loader.js v167`.

## 101. Phân tán bong bóng lời bình theo chiều ngang
- Không để các bong bóng liên tiếp dồn quanh tâm sân: lần lượt phân phối qua các vùng trái, phải, trong-trái, trong-phải và trung tâm, sau đó lặp lại với các vùng xen kẽ.
- Tọa độ vùng hiển thị được phối hợp với vị trí neo người nói; đuôi bong bóng vẫn hướng về vị trí người nói, đồng thời giới hạn toàn bộ bong bóng trong khung sân.
- Giữ nguyên độ cao neo, kiểu chữ, kích thước, màu sắc và hiệu ứng xếp tầng đã có.
- Cache: `tournament.js v20`, `data-loader.js v168`.


## 102. Bong bóng tiên môn đồng sắc đạo bào và tăng lời bình tôn vị
- Màu nền, viền và chữ bong bóng được phối theo sắc đạo bào và nhãn chức danh: Chưởng môn chu sa/kim, Trưởng lão tử bào, Chân truyền lam ngọc, Nòng cốt thanh ngọc, Nội môn lam thanh, Ngoại môn thanh bạch, Tạp dịch ngà nâu, người đua xanh kiếm khí.
- Bổ sung lớp chuyển sắc và viền nội quang nhẹ theo phong cách ngọc bài/lụa tiên hiệp; giữ nguyên cỡ chữ và bố cục bong bóng.
- Tăng tần suất Trưởng lão và Chân truyền đệ tử bằng chu kỳ phát ngôn có trọng số; các vai khác vẫn luân phiên bình luận.
- Hạ điểm neo bong bóng của Trưởng lão và Chân truyền từ y=750/745 xuống y=550, đưa lời thoại lên gần bảng danh vị và đầu nhân vật, không thay đổi các hàng khán giả khác.
- Cache: `tournament.js v21`, `style.css responsive-arena-v222`, `data-loader.js v169`.


## 103. Thu gọn bong bóng và hạ điểm neo vùng đầu
- Thu nhỏ nhẹ khung thoại: giới hạn rộng desktop 150px, mobile 128px; giảm padding và cỡ chữ còn 7.5px desktop, 6.8px mobile, giữ nguyên màu sắc tiên hiệp theo cấp bậc.
- Hạ điểm neo Trưởng lão và Chân truyền từ y=550 xuống y=580; người đua từ y=690 xuống y=720 để bong bóng tránh che khuất nhân vật thi đấu.
- Các điểm neo Chưởng môn, Nòng cốt, Nội môn, Ngoại môn và Tạp dịch giữ nguyên.
- Cache: `tournament.js v22`, `style.css responsive-arena-v223`, `data-loader.js v170`.


## 104. Thu nhỏ thêm và đảo đuôi bong bóng hàng đầu
- Thu gọn tiếp khung thoại: desktop tối đa 138px, chữ 7px; mobile tối đa 118px, chữ 6.4px; giảm padding và giữ nguyên bảng màu theo cấp bậc.
- Trưởng lão và Chân truyền dùng kiểu đặt bong bóng phía dưới điểm neo ở hàng đầu; mũi tên được đảo lên trên để chỉ về nhân vật đang thoại, tránh phủ lên người thi đấu. Các vai khác giữ cách đặt hiện tại.
- Vị trí được giới hạn trong khung sân, tiếp tục bám theo zoom/pan và cập nhật theo camera.
- Cache: `tournament.js v23`, `style.css responsive-arena-v224`, `data-loader.js v171`.


## 105. Tự động phân bố bong bóng trái - giữa - phải
- Mỗi bong bóng tự chọn vị trí trong các vùng trái, giữa, phải và các tầng cao/thấp dựa trên khoảng trống hiện có; thuật toán ưu tiên vị trí ít chồng lấn với các bong bóng đang hiển thị.
- Bong bóng cũ được bố trí trước, bong bóng mới tìm vị trí còn trống; vị trí được tính lại theo camera/zoom để vẫn bám theo sân đua.
- Mũi tên tiếp tục hướng về điểm neo người nói; giữ nguyên quy tắc đảo mũi tên cho Trưởng lão và Chân truyền.
- Cache: `tournament.js v24`, `data-loader.js v172`.


## 106. Luân phiên bong bóng thoại và đồng bộ đồng hồ thực
- Tối đa 2 bong bóng được hiển thị đồng thời trên toàn sân; cùng một vai phát ngôn không xuất hiện hai bong bóng cùng lúc. Lời thoại sự kiện được xếp hàng và tiếp tục khi có chỗ trống; lời cổ vũ tự động chờ đến khi đủ chỗ thay vì tạo thêm bong bóng hoặc đẩy bong bóng cũ xuống.
- Chưởng môn được loại khỏi chu kỳ phát biểu tự động. Chưởng môn chỉ đáp lời trong đối thoại sự kiện khi trưởng lão gọi/đề cập trực tiếp; vị trí neo được nâng lên và dùng chung cơ chế đảo đuôi lên/xuống như các vai khác.
- Giảm số tầng dịch chuyển dọc của bong bóng từ 7 xuống 3 mức (giữa, gần hơn một tầng lên hoặc xuống), tránh rơi quá thấp khi có nhiều lời thoại.
- Vòng lặp khung hình tách delta thời gian thực khỏi delta hiệu ứng: countdown và updateRace nhận toàn bộ thời gian thực đã trôi qua; hạt, fade và hiệu ứng hình ảnh vẫn giới hạn delta để tránh nhảy hình quá mạnh. Khi thiết bị hụt FPS, đồng hồ không còn tự bỏ phần thời gian vượt 50 ms mỗi khung.
- Cache: tournament.js v26, race-logic.js v206, data-loader.js v175.


## 107. Chọn lọc hiệu ứng hiển thị khi nhiều nhân vật trùng hiệu ứng
- Việc chọn lọc chỉ tác động đến lớp vẽ hiệu ứng trên đường đua; không sửa effectTimer, effectType, speedMultiplier, hiệu ứng gameplay, thứ hạng hoặc danh sách nhân vật.
- Phân nhóm theo đúng effectType đang còn hiệu lực. Nhóm tối đa 8 nhân vật: hiển thị đầy đủ; nhóm 9–20: chọn 6 nhân vật đại diện; nhóm trên 20: chọn 4 nhân vật đại diện. Nhóm được chọn theo mã định danh ổn định để tránh đổi nhân vật liên tục giữa các khung hình.
- Khi nhân vật hết hiệu ứng hoặc nhóm thay đổi, lựa chọn được tính lại ở khung hình kế tiếp. Nhân vật không được chọn vẫn thi đấu và được ghi nhận đầy đủ trong Tiên Bảng.
- Thiên Lý Kính luôn vẽ đầy đủ hiệu ứng cho nhân vật đang được chiếu; khi số lượng ít, tất cả nhân vật trên đường đua tiếp tục có hiệu ứng đầy đủ.
- Cache: visual-overrides.js v224, data-loader.js v176.

## 108. Đồng bộ ngai Chưởng môn và điểm neo lời thoại
- Khi khán đài trở lại sau nghi thức kết thúc đại hội, tọa độ ngai Chưởng môn dùng cùng tỷ lệ chiều cao Canvas `612/825` như cảnh trao thưởng; không dùng tọa độ Y cố định, tránh ghế/ngai tụt xuống và che hàng Nòng cốt.
- Điểm neo bong bóng Chưởng môn chuyển về gần đỉnh mão (tọa độ Canvas x=550, y=515); giữ cơ chế tự chọn phía trên/phía dưới và mũi tên hướng về người thoại.
- Cache: `visual-overrides.js v225`, `tournament.js v27`, `data-loader.js v177`.

## 109. Đa dạng lời thoại và chống lặp
- Mở rộng kho lời thoại của các vai Trưởng lão, Chân truyền đệ tử, Nòng cốt, Nội môn, Ngoại môn và Tạp dịch; Chưởng môn có thêm câu thoại chỉ dùng khi đối đáp sự kiện.
- Mỗi vai ghi nhớ 8 câu vừa phát để tránh lặp lại trong các lượt gần nhau; khi hết câu mới mới quay lại kho cũ.
- Tăng nhịp chọn lời thoại tự động lên khoảng 0,9–1,3 giây/lượt; vẫn tuân thủ giới hạn tối đa 2 bong bóng cùng lúc và không hiện trùng vai đồng thời.
- Bổ sung nhiều câu hài hước theo bối cảnh tu tiên, ngự kiếm, linh thạch, pháp bảo, môn quy và sinh hoạt tông môn.
- Cache: `tournament.js v28`, `data-loader.js v178`.


## 110. Xưng hô đúng vai vế và bảo vệ vùng mặt Trưởng lão/Chưởng môn
- Racer hiện chưa có trường cấp bậc tu luyện riêng; khi Trưởng lão/Chưởng môn gọi đích danh, dùng cách xưng hô an toàn “đệ tử [tên]” thay vì suy đoán “sư huynh/sư tỷ” theo giới tính. Nếu tên có nhãn vai trò Tạp dịch/Ngoại môn/Nội môn/Nòng cốt/Thân truyền thì giữ đúng nhãn vai trò; loại bỏ hậu tố xưng hô trùng trước khi ghép.
- Lời thoại tự động của Trưởng lão và đối đáp sự kiện của Chưởng môn dùng chung quy tắc xưng hô bậc trưởng bối; các vai khán giả khác giữ nguyên cách gọi hiện tại.
- Bong bóng Trưởng lão và Chưởng môn luôn bố trí phía trên điểm neo đầu/mão, mũi tên hướng xuống người nói; thuật toán không thử đảo bong bóng xuống dưới hoặc chọn tầng thấp có thể che mặt. Điểm neo Trưởng lão điều chỉnh lên y=570; Chưởng môn giữ y=515.
- Giữ nguyên giới hạn 2 bong bóng, hàng đợi, chống lặp lời thoại và logic cuộc đua.
- Cache: `tournament.js v29`, `data-loader.js v179`.


## 111. Kho lời thoại JSON, chống lặp mở rộng và hạ bong bóng Chưởng môn khỏi đường đua
- Toàn bộ lời thoại bình luận của Trưởng lão, Chưởng môn, Chân truyền đệ tử, Nòng cốt, Nội môn, Ngoại môn và Tạp dịch được lưu trong `data/dialogues.json`; `data-loader.js` tải JSON vào `window.VKP_DATA.dialogues`, `tournament.js` chỉ đọc và thay placeholder `{call}`/`fallback`, không còn lưu kho câu thoại trong JavaScript.
- Kho hiện có 191 câu: Trưởng lão 28, Chưởng môn 22, Chân truyền đệ tử 28, Nòng cốt 27, Nội môn 29, Ngoại môn 29, Tạp dịch 28; bổ sung 58 câu hài hước tu tiên về linh thạch, pháp bảo, phi kiếm, môn quy và sinh hoạt tông môn.
- Chống lặp mở rộng: mỗi vai ghi nhớ 18 câu gần nhất, toàn sân ghi nhớ 32 câu; bộ chọn ưu tiên câu chưa xuất hiện ở cả hai lịch sử. Hàng đợi bỏ qua nội dung trùng đang hiển thị hoặc đã chờ, tránh phát lại cùng câu ngay sau lượt trước.
- Bong bóng Chưởng môn chuyển xuống dưới điểm neo ở Canvas y=560, mũi tên hướng lên Chưởng môn; vùng hiển thị bắt đầu dưới đáy đường đua y=525 và dưới vùng mặt/mão. Các bong bóng Trưởng lão giữ nguyên hướng và vị trí riêng.
- Giữ nguyên giới hạn tối đa 2 bong bóng, Chưởng môn chỉ đáp lời trong sự kiện, cách xưng hô bậc trưởng bối và logic thi đấu.
- Cache: `tournament.js v30`, `data-loader.js v180`, `index.html data-driven-v180`.


## 112. Hạ bong bóng Trưởng lão và khôi phục lời bình khi tái đấu
- Bong bóng Trưởng lão chuyển xuống dưới điểm neo ở Canvas y=620, mũi tên hướng lên người nói; tránh vùng đường đua và phần thân nhân vật đang thi đấu. Chưởng môn giữ vị trí riêng hiện tại.
- Trưởng lão và Chưởng môn dùng hướng bong bóng phía dưới điểm neo; các vai khán đài khác giữ nguyên thuật toán phân bố và chống chồng lấn.
- Khôi phục bộ lời bình khi có trạng thái triệu hồi, bắt đầu đếm ngược hoặc bắt đầu vòng đua mới. Nút Chạy cũng mở lại cờ lời bình nếu vòng đua trước đã kết thúc; bộ lập lịch tiếp tục chờ đến khi đua thực sự chạy.
- Khi trao thưởng/kết thúc, lời bình vẫn dừng và xóa bong bóng như trước; không để timer của vòng cũ chạy sang vòng mới.
- Cache: `tournament.js v31`, `data-loader.js v181`, `index.html data-driven-v181`.


## 113. Chống lặp câu đã hiển thị và khóa vị trí bong bóng
- Bổ sung lịch sử câu thoại thực sự đã đưa lên bong bóng, áp dụng cho cả lời bình tự động lẫn lời thoại sự kiện (khai cuộc, vượt dẫn đầu, photo finish và đối đáp Chưởng môn).
- Chặn câu đã xuất hiện trong 18 lượt gần nhất của cùng vai hoặc 32 câu gần nhất trên toàn sân; kiểm tra trước khi thêm vào hàng đợi hoặc tạo bong bóng. Giữ nguyên lịch sử chọn câu tự động hiện có.
- Mỗi bong bóng khóa độ lệch ngang/dọc và hướng đuôi ngay lần bố trí đầu tiên. Trong thời gian hiển thị, bong bóng chỉ cập nhật theo thay đổi zoom/pan của Canvas; không tính lại vị trí khi bong bóng khác biến mất, tránh nhảy sang chỗ khác.
- Không thay đổi kho 191 câu trong `data/dialogues.json`, giới hạn 2 bong bóng, thời lượng 4,3 giây, phân vai hoặc logic cuộc đua.
- Cache: `tournament.js v32`, `data-loader.js v182`, `index.html data-driven-v182`.


## 114. Update 1 — Camera Director truyền hình
- Bổ sung module độc lập `camera-director.js`, không thay đổi mô phỏng tốc độ, tiến độ, thứ hạng hoặc hiệu ứng gameplay.
- Thiên Lý Kính tự chọn cảnh: Dẫn đầu (Leader), Pha vượt hạng (Overtake), Tranh phong (Duel), Hiệu ứng (Effect) và Về đích (Finish).
- Camera giữ cảnh vượt hạng Top 3 khoảng 1,7 giây; cảnh về đích Top 3 khoảng 2,3 giây; cảnh tranh phong khi khoảng cách hai người đầu nhỏ hơn hoặc bằng 2,2% quãng đua, tối đa 1,4 giây.
- Hiệu ứng đang có camera focus vẫn ưu tiên; cảnh mặc định theo người dẫn đầu. Camera mini hiển thị nhãn chế độ và phóng đại nhẹ cho các cảnh nổi bật.
- Khởi tạo lại Camera Director khi triệu hồi, bắt đầu đua và reset; các tính năng zoom/pan thủ công trên Canvas chính không đổi.
- Cache: `camera-director.js v1`, `race-logic.js v207`, `data-loader.js v183`, `index.html data-driven-v183`.


## 115. Update 1 — Event Engine và giao diện Thiên Lý Kính
- Thêm `race-events.js` làm event bus tập trung cho countdown, khai cuộc, đổi người dẫn đầu, vượt hạng, về đích, photo finish, kết thúc và reset.
- Event có payload, thời điểm, ID tuần tự, subscribe/unsubscribe, lịch sử event gần nhất và cooldown theo loại/key để giảm spam.
- Camera Director nhận event vượt hạng, về đích và photo finish qua Event Engine; không còn gọi camera trực tiếp từ mô phỏng.
- Thiên Lý Kính bỏ banner/dòng nhãn mode như PHA VƯỢT HẠNG, HIỆU ỨNG, CAM LEADER; giữ thông tin tên tuyển thủ, hạng, tốc độ, thiên phú và hiệu ứng theo giao diện hiện tại.
- Camera vẫn tự theo leader, tranh phong, effect focus, vượt hạng, finish và photo finish; không thay đổi logic tiến độ, tốc độ, thứ hạng hay gameplay.
- Cache: `race-logic.js v208`, `camera-director.js v2`, `race-events.js v1`, `data-loader.js v184`, `index.html data-driven-v184`.


## 116. Nâng ngai Chưởng môn và tách khỏi hàng Nòng cốt
- Ngai và bản thể Chưởng môn chuyển từ Canvas Y=612 lên Y=565; nhãn CHƯỞNG MÔN chuyển từ Y=493 lên Y=450. Vị trí chính giữa, ở tầng cao hơn khu vực Chân truyền và Trưởng lão hai bên, nhấn mạnh địa vị tối cao.
- Giữ nguyên tọa độ các hàng Chân truyền, Trưởng lão, Nòng cốt và các tầng đệ tử khác; không dịch/chồng lại khán đài. Ngai được nâng để tách khỏi vùng Nòng cốt đang tập trung bên dưới.
- Pháp trận triệu hồi và điểm niệm chú trung tâm được nâng tương ứng 45px (Y=674→629, Y=642→597) để khớp vị trí mới; không thay đổi thời lượng hay logic nghi thức.
- Cache: `visual-overrides.js v226`, `race-logic.js v209`, `data-loader.js v185`, `index.html data-driven-v185`.


## 117. Hạ khu vực Chưởng môn và cân bằng nhịp bình luận
- Ngai/nhân vật Chưởng môn hạ xuống Canvas Y=620 (tỷ lệ theo chiều cao Canvas), nhãn Chưởng môn hạ xuống Y=570, đưa vị trí gần vòng Thái Cực hơn nhưng vẫn giữ khoảng trống trước hàng Nòng cốt.
- Bình luận tự động giảm nhịp từ 0,9–1,3 giây xuống 2,1–3,0 giây; vai bình luận luân phiên ưu tiên Tạp dịch, Ngoại môn, Nội môn, Nòng cốt, Chân truyền, giảm mật độ Trưởng lão.
- Sự kiện đổi người dẫn đầu có thứ tự: đệ tử/khán giả mở lời, Trưởng lão nhận xét sau khoảng 1,9 giây; Chưởng môn chỉ đáp mỗi 3 sự kiện và sau khoảng 3,9 giây, nếu sự kiện vẫn còn hiện hành. Photo finish cũng đan xen đệ tử trước Trưởng lão.
- Cache: visual-overrides.js v227, tournament.js v33, data-loader.js v186, index.html data-driven-v186.


## 118. Đặt ngai Chưởng môn vào khoảng giữa hai hàng danh vị và ổn định cảnh kết thúc
- Tâm ngai Chưởng môn chuyển từ Canvas Y=620 xuống Y=590 (tỷ lệ theo chiều cao Canvas), nằm trong khoảng trống giữa hàng Chân truyền bên trái và Trưởng lão bên phải; cao hơn nhẹ hai hàng này và tách khỏi vùng Nòng cốt bên dưới.
- Nhãn CHƯỞNG MÔN giữ nguyên Canvas Y=570, tiếp tục nằm sát vòng Thái Cực; không di chuyển nhãn theo ngai.
- Loại bỏ thao tác render Thiên Lý Kính mini tự đặt lại cờ ẩn ngai của sân chính. Hai luồng render không còn ghi đè trạng thái của nhau, tránh ngai/Chưởng môn chớp mất rồi xuất hiện đè lên Nòng cốt sau cảnh đại hội kết thúc.
- Cache: visual-overrides.js v228, data-loader.js v187, index.html data-driven-v187.


## 119. Nâng ngai và đưa nhãn Chưởng môn lên trên vòng Thái Cực
- Tâm ngai Chưởng môn chuyển từ Canvas Y=590 lên Y=565 (tỷ lệ theo chiều cao Canvas), tạo khoảng cách rõ hơn với hàng Nòng cốt và cao hơn hàng Chân truyền/Trưởng lão tại Y=612.
- Nhãn CHƯỞNG MÔN chuyển từ Y=570 lên Y=432, nằm sát phía trên mép vòng Thái Cực (vòng có tâm tại khoảng Y=525.6 và bán kính hiển thị khoảng 77 px), tránh che mặt nhân vật.
- Cache: visual-overrides.js v229, data-loader.js v188, index.html data-driven-v188.

## 120. Hạ nhãn Chưởng môn sát vòng Thái Cực, giữ nguyên ngai
- Giữ nguyên tâm ngai và vị trí Chưởng môn tại Canvas Y=565; không thay đổi kích thước hoặc vị trí ghế.
- Chỉ hạ nhãn CHƯỞNG MÔN từ Y=432 xuống Y=438, đưa chữ gần vòng Thái Cực hơn nhưng vẫn tách khỏi mặt, vương miện và vòng sáng.
- Cache: visual-overrides.js v230, data-loader.js v189, index.html data-driven-v189.

## 121. Hạ nhãn Chưởng môn gần vòng Thái Cực thêm một nhịp
- Giữ nguyên Chưởng môn và ghế tại Canvas Y=565.
- Chỉ hạ nhãn CHƯỞNG MÔN từ Y=438 xuống Y=444 (thêm 6 px), không thay đổi mặt, vương miện hoặc vòng Thái Cực.
- Cache: visual-overrides.js v231, data-loader.js v190, index.html data-driven-v190.


## 122. Thử nghiệm hạ nhãn Chưởng môn xuống Canvas Y=500
- Chỉ thay đổi tọa độ nhãn CHƯỞNG MÔN từ Y=444 xuống Y=500 để kiểm tra vị trí mới; giữ nguyên tâm ngai và Chưởng môn tại Y=565, không thay đổi mặt, vương miện hoặc vòng Thái Cực.
- Cache: visual-overrides.js v232, data-loader.js v191, index.html data-driven-v191.


## 123. Điều khiển tốc độ và Slow Motion tự động
- Cụm tốc độ nằm dưới nhóm nút điều khiển: 1x, 0.5x, 0.25x, 0.1x và TỰ ĐỘNG. Chế độ mặc định là TỰ ĐỘNG; chọn mức thủ công sẽ tắt tự động.
- Khi đổi người dẫn đầu/vượt hạng Top 3: 0.5x trong khoảng 1.5–1.7 giây; Top 3 về đích: 0.25x khoảng 1.9 giây; photo finish: 0.1x khoảng 2.6 giây.
- Sự kiện mạnh hơn được ưu tiên trong thời gian hiệu lực. Khi hiệu lực kết thúc, tốc độ trở về 1x (hoặc mức thủ công đã chọn).
- Chỉ thời gian mô phỏng cuộc đua bị nhân hệ số. Countdown và hiệu ứng sân khấu vẫn chạy theo thời gian thực.
- Cache: race-logic.js v210, race-events.js v2, style.css responsive-arena-v225, data-loader.js v192, index.html data-driven-v192.


## 124. Gỡ bỏ điều khiển tốc độ và Slow Motion
- Gỡ toàn bộ hàng chọn tốc độ 1x/0.5x/0.25x/0.1x/TỰ ĐỘNG khỏi giao diện.
- Gỡ bộ điều khiển Slow Motion tự động và sự kiện kích hoạt giảm tốc; mô phỏng cuộc đua tiếp tục chạy theo delta thời gian thực như trước khi bổ sung tính năng.
- Giữ nguyên Event Engine, Camera Director, các sự kiện vượt hạng/về đích/photo finish và tốc độ hiệu ứng gameplay riêng của từng đệ tử.
- Cache: race-logic.js v211, style.css responsive-arena-v226, data-loader.js v193, index.html data-driven-v193.


## 125. Chuông tiên môn và âm thanh theo Thiên Lý Kính
- Bổ sung âm chuông khai cuộc khi sự kiện `race:start` phát ra; chuông thanh báo đổi người dẫn đầu; chuông về đích cho từng tiên nhân, với âm riêng nổi bật cho người về nhất; đại chung trầm ngân khi sự kiện `race:complete` kết thúc đại hội.
- Thêm âm thanh Web Audio tổng hợp theo nhóm hiệu ứng gameplay: độc, suy lực/choáng/ngất, hồi đan/tụ khí, va chạm/bạo bộ, lôi kích/lôi phù, cuồng phong/phong hành/đạp vân, kiếm ý/kiếm vũ/kiếm độn, trận pháp/phù hộ thân và các hiệu ứng tăng tốc.
- Âm thanh hiệu ứng chỉ được kích hoạt khi Thiên Lý Kính đang chọn cảnh `effect`; khi camera chuyển cảnh hoặc hiệu ứng đổi, âm đang phát được dừng trước khi âm mới bắt đầu. Rời cảnh hiệu ứng sẽ dừng âm hiệu ứng.
- Thêm hai nút icon-only độc lập: nhạc nền và âm thanh hiệu ứng/chuông. Trạng thái bật/tắt có `aria-label`, tooltip, dấu gạch trên icon khi tắt và lưu riêng trong localStorage.
- Không thay đổi công thức tốc độ, xác suất hiệu ứng, thứ hạng, thời điểm camera chọn cảnh hoặc nội dung nhạc nền.
- Cache: `style.css responsive-arena-v229`, `data-loader.js data-driven-v196`, `music.js v181`, `race-logic.js v214`, `audio.js v1`.


## 126. Khắc phục Thiên Lý Kính bị đứng hình
- Tách lỗi dựng Thiên Lý Kính khỏi khung render chính: nếu vẽ camera lỗi, đại cảnh và mô phỏng tiếp tục; camera reset Canvas state, hiển thị thông báo phục hồi và tự thử render lại ở khung tiếp theo.
- Bảo vệ cả camera thường và cảnh mini trao giải sau khi cuộc đua hoàn tất; không thay đổi trình tự/cảnh trao thưởng chính.
- Khi render camera thất bại, ngắt âm hiệu ứng đang bám cảnh để tránh âm không còn hình.
- Cache: `race-logic.js race-phase1-v215`, `race-render.js race-phase1-v186`.


## 127. Hoạt ảnh sinh động cho kiến trúc tiên môn (Giai đoạn 1)
- Giữ nguyên bố cục, vị trí, kích thước và thiết kế của 14 tòa hiện tại.
- `drawSectBuildingLifeFx(time,b)` gọi trong frame phong cảnh, không tạo loop riêng.
- Tàng Kinh Các: sách linh lực; Tụ Linh Tháp/Tàng Bảo Các: kiếm linh quang; Bách Thảo Các: linh diệp; Đan Các/Luyện Khí Điện: khói lò, tia lửa thưa; Quan Tinh Lâu: vòng thiên cơ và tinh điểm; Trận Pháp/Hộ Sơn Trận: phù văn chuyển động; các lầu khác: linh quang dịu.
- Dùng time/phase, hoạt ảnh nhẹ, chi tiết giới hạn, không particle random, không tác động gameplay/camera.
- Cache `visual-overrides.js` `race-phase1-v233`.


## 128. Tiên Môn Sinh Động — Giai đoạn 2: NPC mái/ban công
- Bổ sung các tu sĩ/đệ tử/ trưởng lão/nhân vật theo chức năng đứng trên mái và ban công 14 công trình: học đạo, đọc sách, luyện đan, luyện khí, chăm linh thảo, hộ vệ, quan tinh và đệ tử sinh hoạt.
- Đạo bào, màu viền, búi tóc/phụ kiện và tư thế phân biệt vai trò; chuyển động tay, thân và nhịp đứng nhẹ theo thời gian.
- Thêm hai tu sĩ ngự kiếm lướt ngang tầng mái xa, có vệt kiếm quang ngắn.
- Vẽ bằng Canvas trong frame phong cảnh hiện tại; số NPC cố định, không particle/random hoặc vòng animation riêng; không đổi bố cục, gameplay, camera hay biển hiệu.
- Cache: `visual-overrides.js` `race-phase1-v234`.


## 129. Sửa hiển thị NPC Giai đoạn 2 và vô hiệu cache cũ
- Điều chỉnh NPC đứng đúng mép mái/ban công, tăng kích thước hiển thị độc lập với tỉ lệ công trình để không bị quá nhỏ ở các lầu xa.
- Đưa hai tu sĩ ngự kiếm lên lớp vẽ sau kiến trúc để không bị mái nhà che.
- Tăng cache `visual-overrides.js` lên `race-phase1-v235`, `data-loader.js` lên `data-driven-v197` và cập nhật query trong `index.html` để trình duyệt tải lại bộ nạp mới.


## 130. Hoàn thiện NPC tiên môn — tạo hình, vị trí và hoạt động
- Thay NPC hình người tối giản bằng nhân vật Canvas có khuôn mặt (mắt, chân mày, mũi, miệng), tóc búi/trâm, cổ áo giao lĩnh, đạo bào nhiều lớp, đai lưng, tay, chân, giày và phụ kiện. Màu sắc phân biệt trưởng lão, đan sư, luyện khí, linh thảo, hộ vệ, học sĩ, tạp dịch, ngoại môn, nội môn và nòng cốt.
- Đặt chân NPC trực tiếp lên sàn hiên; dùng cùng originX/originY với mái đã chuyển động để không lệch khỏi kiến trúc. Bổ sung bóng tiếp xúc và lan can hai bên.
- Bố trí hoạt động theo công trình: đọc sách, chăm linh thảo, luyện đan/luyện khí, hộ vệ, đi lại và luyện kiếm. Hoạt ảnh dùng game loop hiện tại, số lượng cố định, không tạo timer/loop riêng.
- Hai NPC bay được vẽ riêng với thân nghiêng, áo choàng, phi kiếm và vệt bay; không dùng tư thế đứng thẳng lơ lửng.
- Không đổi bố cục 14 công trình, gameplay, camera, bảng xếp hạng hoặc âm thanh.
- Cache: `visual-overrides.js` `race-phase1-v236`, `data-loader.js` `data-driven-v198`, `index.html` `data-driven-v198`.


## 131. NPC chuyển hoàn toàn vào bên trong lầu các
- Xóa NPC khỏi mái, ban công, mặt tiền và bầu trời; không còn tu sĩ bay trong lớp kiến trúc.
- Vẽ NPC ở sâu trong cửa chính từng công trình, clip chính xác trong vùng cửa (local x=-12.5..12.5, y=-47..-10), đứng sau khung/cột mặt tiền.
- Chọn vai trò theo công năng: trưởng lão ở chính điện/hộ sơn, học sĩ ở tàng kinh/giảng đạo/quan tinh, đan sư ở đan các, luyện khí ở luyện khí điện, linh thảo ở bách thảo các, hộ vệ ở tàng bảo/trận pháp.
- Giữ ánh sáng nội thất ấm và nhẹ; không thay đổi bố cục 14 công trình, gameplay, camera, âm thanh hoặc các hệ thống khác.
- Cache: `visual-overrides.js` `race-phase1-v237`, `data-loader.js` `data-driven-v199`, `index.html` `data-driven-v199`.


## 132. Hoạt động NPC nội thất — Giai đoạn 3
- Hành vi cố định theo công năng 14 công trình; dùng timestamp của game loop hiện tại để tạo nhịp chuyển động nhẹ.
- Các hoạt động hỗ trợ: đọc sách, luyện kiếm, truyền pháp, thao tác/làm việc, tĩnh tọa, quan sát thiên tượng, hộ vệ và đi lại.
- NPC luôn bị clip trong cửa chính, không được xuất hiện trên mái, ban công hoặc ngoài trời. Không thay đổi bố cục, gameplay hay camera.
- Cache: visual-overrides.js race-phase1-v239, data-loader.js data-driven-v201, index.html data-driven-v201.


## 133. Tiên Môn Sinh Động — Giai đoạn 4: Hoạt động đặc trưng
- Tụ Linh Tháp: thêm các dải khí linh lực chảy/tuần hoàn dọc tháp, chuyển động chậm, mờ nhẹ.
- Đan Các: viên đan/điểm linh quang xoay quanh vòng luyện đan trên lò, ánh sáng nhịp theo khí lò.
- Luyện Khí Điện: thêm lóe sáng đường kiếm/kim loại khi rèn, giữ tia lửa thưa và ngắn.
- Đệ Tử Viện: thêm vệt kiếm khí ngắn cho động tác luyện kiếm, hai nhịp lệch pha, không dày đặc.
- Hiệu ứng dùng timestamp game loop, số lượng cố định, không random, không loop/timer riêng; giữ nguyên vị trí/tỉ lệ 14 công trình và NPC trong cửa, không đổi gameplay/camera/âm thanh.
- Cache: visual-overrides.js race-phase1-v240, data-loader.js data-driven-v202, index.html data-driven-v202.


## 134. Giai đoạn 5 — Tiên Sơn có chiều sâu (điều chỉnh)
- Giữ lớp vân vụ nhẹ và chi tiết sống núi; đã bỏ hiệu ứng thác nước.
- Giai đoạn 6 bổ sung chi tiết kiến trúc; cache visual-overrides.js race-phase1-v242, loader/index data-driven-v204.


## Giai đoạn 8 — Đại trận hộ sơn
- File triển khai: `visual-overrides.js`, hàm `drawSectGuardianArray(time)`.
- Màn chắn vòm bán trong suốt bao phủ quần thể tiên môn; các đường kinh tuyến/vĩ tuyến và mạch linh lực chuyển động theo thời gian frame.
- Bảy trận nhãn có trụ sáng, vòng trận và phù văn xoay chậm; mạch linh lực khép kín và liên kết về trận tâm.
- Vị trí render: sau `drawDenseForest(time)`, trước `drawSectArchitecture(time)`, để hiệu ứng nằm phía sau lầu các.
- Hoạt ảnh dùng tham số `time` của frame hiện tại, không tạo timer/particle riêng và không thay đổi gameplay.
- Cache: `visual-overrides.js?v=race-phase1-v243`.


## Giai đoạn 9 — Hệ thống thời gian và thời tiết
- Thêm chu kỳ cảnh theo thời gian: bình minh, ban ngày, hoàng hôn và ban đêm; ánh sáng phủ nhẹ thay đổi trên toàn cảnh, giúp núi và mái ngói đổi sắc theo thời điểm.
- Mặt trời di chuyển theo chu kỳ; ban đêm có trăng, sao nhấp nháy và đom đóm với số lượng cố định.
- Đèn lồng tại hiên 14 công trình tự phát sáng khi trời tối và tăng ánh sáng ấm vào lúc chạng vạng.
- Thời tiết luân phiên theo các đợt dài: trời quang, sương mỏng, mưa nhẹ và tuyết thưa; gió thể hiện bằng các vệt lướt nhẹ. Không dùng hạt ngẫu nhiên.
- Renderer `drawSectTimeWeather(time)` chạy trong frame phong cảnh hiện tại, không tạo timer/loop riêng; không thay đổi gameplay, thứ hạng hoặc camera.
- Cache: `visual-overrides.js?v=race-phase1-v245`.


## Giai đoạn 10 — Linh khí và ánh sáng tương tác môi trường
- Loại bỏ họa tiết vòng tròn phát sáng giống mặt trời ở mặt trước Tàng Bảo Các; không tạo thêm mặt trời vì chu kỳ thiên thể đã thuộc Giai đoạn 9.
- Thêm vệt bắt sáng mảnh trên diềm mái 14 công trình, thay đổi sắc độ theo hướng và thời điểm mặt trời trong chu kỳ Giai đoạn 9.
- Ánh sáng nội thất hắt nhẹ qua cửa, tăng sắc vàng ấm khi trời tối.
- Bổ sung các vệt phản chiếu linh quang ngắn trên mặt sông, chuyển động chậm và có cường độ theo ngày/đêm.
- Ánh sáng đại trận hộ sơn hòa vào môi trường bằng viền vòm và quầng trận tâm mờ; không vẽ lại mặt trời hoặc kết cấu trận.
- Renderer `drawSectAmbientLight(time)` dùng timestamp game loop, không timer/particle riêng; không thay đổi gameplay, camera hoặc bố cục.
- Cache: `visual-overrides.js?v=race-phase1-v246`.


## Điều chỉnh thiên thể và phân lớp hậu cảnh
- Loại bỏ quầng mặt trời cố định cũ khỏi nền trời để tránh vòng sáng chói chiếu xuống khu vực Tàng Bảo Các.
- Mặt trời và mặt trăng dùng quỹ đạo riêng theo chu kỳ ngày–đêm; mặt trăng mọc phía phải, lên cao giữa đêm và lặn phía trái lúc bình minh.
- Thiên thể được vẽ ngay sau nền trời, trước núi, toàn bộ lầu các và biển tên; các hiệu ứng đèn lồng/thời tiết vẫn ở lớp phù hợp phía trước.


## Quỹ đạo mặt trời và mặt trăng
- Mặt trời mọc phía trái, đi theo cung cong lên cao giữa ban ngày rồi lặn phía phải.
- Mặt trăng mọc phía phải lúc hoàng hôn, lên cao giữa đêm và lặn phía trái gần bình minh; hình đĩa có sắc độ và chi tiết bề mặt.
- Thiên thể được vẽ sau núi/mây để không bị địa hình che mất, nhưng trước sông, lầu các và biển tên để luôn nằm sau kiến trúc.


## Giai đoạn 11 — Sinh khí cảnh quan tiên môn
- Cây tùng ở hai rìa địa hình có bóng đổ tiếp xúc và thân/tán nghiêng nhẹ theo gió.
- Cỏ thấp, lá xanh và cánh hoa đào chuyển động chậm theo luồng gió; số lượng cố định, tính vị trí từ timestamp game loop, không tạo timer hoặc particle ngẫu nhiên.
- Hiệu ứng chỉ bổ sung lớp cảnh quan, không thay đổi gameplay, camera, kiến trúc, biển tên hoặc khu vực đệ tử.
- Cache: visual-overrides.js race-phase1-v249.


## Chu kỳ ngày đêm và phạm vi hộ sơn đại trận
- Chu kỳ hoàn chỉnh: 240.000 ms (4 phút), gồm 120.000 ms ban ngày và 120.000 ms ban đêm.
- Mặt trời chạy quỹ đạo trong nửa ngày; mặt trăng chạy quỹ đạo trong nửa đêm. Bình minh và hoàng hôn là chuyển tiếp ngắn, không kéo dài quá thời lượng mỗi nửa chu kỳ.
- Vòm đại trận mở rộng từ sát mép trái/phải, đỉnh gần mép trên và chân vòm xuống gần mép dưới khung Canvas; các trận nhãn và mạch trận được phân bố theo vòm mới.
- Cache: visual-overrides.js race-phase1-v250.


## Mỹ thuật Đại trận Hộ Sơn — bản phù văn
- Kết giới nhiều lớp với kinh tuyến/vĩ tuyến, đường mạch trận, tám phù ấn Bát Quái, phù văn hình học và phù lục tại bảy trận nhãn.
- Trận tâm dùng bốn vòng pháp luân xoay luân phiên hai chiều; linh quang di chuyển theo vòm bằng timestamp game loop.
- Hiệu ứng Canvas 2D, số lượng phần tử cố định, không tải ảnh/font ngoài và không tạo timer riêng.
- Cache: visual-overrides.js race-phase1-v251.
