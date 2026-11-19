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
  `core.js`, `scenery.js`, `audience.js`, `race-render.js`, `visual-overrides.js`, `music.js`, `race-logic.js`, `journey-world.js`, `i18n.js`, `tournament.js`.
- Dữ liệu cấu hình nằm trong `data/characters.json`, `data/swords.json`, `data/effects.json`, `data/summoning.json`, `data/ceremony.json`, `data/scenery.json`.
- `GAME_CONFIG.md` ghi nhận các thiết lập gameplay/UI, giá trị mặc định, giới hạn, nguồn thực thi và nguyên tắc cân bằng; phải cập nhật cùng khi thay đổi thiết lập.
- `core.js`: biến và tiện ích lõi.
- `scenery.js`, `audience.js`: cảnh quan, kiến trúc và khán giả.
- `race-render.js`: dựng cảnh đua và camera.
- `visual-overrides.js`: các hiệu chỉnh/ghi đè hình ảnh; có thể có nhiều định nghĩa cùng tên.
- `music.js`: âm nhạc.
- `race-logic.js`: triệu hồi, trạng thái đua, thứ hạng, về đích, Tiên Bảng và vòng lặp animation.
- `i18n.js`: ngôn ngữ.
- `tournament.js`: nghi thức khai mạc Đại hội Tông Môn và lời bình trực tiếp; chỉ điều phối giao diện, không thay thế logic đua hoặc nghi thức trao thưởng Canvas.
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
17. Thông báo sự kiện không hiển thị nội dung ngẫu nhiên về dị tượng/trở ngại hoặc hiệu ứng. Khi đang đua, chỉ thông báo người dẫn đầu khi người dẫn đầu thay đổi; khi có người về đích, xếp hàng thông báo thứ hạng và tên theo đúng thứ tự về đích, hiển thị hết các thông báo này trước rồi mới tiếp tục thông báo người dẫn đầu mới.

18. Tiên Bảng phải giữ ba cột riêng biệt Hạng, Tiên nhân và Thời gian; ô thời gian phải đủ chỗ cho định dạng `MM:SS:mmm`. Không dùng `min-width:max-content` cho ô hạng trong bảng có `table-layout:fixed`; tên dài phải ellipsis trong cột tên, không đẩy tràn cột thời gian.
19. Thiên Lý Kính phải giữ bố cục và phong cách hiển thị đang có; không tự ý chia hàng, thêm nhãn hoặc đổi cách sắp xếp. Chỉ co chữ, ellipsis hoặc tự xuống dòng khi thật sự cần để chữ/ảnh/nút không tràn khỏi khung. Tên hiệu ứng hiển thị trực tiếp, không thêm tiền tố “Hiệu Ứng:”.
20. Trên mọi bố cục ngang từ 600px, nút Chạy và Dừng phải nằm trong hàng điều khiển riêng bên dưới Canvas trường đua, canh giữa theo chiều ngang của cột game. Nền, viền, bóng và backdrop của vùng chứa nút phải trong suốt; chỉ từng nút có nền riêng. Không để nút phủ Canvas hoặc che chữ TOP 1 trong nghi thức trao thưởng.
21. Khi `.game-setup` có trạng thái `.is-minimized`, chỉ được hiển thị thanh tiêu đề và nút mở rộng; ẩn toàn bộ pháp luân, ô nhập danh sách, thông báo và nội dung còn lại trên mọi kích thước màn hình.

18. Khi chỉnh giao diện ngang, phải giữ Canvas, Thiên Lý Kính và Tiên Bảng trên cùng một hàng; thanh điều khiển nằm ở hàng riêng bên dưới Canvas, không được phủ lên nội dung Canvas hoặc cảnh trao thưởng. Hai nút Chạy/Dừng phải cân đối quanh tâm, không có dock nền che cảnh và phải tôn trọng thuộc tính `hidden`.
19. Giữ nguyên bố cục Thiên Lý Kính; chỉ xử lý co chữ, ellipsis hoặc xuống dòng khi nội dung có nguy cơ tràn viền. Không tự ý thêm nhãn “Hiệu Ứng:” hay đổi vị trí các thành phần. Khi có hiệu ứng, hiển thị đúng tên lấy từ `effectName`.
20. Tiên Bảng phải cố định bề rộng từng cột Hạng/Tiên nhân/Thời gian, cho phép tên dài rút gọn, thời gian `MM:SS:mmm` luôn nằm gọn trong cột; không tạo cuộn ngang hoặc tràn panel. Khi thu nhỏ bảng triệu hồi, chỉ giữ thanh tiêu đề và nút mở lại; ẩn toàn bộ pháp luân, vùng nhập tên, thông báo và nội dung phụ trên mọi kích thước màn hình.


22. Không còn các mốc sự kiện đường đua 24% / 53% / 78%; không được khôi phục cấu hình, cổng hình ảnh, hiệu ứng tăng/giảm tốc hoặc logic kích hoạt riêng cho ba mốc này. Các hiệu ứng ngẫu nhiên thông thường, thiên phú và Photo Finish vẫn hoạt động độc lập. Thiên phú chỉ tạo chênh lệch nhỏ, không phá cân bằng; Photo Finish chỉ nhận diện thời điểm về đích đã chốt, không sửa thứ hạng hoặc thời gian kết quả.


23. Danh sách thiên phú được khai báo trong logic tạo tiên nhân phải giữ ID duy nhất, tên hiển thị không trùng và hệ số cộng thêm nhỏ trong giới hạn cân bằng đã ghi ở `GAME_CONFIG.md`. Ngoại lệ: Thần Sầu chỉ có thể chất `Bún Chua Cay Thánh Thể`, không được gán hoặc hiển thị bất kỳ thiên phú/thể chất nào trong danh sách luân phiên. Khi mở rộng thiên phú, phải cập nhật tài liệu cấu hình và cache script tương ứng; không tự ý đổi bố cục giao diện nếu người dùng chỉ yêu cầu thêm nội dung gameplay.

24. Không tạo cổng hoặc mốc sự kiện trang trí trên đường đua tại 24% / 53% / 78%. Chỉ bốn vết nứt không gian chuyển cảnh giới ở 20% / 40% / 60% / 80% được phép hiển thị; chỉ vẽ khi `started=true` sau countdown, không hiện trong trạng thái setup/triệu hồi/countdown. Cổng kế tiếp phải xuất hiện ngay sau khi cổng trước biến mất, không giới hạn chỉ trong vùng 4% trước mốc; khi tiên nhân chạm/vượt mốc, cổng đó biến mất và cổng tiếp theo xuất hiện. Khi qua cổng phải hiện rõ tên đầy đủ cảnh giới mới.

25. Khi tối ưu hiệu năng cuộc đua đông nhân vật (tối đa 100), phải giới hạn ngân sách hạt toàn cục và giảm số hạt mỗi lần kích hoạt theo quy mô; không tạo burst riêng lớn cho từng nhân vật. Ưu tiên cập nhật/lọc hạt tại chỗ, tránh cấp phát mảng mỗi frame. Từ ngưỡng đông người, chuyển hiệu ứng trang trí quanh nhân vật sang chế độ nhẹ nhưng giữ nguyên logic gameplay, tốc độ, thời lượng và trạng thái hiệu ứng. Phải kiểm tra cú pháp, cache và trường hợp 100 nhân vật.


26. Bản đồ hành trình có thể gồm nhiều vùng cảnh quan nhưng cuộc đua vẫn liên tục: không reset tiến độ, không đổi quãng đường hoặc thời lượng; hiệu ứng cổng được phép thay đổi hệ số vận tốc trong giới hạn cấu hình, từ đó ảnh hưởng tự nhiên đến thứ hạng nhưng không trực tiếp sửa thứ hạng. Cảnh gốc phải được giữ nguyên từ đầu game đến khi vượt cổng đầu tiên ở 20%; chỉ sau khi vượt từng cổng 20% / 40% / 60% / 80% mới bắt đầu crossfade sang cảnh giới tiếp theo. Crossfade phải thay thế thực sự lớp trời/sơn mạch: chụp cảnh gốc trước khi vẽ lớp cảnh giới, xóa vùng nền cũ rồi hòa trộn hai cảnh với alpha bổ sung nhau; không để cảnh nền đầu tiên hiện xuyên qua các cảnh sau. Thời gian hòa trộn cấu hình 6% tiến độ sau cổng. Không vẽ lớp cảnh quan/công trình của cảnh giới kế tiếp trước khi qua cổng. Riêng vết nứt của cổng kế tiếp chỉ được hiển thị sau khi `started=true`, tức đếm ngược 3 giây đã kết thúc; tuyệt đối ẩn trong setup, triệu hồi và countdown. Chỉ bốn cổng cảnh giới 20% / 40% / 60% / 80% dùng tạo hình vết nứt không gian; luôn hiện cổng kế tiếp ngay sau khi cổng trước biến mất, không giới hạn trong 4% tiến độ trước mốc; khi nhân vật chạm/vượt mốc thì cổng hiện tại biến mất và cổng kế tiếp xuất hiện ngay. Khi qua cổng phải hiển thị rõ tên đầy đủ cảnh giới mới. Xóa hoàn toàn ba mốc 24% / 53% / 78%, bao gồm cả hiệu ứng tốc độ và logic gameplay gắn với chúng. Thiên Lý Kính phải thay nền theo đúng cảnh giới hiện tại và cùng tiến độ crossfade với Canvas chính, không chỉ phủ tint lên nền camera cũ. Khi một tiên nhân vượt cổng, xóa hiệu ứng đang chạy và hiệu ứng đang chờ; áp dụng hiệu ứng riêng của cổng, đồng thời có 95% cơ hội nhận thêm hiệu ứng cá nhân tốt/xấu theo `positionGoodChance` trong `effects.json` (top 42%, giữa 50%, cuối 58%), 5% không nhận hiệu ứng cá nhân. Hiệu ứng cổng và cá nhân nhân hệ số với nhau, clamp theo `speedLimits`; hiệu ứng cá nhân dùng tier, thời lượng và khoảng hệ số đã cấu hình. Chuyển cảnh vẽ ở lớp sau nhân vật, không thêm timer/listener/particle riêng. Khi tối ưu cho tối đa 100 nhân vật, chỉ lấy tiến độ xa nhất bằng một vòng lặp tuyến tính và chỉ vẽ tối đa hai vùng trong lúc crossfade sau cổng. Các cảnh giới phải có mật độ chi tiết rõ rệt, có chiều sâu nhiều lớp và chuyển động liên tục theo thời gian render: Vân Hải có ít nhất bốn tầng mây cuộn ngược chiều, thiên nhãn mây, nhiều đảo tiên và thác mây; Kiếm Vực có ít nhất sáu chủng kiếm với lưỡi dài rõ rệt, kiếm sơn và kiếm trận; Lôi Vực có khối siêu mây đen dữ dội, gió xoáy, mưa xiên và sét dài phân nhánh; Thiên Cung là quần thể nhiều điện, thiên môn, cầu nối, vườn/hồ và đại điện trang trí tinh xảo. Bảng màu toàn cảnh phải dịu, tránh trắng gắt, glow lớn và cộng sáng additive; crossfade dùng source-over để không làm cảnh chói lóa. Không dùng vài vật thể lẻ tẻ để đại diện cho cả cảnh giới. Canvas phải tối ưu cho tối đa 100 nhân vật, không thêm timer/RAF/listener riêng. Lớp cảnh giới phải nằm trong tầng trời/sơn mạch, không được che Chưởng Môn hoặc nghi thức ở quảng trường tiền cảnh.


