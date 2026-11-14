# RULE — Quy chuẩn bắt buộc khi sửa Vạn Kiếm Phi Tiên

> Đây là tài liệu chuẩn cho mọi lần sửa mã nguồn. Trước khi chỉnh bất kỳ tệp nào, phải đọc file này và đối chiếu yêu cầu với kiến trúc thực tế trong nhánh `main`. Khi quy định được cập nhật, các lần sửa sau phải tuân theo bản mới nhất.

## 1. Quy trình bắt buộc trước khi sửa
1. Đọc toàn bộ `RULE.md` và `GAME_CONFIG.md` trước mỗi yêu cầu chỉnh sửa. `RULE.md` quy định quy trình/kỹ thuật; `GAME_CONFIG.md` quy định các thiết lập, giá trị hiện hành, nguồn dữ liệu và nguyên tắc cân bằng.
2. Xác định đúng tệp, đúng hàm và đúng đoạn mã đang thực sự hoạt động; không giả định đoạn đầu tiên là đoạn có hiệu lực.
3. Lấy phiên bản mới nhất từ nhánh `main` trước khi sửa. Không dùng bản cũ trong hội thoại hoặc bản cache làm nguồn chỉnh sửa.
4. Tìm các hàm/biến/selector trùng lặp, khai báo ghi đè và các khối CSS append-only. Với hàm trùng tên, xác định định nghĩa cuối cùng hoặc luồng gọi thực tế.
5. Đọc các tệp liên quan cùng lúc để hiểu luồng dữ liệu, trạng thái, render, sự kiện và cache. Không sửa một biểu hiện giao diện mà bỏ qua nguồn trạng thái.
6. Giữ nguyên chức năng hiện có ngoài phạm vi yêu cầu. Không tự ý tái cấu trúc lớn, đổi giao diện, đổi thuật toán hoặc xóa hiệu ứng không liên quan.
7. Mỗi lần cập nhật tệp phải dùng SHA mới nhất vừa fetch; các lần ghi cùng nhánh thực hiện tuần tự, không ghi song song lên cùng tệp.
8. Nếu chưa xác định được nguyên nhân hoặc thiếu dữ liệu để sửa an toàn, phải hỏi hoặc báo rõ điểm chưa xác định; không đoán rồi sửa đại.

## 2. Kiến trúc dự án
- Đây là game web dùng HTML, CSS, JavaScript và Canvas.
- `index.html` chứa cấu trúc DOM, canvas, bảng Tiên Bảng và nạp `data-loader.js`.
- `data-loader.js` nạp dữ liệu JSON và lần lượt nạp các script trò chơi theo thứ tự:
  `core.js`, `scenery.js`, `audience.js`, `race-render.js`, `visual-overrides.js`, `music.js`, `race-logic.js`, `i18n.js`.
- Dữ liệu cấu hình nằm trong `data/characters.json`, `data/swords.json`, `data/effects.json`, `data/summoning.json`, `data/ceremony.json`, `data/scenery.json`.
- `GAME_CONFIG.md` ghi nhận các thiết lập gameplay/UI, giá trị mặc định, giới hạn, nguồn thực thi và nguyên tắc cân bằng; phải cập nhật cùng khi thay đổi thiết lập.
- `core.js`: biến và tiện ích lõi.
- `scenery.js`, `audience.js`: cảnh quan, kiến trúc và khán giả.
- `race-render.js`: dựng cảnh đua và camera.
- `visual-overrides.js`: các hiệu chỉnh/ghi đè hình ảnh; có thể có nhiều định nghĩa cùng tên.
- `music.js`: âm nhạc.
- `race-logic.js`: triệu hồi, trạng thái đua, thứ hạng, về đích, Tiên Bảng và vòng lặp animation.
- `i18n.js`: ngôn ngữ.
- Không thay thế hình vẽ Canvas bằng ảnh minh họa hoặc thư viện ngoài nếu người dùng không yêu cầu.

## 3. Quy tắc JavaScript và trạng thái
1. Không tạo biến top-level `let`/`const` trùng tên khi các script được ghép/chạy trong cùng ngữ cảnh.
2. Không tham chiếu `let`/`const` trước khi khởi tạo (Temporal Dead Zone), kể cả trong callback có thể chạy sớm.
3. Không gọi hàm hoặc đọc thuộc tính trước khi dữ liệu cấu hình đã sẵn sàng.
4. Không tạo timer mới mà không xử lý hủy timer khi reset, triệu hồi lại hoặc dừng game.
5. Khi trạng thái nhân vật thay đổi (đang đua, có hiệu ứng, về đích), phải cập nhật đồng bộ dữ liệu nguồn và giao diện phụ thuộc.
6. Nhân vật đã về đích phải được xem là trạng thái chốt: không tiếp tục thay đổi tốc độ, hiệu ứng đua, mũi tên tăng/giảm hạng hoặc thời gian hoàn thành.
7. Không để timer của nhân vật đã về đích bị bỏ quên khiến hiệu ứng tồn tại vĩnh viễn. Hàm cập nhật chung phải chủ động xử lý trạng thái đã kết thúc.
8. Khi một sự kiện làm thay đổi nội dung ô nhưng không làm đổi thứ tự danh sách, vẫn phải cập nhật ô đó. Không đặt toàn bộ cập nhật DOM phía sau điều kiện chữ ký thứ tự không đổi.
9. Không dùng biến trạng thái giao diện làm nguồn dữ liệu duy nhất nếu có thể suy ra trạng thái hoàn tất từ dữ liệu nhân vật và mốc thời gian.
10. Các thao tác reset phải xóa dữ liệu/timer/trạng thái tạm của lượt trước.
11. Luồng triệu hồi phải có cơ chế hoàn tất dự phòng theo vòng lặp animation; không phụ thuộc duy nhất vào `setTimeout` để mở khóa nút. Mỗi lượt triệu hồi có mã thế hệ riêng; timer cũ phải bị hủy/vô hiệu hóa khi triệu hồi mới hoặc reset.
12. Tên tự sinh: số lượng không vượt quá số tên riêng trong kho thì không được lặp tên riêng, kể cả khác họ. Khi vượt ngưỡng, có thể lặp tên riêng nhưng phải ghép họ khác nhau cho mỗi lần dùng lại; không được trùng cả họ và tên.
13. Tên hiệu ứng là dữ liệu nội bộ; không hiển thị thông báo dị tượng, trở ngại, tăng tốc/giảm tốc trong banner sự kiện. Banner chỉ thông báo người đang dẫn đầu (Hạng 1) và thứ hạng từng tiên nhân khi về đích; thông báo về đích phải được ưu tiên hiển thị trọn vẹn, sau đó mới tiếp tục thông báo người dẫn đầu hiện tại. Khi vẽ nhân vật trong Thiên Lý Kính, truyền bản sao dữ liệu đã xóa `effectName` nhưng giữ `effectType`, `effectTimer` và trạng thái cần thiết để vẽ hiệu ứng hình ảnh.
14. Trong lúc triệu hồi/hiện thân, nút Dừng phải luôn khả dụng khi đã có danh sách tiên nhân; thao tác này hủy timer, vô hiệu hóa lượt triệu hồi hiện tại và dọn trạng thái hiệu ứng dở dang. Chỉ khóa nút Dừng khi chưa có tiên nhân.

## 4. Quy tắc Tiên Bảng
1. Trước khi bắt đầu đua: hiển thị danh sách theo thứ tự triệu hồi, không hiển thị số thứ hạng.
2. Trong lúc triệu hồi: tên chỉ xuất hiện theo tiến trình hiện thân. Không để dòng “Đang triệu hồi tiên nhân…” tồn tại sau khi toàn bộ nhân vật đã hiện thân. Nếu danh sách đã có nhân vật thì không dùng placeholder che danh sách.
3. Trong lúc đua: thứ hạng phải lấy từ tiến độ thực tế, không dựa vào thứ tự mảng gốc.
4. Hiệu ứng mũi tên tăng/giảm hạng chỉ là hiệu ứng tạm thời khi thứ hạng thay đổi.
5. Ngay khi một nhân vật về đích:
   - Chốt `finished=true`, `finishTime` và tiến độ đích.
   - Xóa `rankMovement`, `rankMovementTimer` và mọi hiệu ứng thay đổi hạng của nhân vật đó.
   - Không để mũi tên tăng/giảm hạng tiếp tục xuất hiện cho nhân vật đã về đích.
   - Thời gian hoàn thành phải được cập nhật vào ô thời gian ngay cả khi thứ tự các hàng không thay đổi.