27. Bố cục Vân Hải không dùng các vòng xoắn/vòng elip đồng tâm gây rối mắt; ưu tiên tầng mây ngang, vân đài, cầu mây, đảo tiên và thác mây có khoảng thở. Kiếm Vực phải phân bổ kiếm theo cụm và lớp cao độ, giữ khoảng trống để đọc rõ cảnh; kiếm bay, kiếm cắm và kiếm trung tâm dùng tỷ lệ vừa phải, không phóng lớn hoặc chồng dày. Khi chỉnh mật độ, phải giữ được cảm giác Vạn Kiếm nhưng không để kiếm che kín cảnh hoặc lấn át nhân vật.


28. Các thiên phú/thể chất của tiên nhân phải có dấu hiệu hình ảnh dễ nhận biết ngay trên nhân vật trong Canvas chính; dấu hiệu dùng mã ngắn, màu riêng theo ID, kích thước gọn và không che mặt/kiếm. Thiên Lý Kính phải hiển thị đầy đủ tên thể chất của nhân vật đang được chiếu. Không thay đổi hệ số thiên phú hoặc logic gameplay khi chỉ bổ sung cách quan sát.
29. Tiêu đề tên cảnh giới sau khi qua cổng phải luôn đọc được trọn vẹn. Banner thông báo người dẫn đầu/về đích không được vẽ đè lên tiêu đề cảnh giới; phải giữ hai vùng hiển thị tách biệt theo tọa độ Canvas và kiểm tra thứ tự render.


30. Thiên Lý Kính phải sắp xếp thông tin thành các hàng rõ ràng, không chồng chéo: hạng và tên ở hàng đầu; tốc độ/thời gian hiệu ứng ở hàng riêng; tên thể chất (không có tiền tố “Thể chất:”) và tên hiệu ứng ở hàng thông tin phụ. Màn hình camera nằm dưới cùng của khung, chiếm phần diện tích còn lại. Hệ số tốc độ và thời gian hiệu ứng cùng màu: xanh lá khi tăng tốc, đỏ khi giảm tốc. Chỉ thay đổi cách trình bày, không thay đổi cách chọn nhân vật được chiếu hay gameplay.


31. Thiên Lý Kính dùng đúng ba hàng thông tin: (1) hạng canh trái và tốc độ/thời gian canh phải trên cùng hàng; (2) tên nhân vật canh giữa; (3) tên thể chất và tên hiệu ứng cùng hàng, canh giữa và chỉ phân cách bằng khoảng trống, không chèn dấu. Canvas nằm dưới phần thông tin, neo đáy panel và chiếm phần còn lại. Dấu hiệu thể chất trên nhân vật không dùng huy hiệu lớn; chỉ dùng dấu màu nhỏ cạnh pháp bảo để không che mặt/tên. Số tốc độ và giây còn lại phải cùng màu xanh lá khi tăng, đỏ khi giảm. Không thay đổi lựa chọn camera hoặc gameplay.

32. Vòng nét đứt quanh nhân vật biểu thị hiệu ứng cá nhân phải được bỏ khỏi phần vẽ; không xóa trạng thái, xác suất, thời lượng, hệ số hoặc hiệu ứng gameplay liên quan. Thiên Lý Kính phải có khung hiển thị cố định trong panel: thông tin không được đẩy Canvas tràn hoặc làm panel vượt kích thước; hạng/tốc độ cùng hàng, tên nhân vật một hàng, tên thể chất và tên hiệu ứng ở hai hàng riêng. Mỗi hàng chữ phải co/ellipsis trong chiều rộng khả dụng. Tiên Bảng tiếp tục chứa toàn bộ danh sách và cuộn dọc; vùng nhìn nên hiển thị xấp xỉ 10 hạng cùng lúc trên thiết bị thông thường.

33. Trong Thiên Lý Kính, tên hiệu ứng phải được căn giữa độc lập theo toàn bộ chiều rộng khả dụng của panel; không bị lệch theo vị trí hoặc độ rộng của tên thể chất ở hàng bên cạnh. Nếu tên thể chất trống, tên hiệu ứng vẫn phải nằm chính giữa. Không thêm nhãn hoặc ký tự trang trí.


34. Tài nguyên nhân vật đặc biệt phải đặt trong `assets/characters/<character-id>/`, dùng ID ASCII chữ thường nối bằng dấu gạch ngang. Mỗi nhân vật có `README.md`, sprite sheet `<character-id>-spritesheet.png` và frame riêng trong `frames/<character-id>-00.png`, `-01.png`, ...; giữ kích thước canvas frame đồng nhất và nền trong suốt. Không kích hoạt nhân vật trong gameplay khi ảnh chưa được đưa vào repository và bộ nạp/render sprite chưa được tích hợp, kiểm tra.


35. Thần Sầu là nhân vật huyền thoại dùng sprite sheet tại `assets/characters/than-sau/than-sau-spritesheet.png`, bố cục 5 cột × 2 hàng (10 frame), dùng chung hàm `drawRacer` cho Canvas chính và Thiên Lý Kính. Nhập thủ công một trong các bí danh Shen, Sầu, Trần Đạt Thọ, Thần Sầu, 神愁 phải tạo đúng nhân vật Thần Sầu. Khi triệu hồi ngẫu nhiên, xác suất xuất hiện tăng theo số lượng trong lượt, tối đa một Thần Sầu mỗi lượt; không ảnh hưởng số lượng nhân vật, tốc độ hoặc cân bằng các nhân vật khác. Nếu sprite chưa tải được, phải fallback về renderer hiện tại.


36. Thần Sầu sở hữu Bún Chua Cay Thánh Thể. Tạo hình sprite luôn có tô bún cầm tay; khi kích hoạt tuyệt chiêu phải có trạng thái ăn bún/khói cay nhìn thấy được. Tuyệt chiêu tự kích hoạt theo cooldown trong cuộc đua, tăng tốc ×1.20 trong 3.5 giây, cooldown 11.5 giây; chỉ áp dụng cho Thần Sầu, không làm thay đổi bộ hiệu ứng chung của các tiên nhân khác. Tên thể chất hiển thị là “Bún Chua Cay Thánh Thể”, tên tuyệt chiêu/hiệu ứng khi buff là “Ăn Bún Chua Cay”.


37. Thiên Lý Kính và Tiên Bảng phải có kích thước panel đồng bộ, độc lập với số lượng hàng Tiên Bảng. Danh sách Tiên Bảng cuộn bên trong vùng có chiều cao cố định; không được để số tiên nhân làm tăng chiều cao grid hoặc ép Thiên Lý Kính co nhỏ. Trên landscape hai panel lấp đầy cùng một hàng; trên portrait dùng cùng một chiều cao panel phù hợp viewport. Khi trao thưởng, Thần Sầu phải có tay áo/cánh tay/bàn tay nối liền thân và tư thế thực sự ôm hộp quà; không dùng hai cánh tay giả dạng nét thẳng hoặc bàn tay rời.


38. Trong Thiên Lý Kính, tên thể chất và tên hiệu ứng phải được căn giữa độc lập trên toàn bộ chiều rộng hàng của từng dòng. Khi nội dung dài, tự động giảm cỡ chữ theo chiều rộng thực tế; chỉ dùng ellipsis khi đã chạm cỡ chữ tối thiểu mà vẫn không thể hiển thị hết. Không để hai dòng lệch tâm hoặc đẩy tràn panel.


39. Thần Sầu dùng sprite riêng nhưng không được làm mất hệ thống hoạt ảnh hiệu ứng chung. Khi có bất kỳ effectType hợp lệ nào, sprite phải thể hiện đồng thời động tác cơ thể phù hợp và dấu hiệu hiệu ứng nhìn thấy rõ trên Canvas chính lẫn Thiên Lý Kính; khi camera focus nhân vật đang có hiệu ứng phải ưu tiên chiếu nhân vật đó. Nếu sprite không tải được, tiếp tục fallback renderer chung. Nhập thủ công tên có chứa chuỗi “Sầu” hoặc “Shen” (không phân biệt hoa thường/dấu tiếng Việt) đều quy về đúng một nhân vật “Thần Sầu”; vẫn giữ bí danh Trần Đạt Thọ và 神愁.


40. Thần Sầu chỉ sở hữu duy nhất thể chất “Bún Chua Cay Thánh Thể”. Trong mọi đường tạo tiên nhân/triệu hồi, kể cả wrapper gán thiên phú chạy sau createRacer, phải giữ nguyên thể chất này; không được ghi đè bằng bất kỳ thiên phú luân phiên nào. Các tiên nhân khác tiếp tục nhận thiên phú như hiện tại.


41. Nhân vật huyền thoại dùng sprite riêng nhưng toàn bộ hiệu ứng phải tái sử dụng cùng logic tạo tư thế và cùng lớp hiệu ứng Canvas của tiên nhân thường. Không tạo bản vẽ rút gọn riêng cho từng effectType; phải rà soát đủ các nhóm, đặc biệt formation/Tụ Linh Trận, shadow_step/Ảnh Độn, kiếm trận, phù chú, lôi, thân pháp, suy yếu và va chạm. Áp dụng nhất quán trên Canvas chính và Thiên Lý Kính; chỉ lớp sprite/đạo cụ đặc trưng được phép khác.
42. Lớp cảnh giới trong journey-world.js chỉ được phủ vùng trời/núi phía trên đến y=480; không xóa hoặc vẽ đè vùng linh quang/bảo vật Chưởng Môn và dòng sông phía dưới. Mọi cảnh Vân Hải, Kiếm Vực, Lôi Vực và Thiên Không phải giữ nguyên vùng bảo vệ này.


43. Thần Sầu tuyệt đối không được vẽ đè cánh tay, ống tay áo hoặc bàn tay giả bằng Canvas, kể cả trong cảnh nhận thưởng. Tay phải lấy nguyên từ các frame pixel gốc của sprite sheet; chỉ được vẽ đạo cụ/hộp quà và hiệu ứng xung quanh, không vẽ bộ phận cơ thể giả.

44. Khi bảng Triệu Hồi có trạng thái `.is-minimized`, thanh tiêu đề phải được ghim tuyệt đối bên trong vùng trường đua, không được định vị theo Thiên Lý Kính hoặc Tiên Bảng. Trên landscape 600–999px, cạnh phải thanh phải nằm trong cột Canvas và chừa hàng điều khiển phía dưới; trên desktop landscape cũng nằm trong cột Canvas, phía trên hàng Chạy/Dừng; trên portrait nằm ở góc phải phía trên của vùng game. Phải ghi đè các giá trị top/right/bottom/left cũ tại cuối stylesheet để không bị lệch khi xoay màn hình hoặc đổi breakpoint.


45. Tuyệt chiêu “Ăn Bún Chua Cay” phải có hoạt ảnh hành động rõ ràng: Thần Sầu đưa tô lên sát miệng, nghiêng tô và thể hiện sợi bún/nước dùng chảy vào miệng trong nhịp ăn; không chỉ nâng tô hoặc tạo khói. Tô bún phải được vẽ chi tiết, có tô sứ/viền men, nước dùng đỏ cam, sợi bún, cà chua, thịt, rau thơm, ớt và hơi nóng; giữ phong cách pixel-art, kích thước dễ đọc trên Canvas chính và Thiên Lý Kính. Không thay đổi hệ số ×1.20, thời lượng 3.5 giây hoặc cooldown 11.5 giây.


46. HUD thời gian, thông báo sự kiện/kết thúc và tên cảnh giới phải nằm trên ba hàng riêng trong vùng trời phía trên đường đua: thời gian ở hàng đầu, thông báo ở hàng thứ hai, tên cảnh giới ở hàng thứ ba; đáy tên cảnh giới phải nằm trên TRACK.top, không được đè lên làn đua. Kích thước chữ tự tăng vừa phải trên viewport hẹp dựa theo chiều rộng Canvas hiển thị; hộp nền phải co theo nội dung và không tràn mép. Font Canvas và giao diện phải dùng fallback Unicode hỗ trợ tiếng Việt có dấu và chữ Trung trên iOS/Safari; mọi chuỗi HUD, thông báo, tên cảnh giới và tên hiệu ứng phải đi qua hệ thống dịch khi đổi ngôn ngữ.


47. Sprite sheet Thần Sầu phải luôn giữ trục thẳng đứng; hiệu ứng chỉ được dịch chuyển/tạo tư thế, không xoay toàn bộ khung pixel gây cảm giác ảnh bị nghiêng và lấn đường đua. Mỗi nhân vật khi vẽ trên Canvas chính phải được cô lập trạng thái save/restore; lỗi của một nhân vật không được làm hỏng transform của đường đua hoặc các nhân vật khác. Toàn bộ render phải khôi phục Canvas bằng finally kể cả khi scenery, nhân vật, camera hoặc cảnh kết thúc phát sinh lỗi. Thiên Lý Kính cũng phải cô lập lỗi vẽ nhân vật. Không thay đổi gameplay, thứ hạng, tốc độ hoặc thời lượng hiệu ứng.


48. Khi Thần Sầu kích hoạt “Ăn Bún Chua Cay”, renderer không được dùng nhánh hiệu ứng boost để vẽ Du Long Bộ. Tô bún, dòng bún/nước dùng nối từ tô lên miệng, hơi nóng và điểm sáng ớt phải được vẽ ở lớp trên cùng để không bị hiệu ứng khác che khuất. Hiệu ứng Du Long Bộ vẫn giữ nguyên cho các lượt boost không phải Ăn Bún Chua Cay. Không thay đổi hệ số, thời lượng hoặc cooldown gameplay.


49. Pháp bảo Long Tuyền Ngọc Hồ và dòng linh thủy phát ra từ nó không được vẽ trong hàm phong cảnh nền dùng chung. Khi đổi cảnh giới, không để lại vòi nước/dòng nước từ pháp bảo ở cảnh không có pháp bảo. Sông, thác và dòng chảy tự nhiên của từng cảnh vẫn được giữ nguyên.


50. Tuyệt chiêu Bún Chua Cay của Thần Sầu phải được nhận diện bằng trạng thái nhân vật/đồng hồ tuyệt chiêu, không phụ thuộc duy nhất vào chuỗi effectName có thể bị dịch hoặc thay đổi. Mọi nhánh vẽ Du Long Bộ phải loại trừ Thần Sầu; khi thanSauEatingTimer còn hiệu lực phải hiện tô bún, động tác ăn và dòng bún/nước dùng. Không thay đổi boost ×1.20, thời lượng 3.5 giây hoặc cooldown 11.5 giây.

51. Nhạc mở đầu ở phase `setup` phải phát từ `assets/music/setup.mp3` khi file đã có trong repository; giữ nguyên nhạc `race` và `award` nếu người dùng chỉ yêu cầu thay nhạc mở đầu. Khi đổi nguồn script `music.js`, phải tăng cache-busting tương ứng trong `data-loader.js`; không tự đổi cơ chế unlock, chuyển phase, fade, loop hoặc nút bật/tắt.


52. Giai đoạn hoàn thiện bố cục tiên môn: kiến trúc chính điện và các lầu các phải có phân cấp kích thước rõ, nhiều lớp hậu/trung/tiền cảnh, biển hiệu đọc được và khoảng cách không chồng mái. Sông giữ một lòng liên tục; vân mặt nước chuyển động chậm, đều, không lấn át cảnh. Khán đài giữ đúng số lượng và đội hình hiện hành, phân biệt tạp dịch/ngoại môn/nội môn/nòng cốt/thân truyền/trưởng lão bằng màu đạo bào, phụ kiện và linh quang; không đặt nhãn chữ phủ lên đầu hoặc thân nhân vật. Không đổi gameplay, thứ hạng, tốc độ hoặc thời lượng hiệu ứng.


53. Nút bảng Triệu Hồi khi thu nhỏ phải bỏ toàn bộ chữ và chỉ hiển thị nút pháp trận tròn có thể nhận biết, có vùng chạm đủ lớn và trạng thái focus rõ. Giữ nguyên vị trí neo responsive hiện hành trong khung game ở portrait, landscape điện thoại và desktop; không để panel hoặc nút trôi sang Thiên Lý Kính/Tiên Bảng. Khi mở rộng, tiêu đề và nút thu nhỏ thông thường vẫn hoạt động như trước. Không thay đổi logic triệu hồi.


54. Biểu tượng nút Triệu Hồi thu nhỏ phải là một thanh kiếm tiên dài, dễ nhận biết ngay ở kích thước nút trên điện thoại. Lưỡi kiếm phải chiếm phần lớn chiều cao biểu tượng; hộ thủ, chuôi và chóp chuôi phải phân biệt rõ, có chi tiết kim loại/ngọc cao cấp. Không dùng hình sao, pháp trận hoặc thanh kiếm quá ngắn làm chủ thể. Giữ nguyên nút tròn, kích thước, vị trí neo responsive, vùng chạm và hành vi mở bảng; không thay đổi logic triệu hồi.

 
55. Nút thu nhỏ của bảng Triệu Hồi luôn là dấu “−” nằm trên thanh tiêu đề khi bảng đang mở. Không gắn biểu tượng kiếm vào nút này. Khi thu nhỏ, ẩn toàn bộ panel và hiển thị một nút trường kiếm riêng tại góc phải vùng game; nút kiếm chỉ có nhiệm vụ mở lại bảng. Nút kiếm phải nằm ngoài panel để không bị định vị theo nút “−”, giữ neo responsive trong cột game ở portrait/landscape/desktop. Không thay đổi nút khai trận hoặc logic triệu hồi.


56. Nút mở lại bảng Triệu Hồi phải là trường kiếm đặt trong pháp trận triệu hồi hoàn chỉnh: có vòng trận, đường phù văn, các điểm linh lực và ánh sáng ngọc/vàng bao quanh kiếm. Nút phải được định vị theo góc phải-dưới của chính Canvas trường đua, không căn theo toàn bộ khung arena hoặc các panel Thiên Lý Kính/Tiên Bảng; khi đổi kích thước, xoay màn hình hoặc thay đổi tỷ lệ Canvas, nút vẫn bám đúng góc Canvas. Nhấn nút mở lại bảng Triệu Hồi; dấu “−” trên tiêu đề và nút khai trận bên trong pháp luân giữ nguyên chức năng.


57. Nút trường kiếm khi bảng Triệu Hồi thu nhỏ phải nằm ở góc phải-bên trong của chính vùng game, neo theo hình học layout của Canvas và không trôi sang các panel bên cạnh hoặc ra ngoài game. Khi bảng Triệu Hồi mở, biểu tượng trường kiếm trong pháp trận được đưa vào nút khai trận ở tâm pháp luân bên trong bảng. Phải giữ nguyên hai vòng xoay, giá trị/thời lượng, trình chỉnh sửa, nút xoay và toàn bộ thông số/cơ chế triệu hồi; chỉ thay diện mạo nút trung tâm, không thay đổi logic.