6. Nhân vật chưa về đích vẫn có thể tiếp tục đổi thứ hạng và có hiệu ứng tương ứng.
7. Trong khi đua, Tiên Bảng phải cập nhật thứ tự xếp hạng theo nhịp tối đa 1 giây trên mọi thời lượng đua (5–600 giây); dùng throttle/coalescing giữ chữ ký mới nhất, tuyệt đối không debounce chờ thứ tự đứng yên. Khi toàn bộ nhân vật về đích, phải chốt thứ tự kết quả ngay, không chờ hết nhịp 1 giây.
8. Mũi tên tăng/giảm hạng và thời gian phải được đồng bộ DOM độc lập với việc chữ ký thứ tự hàng có thay đổi hay không; timer hết thì mũi tên phải tự biến mất.
9. Chuyển động FLIP phải ngắn hơn chu kỳ cập nhật 1 giây; thời lượng hiệu ứng mục tiêu khoảng 240 ms, không để animation kéo dài hoặc bị khởi động lại liên tục.
10. Khi toàn bộ nhân vật về đích: dừng hiệu ứng tăng/giảm hạng và chuyển Tiên Bảng sang trạng thái kết quả ổn định.
11. Định dạng thời gian Tiên Bảng: `MM:SS:mmm` (phút:giây:mili giây), ví dụ `00:30:015` nghĩa là 30 giây 15 mili giây. Phần mili giây luôn đủ 3 chữ số từ `000` đến `999`.
12. Thời gian về đích phải được nội suy từ thời điểm nhân vật thực sự vượt vạch đích trong khung cập nhật, không lấy chung thời điểm cuối khung hình cho mọi nhân vật.
13. Các nhân vật về đích cùng một khung cập nhật phải được xử lý theo thời điểm vượt vạch nội suy; nếu làm tròn đến mili giây bị trùng, phải đảm bảo thời gian kết quả tăng tối thiểu 1 ms theo đúng thứ tự về đích.
14. Không để thời gian là dấu gạch ngang với nhân vật đã có trạng thái về đích hợp lệ. Nếu thiếu `finishTime`, phải tìm và sửa điểm ghi nhận thời gian khi về đích; không chỉ thay chuỗi hiển thị.
15. Giữ tên nhân vật trên một dòng, tự thu nhỏ khi tên dài; không làm tràn bảng hoặc che cột thời gian.

## 5. Quy tắc giao diện và responsive
- Phải giữ tương thích màn hình iPhone/Safari và desktop.
- Không làm phát sinh tự động phóng to trang khi focus input trên iOS.
- Tôn trọng bố cục hiện có: desktop nhiều cột, tablet/điện thoại theo breakpoint hiện hành.
- Canvas chính giữ tỷ lệ 4:3 và không làm méo nhân vật/cảnh.
- Không để bảng, panel, camera hoặc điều khiển tràn khỏi vùng bố cục.
- Ưu tiên CSS hiện có và cascade thực tế; dự án có nhiều block revision nối tiếp nên phải kiểm tra selector nào đang thắng.
- Hạn chế filter, shadow blur và vòng lặp vẽ nặng trên điện thoại.
- Không thêm listener/timer/RAF trùng lặp nếu không cần thiết.


15. Responsive phải dựa trên cả chiều rộng và chiều cao viewport, không chỉ breakpoint chiều rộng. Trên màn hình ngang từ 600–999px, Canvas trường đua, Thiên Lý Kính và Tiên Bảng phải nằm cùng một hàng ba cột; Canvas giữ tỷ lệ 4:3, Thiên Lý Kính phải đủ lớn để xem rõ, các bảng được phép cuộn nội dung bên trong. Trên desktop rộng/full-screen, bố cục ba cột phải tận dụng chiều ngang khả dụng và bảng triệu hồi phải tăng kích thước chữ, pháp luân, ô nhập và nút theo viewport. Màn hình dọc giữ bố cục xếp tầng dễ đọc.