58. HUD đếm ngược trên Canvas chỉ hiển thị giá trị thời gian, không có nhãn “THỜI GIAN”. Khi bảng Triệu Hồi thu nhỏ, nút trường kiếm nằm ở góc phải-phía trên bên trong Canvas, kích thước 48 đơn vị Canvas (lớn hơn nhẹ so với HUD cao 42 đơn vị), quy đổi theo kích thước hiển thị và bám theo Canvas khi resize/xoay màn hình. Không để nút che đồng hồ hoặc vùng cổng đích.


59. Kiến trúc tiên môn giữ ba hàng hậu cảnh/trung cảnh/tiền cảnh xen kẽ, bố trí cân xứng qua trục x=550. Các cặp lầu hai bên phải có khoảng cách tương ứng; giữ vùng an toàn trước trụ cổng đích gần x=964, không để mái hoặc biển hiệu vượt vào vùng này. Biển hiệu nằm sát phía trên mái, không cách xa công trình. Nút Triệu Hồi thu nhỏ dùng 48 đơn vị Canvas và quy đổi theo tỷ lệ Canvas bằng JavaScript; CSS chỉ dùng biến --summon-launcher-size, không cố định kích thước CSS.


60. Tiên Bảng phải giữ toàn bộ danh sách thứ hạng; vùng nhìn mặc định hiển thị khoảng 10 vị trí đầu và cuộn dọc bên trong để xem các vị trí còn lại. Không cắt dữ liệu ở Top 10. Thiên Lý Kính và Tiên Bảng phải có cùng chiều cao panel trên mọi hướng màn hình. Tên thiên phú và tên hiệu ứng trong Thiên Lý Kính nằm trên cùng trục giữa; căn giữa cả phần tử lẫn chữ, không để padding hoặc text-indent làm lệch.


## 59. Tiên Bảng cuộn đủ danh sách và đồng bộ khung Thiên Lý Kính
- Tiên Bảng không được cắt mảng thứ hạng ở 10 phần tử. Phải giữ toàn bộ danh sách theo thứ tự hiện hành; vùng nhìn chỉ cao tương đương tiêu đề và khoảng 10 hàng, cuộn dọc bên trong để xem các hạng tiếp theo.
- Trên bố cục dọc, Thiên Lý Kính và Tiên Bảng có cùng chiều cao panel. Trên bố cục ngang, hai panel tiếp tục kéo giãn bằng nhau theo hàng bố cục.
- Tên hiệu ứng #leaderEffect phải được căn giữa bằng cả CSS và luồng cập nhật thông tin; không để kiểu chữ nội tuyến làm lệch trục.


## 61. Mặt trời và nhãn tên cảnh giới trên trường đua
- Mặt trời của cảnh chính đặt lệch trái khỏi cụm lầu các bên phải và cao hơn đường mái; giữ quầng sáng vừa phải, không để kiến trúc che phần tâm mặt trời.
- Bảng tên cảnh giới xuất hiện dưới HUD thông báo, tại vùng trống giữa thông báo và làn đua đầu tiên. Thu gọn chiều cao bảng và cỡ chữ; không chồng lên đồng hồ đếm ngược hoặc thông báo sự kiện.


62. Footer chỉ giữ phần ghi nhận tác giả; không hiển thị chú thích/attribution nhạc ở cuối trang. Các nút `.window-minimize` của Thiên Lý Kính và Tiên Bảng phải hiển thị `−` khi panel mở, chuyển thành `+` khi panel thu nhỏ; khi mở lại phải đổi về `−`. Đồng bộ `textContent`, `aria-expanded`, `aria-label` và `title` theo cùng trạng thái.


63. Mở rộng vùng bay phải đồng bộ với chiều cao Canvas, giữ tỷ lệ hiển thị đúng theo kích thước nội tại và không kéo méo nhân vật. Khoảng bay dọc phải tăng nhưng vẫn chừa khoảng trống với nhãn khán đài; cổng đích kéo xuống theo đáy đường đua. Nút Triệu Hồi thu nhỏ dùng 52 đơn vị Canvas, quy đổi theo chiều cao Canvas thực tế và chừa khoảng an toàn bên phải để không che cổng đích. Tiên Bảng chỉ có vùng nhìn cao đúng tiêu đề + 10 hàng; danh sách còn lại cuộn bên trong. Thiên Lý Kính và Tiên Bảng dùng cùng chiều cao gọn 290px.


64. Tiên Bảng phải tự co chiều cao theo nội dung thực tế: tiêu đề + tối đa 10 hàng dữ liệu, không khóa chiều cao toàn panel 290px và không để khoảng trống lớn sau hạng 10. Vùng table-wrap chỉ có max-height 209px và cuộn dọc khi vượt quá 10 hàng; bảng không được ép min-height/height bằng vùng trống. Panel Thiên Lý Kính không bị kéo giãn theo chiều cao dư của Tiên Bảng.


65. Thiên Lý Kính là panel chuẩn kích thước: chiều cao dùng biến responsive chung, giới hạn theo viewport để vẫn đủ vùng thông tin và khung hình. Tiên Bảng phải dùng đúng cùng chiều cao đó; khi thay đổi chiều cao panel chuẩn thì cả hai cập nhật đồng bộ. Tiên Bảng cuộn toàn bộ thứ hạng bên trong, không làm panel cao thêm theo số hàng. Thiên Lý Kính luôn hiển thị tốc độ hệ số; khi có hiệu ứng tốc độ phải hiển thị cả thời gian còn lại tính bằng giây. Tăng tốc dùng màu xanh lá cho cả hệ số và giây, giảm tốc dùng màu đỏ; tốc độ bình thường dùng màu trung tính.


66. Nghi thức kết thúc: khi dựng cảnh nền quảng trường bằng `drawScenery()`, phải ẩn bản thể chưởng môn trong lớp khán đài trong toàn bộ giai đoạn rời ngai/chuẩn bị ngự kiếm; bản thể duy nhất được vẽ bởi `drawPodiumScene()`. Trong giai đoạn kiếm tiếp cận, không crossfade hai bản thể đứng và ngự kiếm chồng lên nhau. Chỉ chuyển sang `drawAwardMaster()` khi kiếm đã gần tới vị trí dưới chân; khi đó không vẽ thêm kiếm tiếp cận riêng vì sprite ngự kiếm đã chứa phi kiếm và đúng một Thái Cực Ngọc Luân. Giữ một chưởng môn và một vòng Thái Cực trong mọi frame; camera mini và Canvas chính không được làm thay đổi trạng thái ẩn/hiện toàn cục của lớp khán đài.


67. Thiên Lý Kính: hàng thông tin đầu phải bố trí Hạng canh trái, tốc độ và thời gian hiệu ứng canh phải trên cùng một hàng; không để các revision CSS cũ căn giữa ghi đè. Khung màn hình phải bao sát vùng Canvas, không để khoảng trống dọc hoặc viền khung bị hở; Canvas lấp đầy vùng hiển thị và không phát sinh thanh cuộn. Giữ nguyên ba hàng thông tin, màu tăng/giảm tốc và lựa chọn nhân vật đang được chiếu.


## 67. Dọn mã chết theo từng giai đoạn
- Chỉ xóa hàm khi đã rà soát toàn bộ repository và xác nhận không có lời gọi thực tế; không suy luận chỉ từ tên hoặc số lần xuất hiện.
- Không gộp/xóa các hàm trùng tên nếu chúng tham gia chuỗi wrapper, ghi đè có chủ đích hoặc được gọi động.
- Sau mỗi thay đổi JavaScript, kiểm tra cú pháp từng file và thứ tự nạp script; tăng cache version trong `data-loader.js` cho mọi script đã sửa.
- Cleanup phải giữ nguyên các hàm renderer cuối cùng đang hoạt động và không tự ý thay đổi bố cục/gameplay.


## 68. Dọn phong cảnh cũ — giai đoạn 2
- `visual-overrides.js` là nguồn renderer phong cảnh hiện hành cuối cùng. Khi dọn bản cũ, giữ nguyên định nghĩa cuối của `drawScenery`, `drawRiver`, `drawMountainRange`, `drawSpiritBirds`, `drawDenseForest`, `drawAmbientEnergy`, `drawRiverCurrent` và `drawSectArchitecture`.
- Giữ các primitive còn được renderer hiện hành gọi: `drawSky`, `drawMovingClouds`, `drawCloud`, `drawPine`, `drawSectPavilion` và `drawSectMountainLedge`. `drawTree` không có điểm gọi và đã được loại bỏ ở giai đoạn 4E.
- Các hàm dựng cảnh cũ chỉ được giữ nếu có điểm gọi từ renderer đang hoạt động; không giữ bản `drawScenery()` cũ trong `race-render.js` hoặc `scenery.js` khi nó đã bị ghi đè trước lúc vòng lặp game chạy.
- Sau khi dọn, kiểm tra cả thứ tự nạp script và mọi lời gọi cross-file; tăng cache version cho từng script đã thay đổi.


## 69. Hợp nhất renderer khán đài — giai đoạn 4A
- Chỉ giữ một `drawCrowd()` cuối cùng trong `visual-overrides.js`; các bản khai báo cũ trong `audience.js` và `visual-overrides.js` đã được loại bỏ.
- Chỉ giữ một `drawSpectator()` cuối cùng trong `visual-overrides.js`. Các bản cũ trong `audience.js` và bản ghi đè trung gian đã được loại bỏ.
- Chỉ giữ wrapper cuối cùng của `drawFormalSpectator()`, chuyển tiếp đến `drawSpectator()`; các renderer độc lập và wrapper trung gian đã bị ghi đè được loại bỏ.
- Giữ nguyên bố cục và phân cấp khán đài trong renderer cuối: tạp dịch, ngoại môn, nội môn, nòng cốt, chân truyền đệ tử, trưởng lão và chưởng môn. Không đổi số lượng, tọa độ, tỷ lệ, màu sắc hoặc logic nghi thức.
- `audience.js` vẫn giữ các helper dùng chung như `drawAura()` và `drawCrowdFlag()`. Cache version được tăng cho hai file JavaScript đã sửa.
- Đây là hợp nhất mã trùng lặp; không thay đổi gameplay.


## 70. Hợp nhất renderer nhân vật, HUD và nghi thức trao thưởng — giai đoạn 4B
- `visual-overrides.js` chỉ giữ renderer cuối cùng của `drawRacer()`, `drawRacingArtifact()`, `drawRaceHud()`, `drawAnnouncement()`, `drawPodiumScene()`, `drawAwardMaster()`, `drawMasterBaguaHalo()`, `drawCeremonySeatedMaster()`, `drawAwardThroneOnlyV2()`, `drawStandingSectMaster()` và `drawRacerName()`.
- Giữ nguyên `__drawRacerBaseThanSau()` làm renderer dự phòng cho `drawRacer()` khi sprite Thần Sầu chưa sẵn sàng hoặc nhân vật không dùng sprite; không xóa chuỗi hiệu ứng nhân vật.
- Giữ nguyên chuỗi nghi thức trao thưởng hiện hành: cảnh giải tán, chưởng môn đứng dậy, phi kiếm tiếp cận, chưởng môn ngự kiếm bay qua TOP 3, trao hộp thưởng, phản ứng nhận thưởng và khán đài.
- Loại bỏ hai bản `drawMasterBaguaAura()` không còn điểm gọi; hiệu ứng Thái Cực Ngọc Luân hiện hành vẫn được vẽ qua `drawMasterBaguaHalo()`.
- Chỉ hợp nhất khai báo bị ghi đè, không thay đổi thân renderer cuối cùng, dữ liệu nghi thức, mốc thời gian, tọa độ, kích thước, hiệu ứng hoặc gameplay.


## 71. Hợp nhất điều khiển cuộc đua và trạng thái — giai đoạn 4C
- `race-logic.js` chỉ giữ khai báo cuối cùng đang có hiệu lực cho `getInputNames()`, `summon()`, `setSettingsLocked()`, `syncButtons()`, `startRace()`, `togglePause()`, `resumeRace()`, `finishRace()`, `resetGame()`, `leaderOf()` và `stopRace()`; các bản cũ bị ghi đè đã được loại bỏ.
- Giữ nguyên `updateRace()`, `processFinish()`, `assignFinishTimes()`, `frame()`, `updateRanking()`, hàng đợi thông báo về đích/người dẫn đầu và logic khóa/mở khóa thiết lập.
- Giữ nguyên các wrapper nghi thức lưu renderer gốc: `summonOriginalDrawRacer`, `summonOriginalDrawRacerName`, `summonBaseDrawSpectator`; không thay đổi hiệu ứng hiện thân, tư thế chưởng môn/khán đài hoặc hiệu ứng triệu hồi theo đợt.
- `journey-world.js` vẫn được nạp sau `race-logic.js`; lớp chuyển cảnh tiếp tục đọc tiến độ thực tế và bọc renderer theo đúng thứ tự hiện hành.
- Không thay đổi công thức tốc độ, tiến độ, thời gian về đích, xác suất sự kiện, thời lượng đếm ngược, thứ hạng hoặc nhịp nghi thức. Cache `race-logic.js` tăng lên `v199`.


## 72. Wrapper render, camera Thiên Lý Kính và IIFE — giai đoạn 4D
- `race-render.js` chỉ giữ `drawCamera()` và luồng render; renderer `drawCameraBackground()` nền cũ đã bị thay thế hoàn toàn bởi bản trong `visual-overrides.js` nên được loại bỏ. Không thay đổi renderer camera đang hoạt động.
- Thứ tự lớp camera được giữ: `visual-overrides.js` định nghĩa nền camera hiện hành, sau đó `journey-world.js` bọc nền này để vẽ cảnh giới tương ứng; `drawCamera()` tiếp tục vẽ người dẫn đầu, tên và thứ hạng.
- `journey-world.js` vẫn được nạp sau `race-logic.js` và bọc các hàm gốc `createRacer()`, `startRace()`, `updateRace()`, `render()`. Giữ nguyên capture hàm gốc, cờ `realmPortalMask`, tiến độ dùng chung, crossfade năm cảnh giới, tiểu cảnh camera và bốn cổng hiệu ứng.
- IIFE trong `race-render.js`, `race-logic.js`, `journey-world.js`, `music.js` và `i18n.js` vẫn là các khối khởi tạo riêng được thực thi một lần theo loader tuần tự. Giữ các IIFE đang hoạt động và guard `dataset`; loại bỏ hai IIFE xoay màn hình cũ vì `index.html` không có `rotateView`, `rotateScreen`, `rotateHint`, nên chúng chỉ đăng ký khởi tạo rồi thoát mà không tạo chức năng hoặc handler.
- Chỉ loại bỏ renderer camera cũ đã chết; không thay đổi bố cục Thiên Lý Kính, cách chọn người dẫn đầu, chuyển cảnh, cổng hiệu ứng, gameplay hoặc nhịp render. Cache `race-render.js` tăng lên `v184`.


## 73. Helper tiện ích, particle và trạng thái không dùng — giai đoạn 4E
- Đã loại bỏ các helper không còn điểm gọi: `drawTree()`, `drawEnergyRings()`, `drawAudiencePlatform()`, `drawDiscipleSeats()`, `drawElderSeats()`, `drawMasterThrone()`, `drawTempleAuras()`, `drawGiftBox()` và `drawPlazaGate()`.
- Đã loại bỏ dữ liệu/biến không được đọc: `waterLines`, `eventMessages`, `miniAwardStart`, `miniMasterFlightDuration`, `masterGiftX` và biến cục bộ `returnStart`.
- Giữ nguyên particle đang hoạt động: `getParticleBudget()`, `addParticles()`, `updateParticles()`, `drawParticles()` và các điểm phát hạt trong hiệu ứng đua; giữ `drawAura()`, `drawCrowdFlag()`, `drawPine()`, `drawDenseForest()`, `drawAmbientEnergy()`, `drawRiverCurrent()` cùng các helper nghi thức/nhân vật đang được renderer gọi.
- Giữ nguyên `discipleCrowdLayout` dù hiện không có điểm đọc: IIFE khởi tạo của nó tiêu thụ số ngẫu nhiên ngay khi nạp `visual-overrides.js`; bỏ khối này sẽ dịch chuỗi `Math.random()` trước khi khởi tạo sao/mây và có thể làm thay đổi bố cục ngẫu nhiên hiện tại. Chưa loại bỏ để tránh thay đổi ngoài phạm vi.
- Cache các file JavaScript đã sửa được tăng trong `data-loader.js`. Không thay đổi thuật toán particle, mật độ khán đài hiện hành, hiệu ứng linh khí, tốc độ, thứ hạng hoặc thời lượng cuộc đua.


## 74. Dữ liệu cấu hình JSON và mặc định trùng lặp — giai đoạn 4F
- Đối chiếu sáu tệp JSON trong `data/` với toàn bộ JavaScript được nạp. Giữ các trường được đọc trực tiếp, đọc qua object/dynamic key hoặc destructuring.
- `data/swords.json`: `shapeCount` trở thành nguồn duy nhất quyết định số hình kiếm; bỏ `styleCount` vì không có renderer hay luồng nào đọc trường này.
- `data/effects.json`: bỏ các trường chính sách `sameEffect`, `oppositeEffect`, `oppositePolarity`, `antiBadLuck` vì chúng không được đọc; hành vi hiệu ứng hiện tại vẫn do `activateRaceEffect()` thực thi, không đổi quy tắc cộng dồn/thay thế.
- `data/ceremony.json`: dùng `awards.topCount` cho số vị trí được chọn thay vì khai báo cứng `3` trong renderer; giới hạn bố cục TOP 3 hiện có không thay đổi với giá trị cấu hình hiện tại.
- `race-logic.js`: chỉ tạo một danh sách thời lượng từ `summoning.durationOptions`, dùng chung cho hai select; bỏ mảng mặc định bị khai báo lặp.
- `journey-world.js`: dùng trực tiếp các giá trị bắt buộc trong `effects.balance` đã được nạp từ JSON, bỏ các số dự phòng trùng với cấu hình `.05`, `.5`, `.35/.4/.25`, `.75/1.25` và khoảng thời lượng `[2,5]`.
- Tăng cache version cho các JavaScript thay đổi. Không đổi giá trị cấu hình đang hoạt động, xác suất, tốc độ, thời lượng, thứ hạng, hiệu ứng hoặc hình ảnh.


## 75. Rà soát tài nguyên tĩnh — giai đoạn 4G
- Đối chiếu toàn bộ Git tree với `index.html`, `data-loader.js`, các JavaScript đang nạp và CSS. Tài nguyên nhị phân hiện có: sprite sheet Thần Sầu PNG (2,923,455 bytes) và nhạc mở đầu MP3 (1,694,112 bytes).
- Cả hai tài nguyên đều đang được tham chiếu thật: sprite sheet được renderer Thần Sầu dùng; MP3 được `music.js` dùng cho giai đoạn chuẩn bị. Không xóa, đổi tên, nén lại hoặc thay thế chúng trong đợt này để tránh thay đổi hình ảnh/âm thanh.
- Chuyển tải sprite sheet Thần Sầu sang lazy-load: chỉ yêu cầu PNG khi renderer gặp nhân vật có `isLegendaryThanSau`. Trước khi tải xong, renderer tiếp tục dùng nhân vật dự phòng hiện có; sau khi tải xong, sprite 5×2 và 10 frame hoạt động như trước. Người chơi không triệu hồi Thần Sầu sẽ không tải PNG gần 2.9 MB.
- `music.js` chỉ khởi tạo Audio khi có tương tác người dùng; giữ nguyên ba URL nhạc và cách phát hiện tại. Track setup dùng MP3 local; track race/award vẫn lấy từ URL bên ngoài.
- Xác nhận `script.js` là bản game cũ không được `index.html`, `data-loader.js`, CSS hay bất kỳ tệp đang tải nào tham chiếu. Xóa bản JS cũ này khỏi repository. Việc này giảm dung lượng lưu trữ repo, không làm giảm thêm request của trang vì file vốn không được tải.
- Giữ `assets/characters/than-sau/frames/.gitkeep`: đây là placeholder của thư mục frame riêng theo quy ước asset, không phải ảnh được tải.
- Không có PNG/JPG/WebP/GIF/MP4/WAV/OGG hoặc font local nào khác trong Git tree. CSS chỉ import Google Fonts từ xa. Tăng cache version cho `visual-overrides.js`.