## 6. Quy tắc hình ảnh và hoạt ảnh
- Cảnh quan, lầu các, suối, sông, khán giả và nhân vật được dựng bằng Canvas.
- Khi sửa một hàm vẽ, phải xác định hàm đang hoạt động cuối cùng và các hàm gọi nó.
- Không làm mất chi tiết đã có, không thay đổi phong cách tiên hiệp/cổ phong của dự án ngoài yêu cầu.
- Chuyển động phải mượt, có giới hạn tốc độ hợp lý; tránh nhấp nháy, giật, rung hoặc tạo hiệu ứng lặp chồng.
- Các nhóm đệ tử/ngoại môn/nội môn/nòng cốt/trưởng lão phải giữ phân biệt về tạo hình khi chỉnh phần khán giả.

## 7. Quy tắc cache và triển khai
1. Nếu sửa script được nạp qua `data-loader.js`, cập nhật cache-busting version tương ứng trong loader.
2. Nếu sửa CSS được nạp qua URL có query version, cập nhật query version trong HTML/loader tương ứng.
3. Không tuyên bố trang đã deploy hoặc đã hiển thị phiên bản mới nếu chưa kiểm tra thực tế.
4. Commit GitHub thành công chỉ chứng minh mã đã được ghi vào repository, không chứng minh trình duyệt đã tải hoặc render đúng.

## 8. Kiểm tra bắt buộc sau mỗi lần sửa
1. Fetch lại các tệp đã sửa từ `main`.
2. Chạy kiểm tra cú pháp từng tệp JavaScript.
3. Ghép các script trò chơi theo đúng thứ tự nạp và kiểm tra cú pháp chung để phát hiện khai báo top-level trùng.
4. Kiểm tra HTML ID/selector được dùng bởi mã sửa đổi còn tồn tại và không bị trùng nếu có liên quan.
5. Kiểm tra logic bằng cách đối chiếu các điều kiện trạng thái và các trường hợp biên (reset, ít/nhiều nhân vật, người về đích đầu/cuối, timer bị trễ, thứ tự không đổi).
6. Kiểm tra cache version đã tăng nếu cần.
7. Nếu không chạy browser/device QA, phải nói rõ chưa kiểm tra trực quan trên trình duyệt/iPhone; không được khẳng định đã xác nhận giao diện thực tế.
8. Báo rõ tệp đã sửa, commit, kiểm tra đã thực hiện và phần chưa kiểm tra.

## 9. Nguyên tắc làm việc
- Ưu tiên sửa đúng nguyên nhân gốc thay vì vá biểu hiện.
- Mỗi yêu cầu chỉ thay đổi phần cần thiết; không làm hỏng các tính năng đã hoàn thiện trước đó.
- Không tự ý xóa dữ liệu, nhân vật, hiệu ứng, âm thanh, bản dịch hoặc cấu hình.
- Không giả định thao tác người dùng đã thành công nếu chưa có xác nhận từ hệ thống.
- Khi yêu cầu mới mâu thuẫn với quy chuẩn cũ, làm theo yêu cầu mới nhất của người dùng và cập nhật tài liệu này để các lần sau thống nhất.
- Khi thay đổi thông số, giới hạn, lựa chọn hoặc cân bằng game, cập nhật `GAME_CONFIG.md` trong cùng đợt sửa.

16. Bố cục ngang từ 600px trở lên phải có đúng ba cột: Canvas trường đua, Thiên Lý Kính, Tiên Bảng. Các quy tắc legacy theo `max-height` không được phép đưa camera/bảng trở lại hàng dọc; phải ghi đè ở cuối stylesheet. Trên điện thoại ngang, dành tối thiểu khoảng 30% chiều ngang cho Thiên Lý Kính để xem rõ; trên desktop, Canvas tăng theo chiều rộng và chiều cao viewport. Bảng triệu hồi tăng kích thước pháp luân, chữ, ô nhập và nút theo viewport. Bố cục dọc tiếp tục xếp tầng và cho phép cuộn trang.
17. Thông báo sự kiện không hiển thị nội dung ngẫu nhiên về dị tượng/trở ngại hoặc hiệu ứng. Khi đang đua, chỉ thông báo người dẫn đầu khi người dẫn đầu thay đổi; khi có người về đích, hiển thị thứ hạng và tên người đó trước, sau đó tiếp tục thông báo người dẫn đầu mới.