## 76. Tỷ lệ Thiên Lý Kính và tên cảnh trong thông báo
- Canvas Thiên Lý Kính có kích thước nội tại 420×240, vì vậy vùng hiển thị phải giữ tỷ lệ 7:4 trên mọi bố cục.
- Khung `.camera-screen` không được flex-grow để lấp chiều cao dư của panel; Canvas dùng chiều cao tự động theo chiều rộng, không dùng `height:100%` hoặc `object-fit:fill`.
- Thông báo sự kiện và về đích thông thường không tự thêm tên cảnh giới. Tên cảnh chỉ xuất hiện trong thông báo riêng khi nhân vật đầu tiên vượt qua khe nứt tương ứng.


## 77. Cố định chiều cao Thiên Lý Kính theo nội dung
- Thiên Lý Kính không dùng chiều cao cố định bằng Tiên Bảng; panel tự ôm tiêu đề, thông tin và khung hình.
- `.camera-screen` và `#leaderCanvas` giữ tỷ lệ 7:4 theo kích thước nội tại 420×240. Khung hình không flex-grow để lấp chiều cao dư; phần nền trống dưới ảnh được loại bỏ.
- Panel vẫn giữ vị trí neo hiện tại trong arena; không thay đổi renderer nhân vật, cách chọn người dẫn đầu hoặc nội dung HUD.


## 78. Đồng bộ Tiên Bảng và thông báo vượt cảnh
- Tiên Bảng là panel chuẩn, có chiều cao tự nhiên cố định theo tiêu đề và vùng danh sách đủ 10 vị trí đầu; không lấy chiều cao từ Thiên Lý Kính.
- Vùng danh sách có chiều cao cố định đủ hiển thị hàng tiêu đề của bảng và 10 hàng xếp hạng; từ vị trí 11 trở đi cuộn bên trong, không làm panel hoặc arena cao thêm.
- Thiên Lý Kính nhận chiều cao thực tế của Tiên Bảng thông qua `ResizeObserver`; phần tiêu đề, thông tin và khung hình được căn giữa theo chiều dọc bên trong panel.
- Thông báo thông thường và thông báo về đích chỉ hiển thị nội dung gốc, không ghép tên cảnh giới.
- Mỗi khe nứt chỉ phát một thông báo tên cảnh khi nhân vật đầu tiên thực sự vượt qua; các nhân vật sau vẫn nhận hiệu ứng cổng riêng nhưng không spam thông báo lặp.


## 79. Tiên Bảng là chuẩn chiều cao cho Thiên Lý Kính
- Tiên Bảng luôn dành vùng nhìn cho 10 vị trí đầu; toàn bộ thứ hạng từ vị trí 11 trở đi nằm trong vùng cuộn dọc riêng. Chiều cao vùng cuộn được cố định đủ chứa hàng tiêu đề và 10 hàng dữ liệu, kể cả khi số người hiện tại ít hơn 10.
- Chiều cao tổng thể Tiên Bảng được quyết định bởi tiêu đề, padding và vùng danh sách 10 vị trí; không bị ép theo Thiên Lý Kính.
- `journey-world.js` quan sát Tiên Bảng bằng `ResizeObserver` và đặt chiều cao Thiên Lý Kính bằng đúng chiều cao Tiên Bảng.
- Các phần tử bên trong Thiên Lý Kính được căn giữa theo chiều dọc trong panel; khung Canvas vẫn giữ tỷ lệ 7:4, không kéo dãn hình ảnh.


## 80. Cố định Tiên Bảng đủ 10 vị trí
- Vùng cuộn Tiên Bảng cao cố định 242px, tính theo 11 hàng × 22px: một hàng tiêu đề cột và 10 hàng thứ hạng.
- Mỗi hàng của bảng có chiều cao 22px theo border-box; vị trí thứ 11 trở đi cuộn trong vùng này, không làm tăng chiều cao panel.
- Chiều cao tổng thể panel Tiên Bảng thay đổi theo vùng 242px mới; ResizeObserver hiện có tiếp tục đồng bộ Thiên Lý Kính theo panel.


## 81. Thông báo tên đầy đủ cảnh giới và căn chỉnh hai panel phụ
- Khi tiên nhân đầu tiên vượt qua khe nứt, thông báo chỉ hiển thị tên đầy đủ lấy từ `regions[index+1].name`; không thêm cụm “BƯỚC VÀO”. Mỗi khe nứt vẫn chỉ thông báo một lần.
- Sửa đúng lời gọi `installCameraPanelSync()` khi DOM đã sẵn sàng; `ResizeObserver` luôn theo dõi Tiên Bảng và đồng bộ cả `height`, `min-height`, `max-height` của Thiên Lý Kính theo kích thước border-box thực tế.
- Nội dung Thiên Lý Kính được căn giữa theo chiều dọc; canvas giữ tỷ lệ 7:4, không kéo méo. Tên và thông tin phụ có cỡ chữ responsive, được phép xuống dòng nhưng không tràn viền.
- Chuẩn hóa padding hai panel, loại bỏ margin/padding dư quanh vùng canvas và bảng; vùng bảng vẫn đủ 242px cho tiêu đề + 10 hạng, các hạng tiếp theo cuộn nội bộ.


## 82. Hàng Hạng và tốc độ trong Thiên Lý Kính
- Trong hàng thông tin đầu của Thiên Lý Kính, thứ tự là Hạng trước, tiếp đến khoảng cách nhỏ, rồi tốc độ và thời gian hiệu ứng.
- Bỏ hoàn toàn border, nền, bo góc và shadow bao quanh nhãn Hạng; giữ chữ Hạng rõ ràng.
- Toàn bộ hàng được căn giữa theo chiều ngang như một cụm thống nhất, không đẩy Hạng và tốc độ về hai mép panel.

## 83. Cố định hàng tiêu đề hai panel và không lặp tên cảnh giới
- Hàng tiêu đề “Thiên Lý Kính” và “Tiên Bảng” phải nằm ở đầu hai panel, cùng chiều cao 34px, cùng căn chỉnh theo trục dọc và không bị đẩy xuống do căn giữa nội dung Thiên Lý Kính.
- Tiên Bảng cuộn danh sách bên trong `.table-wrap`; hàng tiêu đề panel nằm ngoài vùng cuộn và luôn được giữ ở đầu. Hàng tiêu đề Thiên Lý Kính cũng giữ vị trí đầu panel.
- Tên cảnh giới mới chỉ hiển thị trong thông báo khi tiên nhân đầu tiên vượt cổng. Không vẽ thêm banner/tên cảnh giới riêng trên Canvas trong cùng thời điểm, tránh lặp nội dung phía dưới thông báo.

## 84. Kích thước nút Triệu Hồi và độ rõ nhãn Tiên Môn
- Nút mở lại bảng Triệu Hồi khi thu nhỏ dùng cùng kích thước responsive với cụm nút Chạy/Dừng: mặc định 44px, desktop ngang lớn theo `clamp(40px,4.5dvh,48px)`, màn hình ngang rất thấp 26px.
- Nhãn vai trò Chưởng Môn, Chân Truyền Đệ Tử và Trưởng Lão tăng cỡ chữ từ hệ số 12px lên 15px theo scale, có mức sàn 12px.
- Tên các lầu các tăng từ 10.5px lên 12.5px; Lăng Tiêu Chính Điện tăng từ 13px lên 15px. Vị trí, giới hạn chiều rộng và bố cục kiến trúc giữ nguyên.

## 85. Phóng lớn nút Triệu Hồi và nhãn khu vực Tiên Môn
- Nút Triệu Hồi thực tế ở tâm pháp luân (`.altar-dial #summon`) có kích thước 68×68px, biểu tượng kiếm 54×54px; trên màn hình rộng tối đa 600px dùng 62×62px, màn hình rất hẹp tối đa 380px dùng 58×58px.
- Nút mở lại bảng Triệu Hồi khi thu nhỏ có kích thước 60px trên màn hình lớn và 56px trên màn hình rộng tối đa 600px.
- Nhãn Chưởng Môn, Chân Truyền Đệ Tử và Trưởng Lão dùng font `max(15px,18*scale)`; tên lầu các dùng 15.5px, riêng công trình trung tâm 18.5px. Tăng giới hạn chiều rộng chữ để giảm co chữ.

## 86. Làm sạch chữ biển hiệu và thu gọn nút Triệu Hồi
- Nhãn các lầu các trong `drawSectArchitecture()` không còn vẽ `strokeText()` màu tối dày; bỏ bóng kế thừa bằng cách đặt `shadowBlur=0`, chỉ giữ lớp chữ sáng. Cả nét vẽ và chữ dùng chung giới hạn chiều rộng.
- Nút Triệu Hồi ở tâm pháp luân giảm còn 48px trên màn hình lớn, 44px trên màn hình tối đa 600px và 40px trên màn hình tối đa 380px; biểu tượng tương ứng 42/38/34px.
- Nút tâm pháp luân có lớp hiển thị cao hơn các vòng pháp luân; bảng triệu hồi tiếp tục nằm trên Canvas. Nút mở lại khi thu nhỏ giảm còn 44px, 42px trên mobile và 40px ở màn hình rất hẹp, đồng thời giữ z-index cao để không bị cảnh cổng đích che.
- Tăng phiên bản cache CSS lên v200 và visual-overrides lên v211.

## 87. Làm sạch mọi lớp chữ tối ở biển hiệu và cố định nút Triệu Hồi
- Chữ trên biển hiệu Giảng Đạo Các bỏ `strokeText()` màu đen; tên 14 lầu các vẽ chữ sáng thuần, reset `globalAlpha`, `globalCompositeOperation`, shadow offset, shadow blur, shadow color và filter trước khi vẽ để không nhận bóng từ trạng thái Canvas trước.
- Nút tâm pháp luân được neo đúng tâm bằng `left:50%`, `top:50%`, `translate(-50%,-50%)`, kích thước 44px desktop, 40px mobile và 38px màn hình rất hẹp; biểu tượng tương ứng 38/34/32px.
- Nút mở lại bảng khi thu nhỏ chuyển sang góc trái-trên của Canvas, tránh cổng kết thúc ở mép phải; vị trí được tính theo kích thước Canvas và giới hạn trong arena. Kích thước 42px desktop, 40px mobile và 38px màn hình rất hẹp; z-index cao hơn lớp Canvas.
- Cache CSS v201, visual-overrides v212 và race-logic v203.


## 88. Loại bỏ viền chữ tối và thu nhỏ nút triệu hồi trên iPhone
- Nhãn kiến trúc và nhãn cấp bậc chỉ vẽ một lớp chữ sáng; không dùng strokeText hoặc bóng đen lệch phía sau.
- Trạng thái Canvas được reset trước khi vẽ nhãn để tránh kế thừa shadow/filter từ lớp cảnh khác.
- Nút Triệu Hồi chính khóa tâm pháp luân, kích thước 36px mặc định, 34px trên điện thoại và 32px ở màn hình rất hẹp; biểu tượng nhỏ hơn nút để không tràn mép.
- Nút mở lại bảng khi thu nhỏ cũng giảm về 36/34/32px; vị trí góc trái-trên của Canvas được giữ để tránh cổng đích bên phải.

## 88. Viền chữ nhãn lầu các và cấp bậc khán đài
- Nhãn tên công trình trong `drawSectArchitecture()` dùng hai lớp stroke ôm sát chữ: viền ngoài xanh đen đậm và viền trong vàng nhạt mảnh, sau đó mới fill màu chữ.
- `drawRoleLabel()` áp dụng cùng cấu trúc viền cho Chưởng Môn, Chân Truyền Đệ Tử và Trưởng Lão; độ dày co theo scale.
- Viền được vẽ đồng tâm, không lệch hướng và không dùng shadow/offset, tránh cảm giác có một bản chữ đen thứ hai phía sau.
- Cache `visual-overrides.js` tăng lên `v214`; không thay đổi vị trí, cỡ chữ, kiến trúc hoặc gameplay.
- Điều chỉnh độ dày viền để đọc rõ trên màn hình điện thoại: viền ngoài xanh đen 5.8px (chính điện 7px), viền trong vàng sáng 2px (chính điện 2.5px); nhãn cấp bậc dùng viền ngoài tối tối thiểu 5px và viền trong vàng tối thiểu 1.8px. Cache visual-overrides.js v215.

## 89. Bảng tên tương phản cho kiến trúc và cấp bậc
- Nhãn các lầu các/chính điện dùng bảng nền xanh mực bán đục, bo góc, viền vàng hai lớp; chữ tiếp tục có viền tối và viền vàng sáng.
- `drawRoleLabel()` cũng tạo bảng tên riêng cho Chưởng Môn, Chân Truyền Đệ Tử và Trưởng Lão. Không để chữ trực tiếp trên nền núi, mây hoặc linh quang vì độ sáng nền thay đổi theo cảnh.
- Cache `visual-overrides.js` tăng lên v216.

## 90. Nhãn kiến trúc và cấp bậc không dùng bảng nền
- Loại bỏ hoàn toàn bảng tên nền tối/bo góc cho nhãn lầu các và các chức danh khán đài.
- Chữ vẽ trực tiếp trên cảnh bằng ba lớp stroke đồng tâm: viền ngoài xanh đen dày, viền vàng sáng ở giữa, lõi xanh đen mảnh sát nét chữ; cuối cùng fill màu sáng. Không dùng shadow hoặc offset.
- Áp dụng cho toàn bộ tên công trình, Chưởng Môn, Chân Truyền Đệ Tử và Trưởng Lão. Cache visual-overrides.js v217.

## 91. Loại bỏ bảng tên cấp bậc tại đúng bộ vẽ đang hoạt động
- Bảng tên Chưởng Môn/Trưởng Lão/Chân Truyền được vẽ bởi `drawRoleLabel()` trong `audience.js`, không phải bản hàm đã chỉnh trước đó trong visual overrides.
- Đã bỏ toàn bộ hình chữ nhật nền, khung và bóng bảng; thay bằng ba lớp viền chữ đồng tâm (xanh đen ngoài, vàng sáng giữa, xanh đen mảnh trong) rồi tô màu chữ.
- Cache audience.js tăng lên v182. Nhãn công trình trong `visual-overrides.js` tiếp tục dùng chữ trực tiếp, không bảng nền.


## 92. Làm sắc nét chữ nhãn, bỏ viền nhiều lớp gây mờ
- Nhãn cấp bậc trong `audience.js` chỉ dùng một nét viền xanh đen mảnh (1.65px theo scale), sau đó tô màu chữ sáng; không chồng các nét vàng/đen dày.
- Biển hiệu công trình trong `visual-overrides.js` dùng một nét viền xanh đen 2.2px (chính điện 2.8px), giữ màu chữ sáng; không tạo quầng hoặc hiệu ứng bóng.
- Không thêm bảng nền/khung cho nhãn cấp bậc. Cache: `audience.js v183`, `visual-overrides.js v218`.


## 93. Sửa đúng nhãn chức danh đang hiển thị và lớp hộp nhập triệu hồi
- Hàm `drawRoleLabel()` hoạt động thực tế nằm trong `visual-overrides.js`; file này được nạp sau `audience.js` nên khai báo toàn cục tại đây ghi đè hàm cùng tên trước đó.
- Nhãn Chưởng Môn, Chân Truyền Đệ Tử và Trưởng Lão dùng chữ lớn hơn, một nét viền xanh đen 3–3.5px và màu chữ sáng; bỏ các lớp viền đồng tâm gây bết chữ.
- Khi hộp nhập số lượng/thời lượng mở, hộp nhập có z-index cao nhất trong pháp luân; nút kiếm trung tâm bị hạ lớp và ẩn tạm thời để không che input/select.
- Cache: `visual-overrides.js v219`, `style.css responsive-arena-v203`.


## 94. Căn đều hàng cổ vũ ngoại môn và tạp dịch
- Mỗi hàng ngoại môn/tạp dịch tự phân bố theo toàn chiều ngang Canvas, không dùng số cột cố định khiến hàng cuối ngắn bị dồn về bên trái.
- Hàng cuối của nhóm tạp dịch (36 người) và ngoại môn (44 người) vẫn trải đều từ lề trái đến lề phải; các hàng đủ 48 người giữ mật độ gần như cũ.
- Giữ nguyên tổng số nhân vật, cấp bậc, tỷ lệ và vùng chiều dọc; giảm dao động ngang để nhân vật sát mép không bị cắt.
- Cache `visual-overrides.js` tăng lên v220.

## 95. Tăng mật độ ngoại môn và tạp dịch
- Ngoại môn tăng từ 92 lên 112 người, bố trí 2 hàng, mỗi hàng 56 người.
- Tạp dịch tăng từ 132 lên 168 người, bố trí 3 hàng, mỗi hàng 56 người.
- Hai nhóm dùng cùng lưới 56 cột, tọa độ ngang cố định trải từ mép trái tới mép phải Canvas; bỏ dao động ngang để tránh cảm giác hàng bị lệch hoặc không đều.
- Giữ nguyên tỷ lệ nhân vật và vùng chiều dọc; chỉ giảm dao động dọc nhẹ để đội hình gọn mà vẫn có chuyển động tự nhiên.
- Cache `visual-overrides.js` tăng lên v221.


## 96. Đại hội Tông Môn — nghi thức khai mạc và lời bình
- Sau khi triệu hồi hoàn tất, thao tác Chạy đầu tiên của mỗi lượt được điều phối qua `tournament.js`: ba hồi khai mạc, giới thiệu số tiên nhân/thời lượng và một số đạo danh đại diện, sau đó tự chuyển sang logic `startRace()` hiện có.
- Nút “Khai chiến ngay” cho phép bỏ qua phần trình diễn; phím Escape đóng nghi thức mà không tự khởi chạy cuộc đua. Khi đang chạy hoặc tạm ngưng, nút Chạy/Tiếp tục vẫn đi thẳng vào logic cũ.
- Thời lượng từng hồi, số đạo danh giới thiệu và thời gian lời bình lấy từ `data/ceremony.json` mục `opening`; không sửa các mốc `departure`/`awards` hiện có.
- Lời bình chỉ đọc thông báo đã có trong `#event` và trạng thái kết thúc trong `#status`; không tạo sự kiện ngẫu nhiên, không đổi thứ hạng, thời gian, tốc độ hoặc kết quả cuộc đua.
- Nghi thức trao thưởng Canvas, TOP 3, Thiên Lý Kính, Tiên Bảng, triệu hồi, nhạc và các hiệu ứng hiện có được giữ nguyên. `tournament.js` được nạp sau `i18n.js` để nội dung mới tiếp tục hỗ trợ Việt/Anh/Trung.
- Cache: `tournament.js?v=tournament-v2`, `i18n.js` v182, `style.css` responsive-arena-v204, `data-loader.js` v153.


## 97. Lời thoại gắn trực tiếp với nhân vật phát ngôn
- Bỏ nhãn tiêu đề kiểu “TRƯỞNG LÃO BÌNH LUẬN”, “TIN VỀ ĐÍCH”, “CHƯỞNG MÔN VINH DANH TAM GIÁP”; bong bóng chỉ hiển thị câu thoại.
- Bong bóng có nền trắng ngà, chữ xanh đậm, viền vàng nhạt và đuôi thoại hướng xuống nhân vật; không dùng thanh thông báo cố định trên đầu sân.
- Lời khai mạc gắn với trưởng lão; lời chúc mừng/trao thưởng gắn với chưởng môn; lời dẫn đầu và về đích gắn với đúng tiên nhân tương ứng. Có thể khai báo thêm các vai tạp dịch, ngoại môn, nội môn, nòng cốt và chân truyền làm người phát ngôn.
- Tọa độ bong bóng bám theo Canvas, cập nhật liên tục khi phóng to, thu nhỏ hoặc kéo khung cảnh; tự dừng cập nhật khi lời thoại kết thúc.
- Chỉ thay lớp trình bày lời bình. Không sửa thông báo gốc, luồng sự kiện, thời gian hiển thị, kết quả cuộc đua hoặc nghi thức trao thưởng.
- Cache: `tournament.js?v=tournament-v4`, `i18n.js v183`, `style.css?v=responsive-arena-v206`.


## 98. Chỉ hiển thị lời thoại trên đầu người phát ngôn
- Bong bóng trắng chỉ chứa câu thoại, không kèm nhãn “Trưởng lão bình luận”, “Tin về đích” hoặc chức danh người nói.
- Lời của tiên nhân dẫn đầu/về đích dùng ngôi thứ nhất; lời của trưởng lão và chưởng môn cũng hiển thị như hội thoại trực tiếp.
- Tắt banner Canvas trùng nội dung trong thời gian bong bóng hiện; đuôi bong bóng hướng đúng về nhân vật, tự chuyển xuống dưới nếu người nói ở sát mép trên.
- Neo vị trí được căn theo đầu nhân vật cho các vai trưởng lão, chưởng môn, chân truyền, nòng cốt, nội môn, ngoại môn, tạp dịch và tiên nhân ngự kiếm.
- Phát tín hiệu DOM khi khai cuộc và tăng cache-busting của index để trình duyệt không giữ controller cũ. Gameplay không đổi.
- Cache: tournament.js v5, i18n.js v184, style.css responsive-arena-v207, data-loader.js v154.

## 99. Bong bóng gọn và đối thoại tự nhiên
- Bong bóng lời thoại được thu gọn, giới hạn chiều rộng khoảng 230px trên màn hình lớn và 210px trên mobile; cỡ chữ nhỏ hơn, khoảng đệm gọn để cân đối với đầu nhân vật.
- Khi có người vượt lên dẫn đầu, lời bình luân phiên giữa trưởng lão, chưởng môn và chân truyền đệ tử theo kiểu đối đáp tự nhiên; sau đó có lời cổ vũ ngắn từ hàng đệ tử bên dưới.
- Mỗi lượt hội thoại thay thế bong bóng trước, không tạo nhiều hộp cùng lúc. Bộ hẹn giờ trao đổi được dọn khi có sự kiện mới, triệu hồi hoặc rời trang.
- Cache: `tournament.js v6`, `style.css responsive-arena-v208`, `data-loader.js v155`.

## 100. Kích thước bong bóng theo vai và lời cổ vũ gọi tên
- Bong bóng có giới hạn chiều rộng riêng theo vai người nói: chưởng môn/trưởng lão rộng hơn, chân truyền vừa phải, đệ tử phổ thông nhỏ hơn; trên mobile tiếp tục thu gọn. Chiều rộng thực tế vẫn co theo nội dung ngắn, không ép mọi câu thành hộp cố định.
- Lời bình khi đổi người dẫn đầu đưa tên người thi đấu vào nhận xét. Lượt cổ vũ từ hàng đệ tử gọi đích danh người dẫn đầu, kèm xưng hô sư huynh; nếu tên đã có hậu tố xưng hô thì không lặp.
- Cache: `tournament.js v7`, `style.css responsive-arena-v209`, `data-loader.js v156`.

## 101. Bong bóng lớn theo vai, nhiều lời thoại đồng thời
- Bong bóng thoại được tăng kích thước rõ rệt và có min/max width riêng theo vai: chưởng môn lớn nhất, trưởng lão lớn, chân truyền/đệ tử vừa, nội/ngoại môn và tạp dịch nhỏ hơn. Kích thước mobile có bộ giới hạn riêng.
- Mỗi lời thoại là một bong bóng độc lập, neo theo đầu người nói; tối đa 7 bong bóng cùng lúc. Chưởng môn được đặt lệch sang bên và thấp hơn, mũi tên vẫn trỏ về vị trí chưởng môn để tránh che đường đua.
- Khi cuộc đua chạy, đệ tử khán đài liên tục thay phiên cổ vũ, luân phiên gọi tên nhiều người thi đấu. Tạm dừng vẫn giữ lịch cổ vũ để tiếp tục khi chạy lại; kết thúc/triệu hồi/rời trang dọn timer và bong bóng.
- Đã bỏ lời thoại riêng “Ta đã về đích”; bảng hạng và thông báo hệ thống không bị thay đổi.
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


## 91. Khôi phục bong bóng bình luận và hoàn tất đường đua đúng 00:00
- `tournament.js` khởi tạo độc lập, không gọi các callback nghi thức không tồn tại; bong bóng được tạo trực tiếp khi bắt đầu/khai cuộc, neo theo Canvas và tự dọn khi hết thời gian.
- Bộ cổ vũ chỉ chạy sau khi qua đếm ngược, đang đua và không tạm dừng; dừng khi cuộc đua kết thúc.
- Trong giây cuối (`00:01`), mọi racer chưa về đích được tăng tiến độ theo phần quãng đường còn lại và thời gian còn lại, bảo đảm cùng chạm vạch khi đồng hồ về `00:00`. Thứ hạng vẫn dựa trên tiến độ và thời điểm chạm đích.
- Cache: `tournament.js v11`, `race-logic.js v204`, `data-loader.js v160`.


## 92. Thu nhỏ bong bóng bình luận theo cấp bậc
- Bong bóng lời bình được thu nhỏ theo thứ bậc: Chưởng môn/trưởng lão lớn nhất; nòng cốt/ngoại môn trung bình; nội môn nhỏ hơn; tạp dịch nhỏ nhất.
- Giảm cỡ chữ, padding, chiều rộng tối thiểu và đuôi bong bóng; trên màn hình nhỏ tiếp tục thu gọn nhưng vẫn cho phép nội dung dài tự xuống dòng.
- CSS cache: `responsive-arena-v213`.


## 93. Dải bình luận riêng, không che đường đua
- Bong bóng lời bình được chuyển vào dải bình luận riêng nằm trước Canvas trong luồng bố cục; dải này làm Canvas dịch xuống theo chiều cao của chính nó, không phủ lên hình ảnh thi đấu.
- Mỗi thời điểm chỉ hiển thị một lời bình; câu dài giới hạn tối đa hai dòng và được cắt gọn trong dải, không tràn xuống đường đua.
- Kích thước vẫn phân cấp: Chưởng môn lớn nhất, trưởng lão kế tiếp, nòng cốt/ngoại môn trung bình, nội môn nhỏ hơn và tạp dịch nhỏ nhất; trên điện thoại tiếp tục thu gọn.
- Không thay đổi tốc độ, vị trí, thứ hạng, camera hoặc tiến trình đua.
- Cache: `tournament.js v12`, `style.css responsive-arena-v214`, `data-loader.js v161`.


## 94. Bong bóng bám theo nhân vật phát biểu
- Bỏ dải bình luận độc lập; bong bóng được định vị tuyệt đối theo tọa độ đầu của từng nhân vật khán đài trong Canvas.
- Bong bóng nằm phía trên đầu hoặc lệch nhẹ sang bên; đuôi điều chỉnh vị trí ngang để luôn hướng về đúng người phát biểu.
- Neo theo vị trí nhân vật sau khi áp dụng zoom/pan, cập nhật liên tục để không trôi khỏi người nói.
- Kích thước phân cấp theo vai trò; Chưởng môn lớn nhất, trưởng lão tiếp theo, nòng cốt/đệ tử chân truyền trung bình, nội môn nhỏ hơn, ngoại môn và tạp dịch nhỏ nhất.
- Tọa độ neo nằm ở khu vực khán đài dưới đường đua, không đặt bong bóng lên khu vực thí sinh thi đấu.
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
- Bổ sung cụm điều khiển tốc độ 1x, 0.5x, 0.25x, 0.1x và chế độ TỰ ĐỘNG ngay dưới nhóm nút điều khiển cuộc đua; hiển thị rõ chế độ đang chọn, tối ưu bố cục trên màn hình nhỏ.
- TỰ ĐỘNG mặc định bật: đổi người dẫn đầu/vượt hạng Top 3 làm chậm còn 0.5x; Top 3 về đích còn 0.25x; photo finish còn 0.1x. Thời lượng lần lượt khoảng 1.5–2.6 giây; sự kiện mạnh hơn được ưu tiên.
- Chọn một mức tốc độ thủ công sẽ tắt TỰ ĐỘNG; bật lại TỰ ĐỘNG sẽ tiếp tục phản ứng theo sự kiện. Triệu hồi/khởi đầu lượt đua mới đặt lại 1x và TỰ ĐỘNG.
- Chỉ delta mô phỏng cuộc đua được nhân hệ số; đồng hồ đếm ngược, hiệu ứng sân khấu, âm thanh và vòng render không bị làm chậm. Không thay đổi thuật toán phân hạng hay vận tốc cơ sở.
- Cache: race-logic.js v210, race-events.js v2, style.css responsive-arena-v225, data-loader.js v192, index.html data-driven-v192.


## 124. Gỡ bỏ điều khiển tốc độ và Slow Motion
- Gỡ toàn bộ hàng chọn tốc độ 1x/0.5x/0.25x/0.1x/TỰ ĐỘNG khỏi giao diện.
- Gỡ bộ điều khiển Slow Motion tự động và sự kiện kích hoạt giảm tốc; mô phỏng cuộc đua tiếp tục chạy theo delta thời gian thực như trước khi bổ sung tính năng.
- Giữ nguyên Event Engine, Camera Director, các sự kiện vượt hạng/về đích/photo finish và tốc độ hiệu ứng gameplay riêng của từng đệ tử.
- Cache: race-logic.js v211, style.css responsive-arena-v226, data-loader.js v193, index.html data-driven-v193.
