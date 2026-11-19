"use strict";

(function initTournamentCommentary(){
  const arena=document.querySelector(".arena-frame");
  const canvas=document.getElementById("game");
  const startButton=document.getElementById("start");
  const eventNode=document.getElementById("event");
  const statusNode=document.getElementById("status");
  if(!arena||!canvas||!startButton)return;

  const bubbles=[];
  const bubbleQueue=[];
  let chatterTimer=0,frameRequest=0,turn=0,lastEvent="",bubbleSequence=0,stopped=false;
  const MAX_BUBBLES=2,BUBBLE_LIFE=4300;

  function inferGender(name){
    const n=String(name||"").trim().toLowerCase();
    if(!n)return "unknown";
    if(/(nữ|tiên tử|thánh nữ|tiểu thư|cô nương|sư tỷ|chị|cô gái)/.test(n))return "female";
    if(/(nam|sư huynh|công tử|đạo trưởng|thiếu hiệp|kiếm tôn|chân quân|tiên quân|anh)/.test(n))return "male";
    if(/(linh nhi|tử yên|băng tâm|thanh huyền|nhược|mộng|uyển|婉|嫣|瑶|蓉|娜|婷|琳|雪|月|凤|凰|仙|姬|妃|柔|清|霜|梅|兰|菊|荷|萱|馨|静|雅|薇|璃|曦|妍|诗)/i.test(n))return "female";
    if(/(thiên|hạo|minh|long|phong|kiệt|khải|vũ|quân|nguyên|cường|tuấn|đạt|bảo|俊|豪|杰|龙|天|宇|轩|辰|阳|剑|君|枫|峰|海|浩|明|伟|强|勇|文|武)/i.test(n))return "male";
    return "unknown";
  }
  const titleFor=g=>g==="female"?"sư tỷ":g==="male"?"sư huynh":"đạo hữu";
  const addressedName=(name,g,capital=true)=>{const title=titleFor(g);const text=name?name+" "+title:title;return capital?text.charAt(0).toUpperCase()+text.slice(1):text;};
  const lines=[
    ["outer",(n,h)=>n?h+"! Cố lên! Đệ tử đang dõi theo!":"Chư vị cố lên! Đệ tử đang dõi theo!"],
    ["inner",(n,h)=>n?h+" sắp vượt thêm một người rồi!":"Nhanh quá, sắp vượt thêm một người rồi!"],
    ["servant",(n,h)=>n?"Hay quá, "+h+"! Giữ vững kiếm thế nhé!":"Hay quá! Giữ vững kiếm thế nhé!"],
    ["disciple",(n,h)=>n?h+" có hy vọng đoạt vị trí cao rồi!":"Phong chúng ta có hy vọng đoạt vị trí cao rồi!"],
    ["core",(n,h)=>n?h+" quả nhiên có bản lĩnh, đường kiếm thật đẹp!":"Đạo hữu quả nhiên có bản lĩnh, đường kiếm thật đẹp!"],
    ["outer",(n,h)=>n?h+"! Đệ tử tin "+(h.toLowerCase().startsWith("sư huynh")?"huynh":h.toLowerCase().startsWith("sư tỷ")?"tỷ":"đạo hữu")+" làm được!":"Đừng để mất vị trí! Cố lên!"],
    ["inner",()=> "Đuổi kịp rồi! Chỉ còn một đoạn nữa thôi!"],
    ["servant",()=> "Đệ tử cổ vũ cho tất cả các vị! Bay nhanh lên nào!"],
    ["disciple",(n,h)=>n?h+", phía trước đang có cơ hội! Tăng tốc đi!":"Phía trước đang có cơ hội! Tăng tốc đi!"],
    ["inner",()=> "Đẹp lắm! Đường kiếm ấy khiến người xem cũng thấy nhiệt huyết!"],
    ["outer",()=> "Sắp vượt rồi! Mau lên, chỉ còn một chút nữa!"],
    ["core",()=> "Thân pháp ấy rất có triển vọng. Lại áp sát rồi!"],
    ["servant",()=> "Cố lên! Khán đài đang cổ vũ cho các vị!"],
    ["disciple",()=> "Đừng chậm lại! Cơ hội đổi thứ hạng ngay trước mắt!"],
    ["inner",(n,h)=>n?h+", cố giữ nhịp thở và kiếm thế!":"Đạo hữu, cố giữ nhịp thở và kiếm thế!"],
    ["outer",()=> "Kiếm quang thật đẹp! Tranh phong càng lúc càng kịch liệt!"],
    ["elder",()=> "Lão phu sống ba ngàn năm, lần đầu thấy có người bay mà phong thái còn đẹp hơn lúc đi bộ!"],
    ["master",()=> "Đại hội hôm nay, ai đoạt khôi thủ sẽ được bổn môn trọng thưởng… một lời khen thật dài!"],
    ["servant",()=> "Sư huynh bay nhanh quá! Đệ tử nhìn theo mà quên cả quét sân!"],
    ["inner",()=> "Đạo hữu vừa thi triển thân pháp gì vậy? Ta chỉ chớp mắt mà đã mất dấu!"],
    ["core",()=> "Kiếm ý ngút trời! À không, hình như là gió thổi bay tóc thôi!"],
    ["disciple",()=> "Người phía trước xin chậm một chút! Ta còn chưa kịp cổ vũ xong!"],
    ["outer",()=> "Đây là tranh phong hay cuộc thi ai ngự kiếm giao hàng nhanh nhất?"],
    ["elder",()=> "Khí tức vững vàng, tâm cảnh kiên định… trừ vị vừa suýt bay ngược kia!"],
    ["master",()=> "Thắng bại là chuyện thường tình, nhưng bay lệch khỏi đường đua thì phải tìm đường về!"],
    ["servant",()=> "Đệ tử đã chuẩn bị trà, nhưng chư vị nhanh đến mức trà còn chưa kịp nguội!"],
    ["inner",()=> "Một kiếm phá không! Ba phần phong độ, bảy phần… vận may!"],
    ["core",()=> "Người này có đại khí vận! Vừa nói xong đã vượt thêm một vị!"],
    ["disciple",()=> "Sư huynh phía trước, phía sau có người đuổi! Không phải đòi nợ đâu!"],
    ["outer",()=> "Ta cược một viên linh thạch… thôi, linh thạch của ta cũng đang nợ!"],
    ["elder",()=> "Đừng xem thường đối thủ. Có khi người chậm nhất đang giữ bí thuật cuối cùng!"],
    ["master",()=> "Các vị giữ vững đạo tâm! Đừng để tiếng reo hò làm quên mất hướng bay!"],
    ["servant",()=> "Hảo kiếm! Hảo thân pháp! Hảo… ai vừa làm rơi dép vậy?"],
    ["inner",()=> "Linh khí bùng nổ! Khán đài cũng sắp bùng nổ theo rồi!"],
    ["core",()=> "Tư thế này, lão tổ nhìn thấy chắc cũng muốn đăng ký thi đấu!"],
    ["disciple",()=> "Cố lên! Phía trước là vinh quang, phía sau là… áp lực đồng môn!"],
    ["outer",()=> "Đường kiếm như rồng! Mà con rồng này hình như đang tìm đường!"],
    ["elder",()=> "Lão phu thấy được một tia đột phá… trong khả năng giữ thăng bằng!"],
    ["master",()=> "Ai còn giữ sức thì cứ dùng! Đại hội không có vòng thi tiết kiệm linh lực!"],
    ["servant",()=> "Đệ tử xin phép cổ vũ bằng cả hai tay, vì một tay đang cầm bánh!"],
    ["inner",()=> "Nhanh như chớp! Ta còn chưa kịp gọi tên đã vượt qua rồi!"],
    ["core",()=> "Thiên tài quả nhiên khác biệt! Người thường như ta chỉ biết vỗ tay!"],
    ["disciple",()=> "Đừng hoảng! Nếu mất vị trí, hãy mất một cách thật phong độ!"],
    ["outer",()=> "Ngự kiếm mà không cần bản đồ! Quả là cảnh giới cao thâm!"],
    ["elder",()=> "Tâm không động, kiếm không loạn… khán giả thì đang loạn cả lên!"],
    ["master",()=> "Hôm nay không luận xuất thân, chỉ luận tốc độ và… khả năng không va vào nhau!"],
    ["servant",()=> "Chư vị bay đẹp quá! Đệ tử đứng đây mà linh khí cũng tăng ba phần!"],
    ["inner",()=> "Người dẫn đầu đang giữ ưu thế! Nhưng thiên cơ chưa định, đừng vội ăn mừng!"],
    ["core",()=> "Một bước thiên đường, một bước… suýt chạm cổng!"],
    ["disciple",()=> "Ta đã chuẩn bị tiếng reo cho người thắng! Ai thắng thì nhận nhé!"],
    ["outer",()=> "Kiếm khí tung hoành! Mây cũng phải nhường đường, chắc vậy!"],
    ["elder",()=> "Hậu sinh khả úy! Lão phu bắt đầu thấy muốn trẻ lại để dự thi!"],
    ["master",()=> "Đại hội đang nóng! Xin khán giả giữ bình tĩnh, linh thạch không tự mọc lại!"],
    ["servant",()=> "Nếu bay nhanh thế này, bữa cơm hôm nay chắc phải ăn trên phi kiếm!"],
    ["inner",()=> "Trận thế biến hóa khôn lường! Ai nấy đều như có buff… tinh thần!"],
    ["core",()=> "Đạo tâm sáng như gương! Riêng ta nhìn bảng xếp hạng hơi chóng mặt!"],
    ["disciple",()=> "Cố lên! Đừng để đối thủ vượt! Đừng để kiếm bay trước, người bay sau!"],
    ["outer",()=> "Đây mới là phong thái tiên gia! Ta xin ghi lại để… luyện lúc rảnh!"],
    ["elder",()=> "Nếu đây là tốc độ thường ngày, lão phu xin miễn đi chợ cùng các vị!"],
    ["master",()=> "Kẻ thắng nhận vinh quang, kẻ còn lại nhận kinh nghiệm và một bữa trà!"],
    ["servant",()=> "Đệ tử không hiểu kiếm pháp, nhưng biết ai bay nhanh thì rất ngầu!"],
    ["inner",()=> "Cơ hội lật ngược thế cờ đang đến! Thiên cơ bảo ta… cứ cổ vũ trước!"],
    ["core",()=> "Đừng hỏi ta ai thắng! Ta đang bận thưởng thức màn ngự kiếm tuyệt diệu!"],
    ["disciple",()=> "Đại hội hôm nay quá xuất sắc! Xin cho khán giả thêm một đôi mắt!"],
    ["outer",()=> "Chỉ còn một đoạn! Vận khí, kiếm ý, và đôi chân… à, phi kiếm!"],
    ["elder",()=> "Lão phu phán đoán: người về nhất sẽ là người chạm đích đầu tiên!"],
    ["master",()=> "Các vị đã khiến tông môn rạng danh! Dù thắng hay thua, đừng quên trả phi kiếm!"],
    ["elder",()=> "Lão phu vừa định dùng thần thức dò thứ hạng, ai ngờ bảng xếp hạng chạy còn nhanh hơn thần thức!"],
    ["elder",()=> "Kiếm tâm bất động, thân pháp như phong… riêng túi linh thạch của lão phu đang run!"],
    ["elder",()=> "Hậu sinh này có căn cốt tốt! Nếu không về nhất, nhất định là do phi kiếm chưa được bảo dưỡng!"],
    ["elder",()=> "Lão phu tu luyện ba nghìn năm, vẫn chưa học được cách cổ vũ mà không khản giọng!"],
    ["elder",()=> "Đừng chỉ nhìn tốc độ! Hãy nhìn cả phong thái… dù lão phu cũng chẳng nhìn kịp!"],
    ["elder",()=> "Người thắng lĩnh thưởng, người thua lĩnh ngộ. Còn lão phu lĩnh… hóa đơn trà!"],
    ["elder",()=> "Thiên cơ biến đổi, thứ hạng đảo chiều. Xem ra hôm nay bói toán cũng phải cập nhật!"],
    ["elder",()=> "Một thân kiếm khí kinh người! Chỉ tiếc lão phu vừa chớp mắt đã bỏ lỡ ba lần vượt mặt!"],
    ["elder",()=> "Đạo tâm vững như bàn thạch! Chỉ có tim lão phu là đập như trống trận!"],
    ["elder",()=> "Nếu tốc độ này đem đi giao linh đan, chắc cả tông môn khỏi cần lập đội vận chuyển!"],
    ["disciple",()=> "Mau nhìn kìa! Người ấy vừa vượt lên! Ta còn chưa kịp đặt tên cho chiêu thức!"],
    ["disciple",()=> "Sư huynh bay như kiếm quang, còn ta chạy theo tin tức cũng không kịp!"],
    ["disciple",()=> "Ta đã luyện tiếng reo cổ vũ suốt đêm, hôm nay nhất định phải dùng hết!"],
    ["disciple",()=> "Đừng lo phía sau! Có chúng ta ở đây… tuy không giúp được gì ngoài la hét!"],
    ["disciple",()=> "Vừa rồi là bí thuật gì? Sao ta chỉ thấy một vệt sáng và một đám bụi tiên!"],
    ["disciple",()=> "Nếu thắng được thưởng linh thạch, nhớ mời đồng môn một bữa linh tửu… à, trà tiên cũng được!"],
    ["disciple",()=> "Ta cá người ấy còn giấu tuyệt chiêu! Không thì sao vẻ mặt vẫn bình thản thế kia!"],
    ["disciple",()=> "Kiếm bay có thể mỏi không nhỉ? Ta nhìn thôi mà đã muốn ngồi nghỉ!"],
    ["disciple",()=> "Đường đua hôm nay đúng là long tranh hổ đấu, còn ta tranh thủ giữ chỗ ngồi!"],
    ["disciple",()=> "Ai vừa vượt qua vậy? Nhanh đến mức ta chưa kịp nhận ra màu áo!"],
    ["core",()=> "Kiếm ý nhập vi, thân pháp vô song! Ta xin ghi chép lại… để lần sau còn khoe đã hiểu!"],
    ["core",()=> "Người này khí vận thâm hậu, ngay cả gió cũng tự giác nhường đường!"],
    ["core",()=> "Một bước vượt thiên kiêu, nửa bước khiến đối thủ nghi ngờ nhân sinh!"],
    ["core",()=> "Đường kiếm có ba phần huyền diệu, bảy phần khiến người xem muốn xin bí kíp!"],
    ["core",()=> "Ta nhìn ra rồi! Bí quyết là tập trung… tiếc rằng ta chỉ tập trung nhìn!"],
    ["core",()=> "Nếu đây là thực lực bình thường, tuyệt kỹ chắc phải khiến trời đất đổi màu!"],
    ["core",()=> "Thân pháp như quỷ mị, phi kiếm như thần long. Ghi chú: tuyệt đối không đua thử ở hành lang!"],
    ["core",()=> "Khí thế áp đảo! Người phía sau chắc đang tính lại nhân sinh và số linh thạch còn lại!"],
    ["core",()=> "Đạo hữu này tiến cảnh thần tốc, ta vừa định phân tích thì đã qua thêm một khúc!"],
    ["core",()=> "Đúng là thiên tài! Ta xin làm người chứng kiến, vị trí này an toàn hơn dự thi!"],
    ["inner",()=> "Vừa rồi đổi hướng giữa không trung! Động tác ấy đáng giá ba quyển thân pháp!"],
    ["inner",()=> "Khoảng cách đang thu hẹp! Trận này chưa đến hồi kết, đừng vội mở tiệc ăn mừng!"],
    ["inner",()=> "Người dẫn đầu giữ nhịp rất tốt, nhưng phía sau đã có kiếm quang áp sát!"],
    ["inner",()=> "Ta cá đây là tuyệt học thân pháp mới! Tên chiêu: Chớp mắt đã ở phía trước!"],
    ["inner",()=> "Đối thủ vừa tăng tốc, người dẫn đầu lập tức đáp lễ. Đúng là lễ nghi tu tiên!"],
    ["inner",()=> "Tốc độ kinh người! Nếu dùng để né bài kiểm tra môn quy thì thật đáng tiếc!"],
    ["inner",()=> "Một vòng kiếm ảnh, hai lần đổi vị trí! Ta cần thêm hai đôi mắt để theo dõi!"],
    ["inner",()=> "Thứ hạng thay đổi liên tục, bảng Thiên Lý chắc sắp xin nghỉ phép!"],
    ["inner",()=> "Kiếm quang giao thoa, linh khí cuộn trào! Khán đài hôm nay không uổng công đến sớm!"],
    ["inner",()=> "Đừng xem thường người bám đuổi! Kẻ giữ sức đến cuối thường khiến cả sân kinh ngạc!"],
    ["outer",()=> "Cố lên! Về đích trước thì được thưởng, về sau thì được… thêm kinh nghiệm!"],
    ["outer",()=> "Phi kiếm lướt gió, áo bào tung bay! Ta đứng đây cũng thấy mình ngầu thêm chút!"],
    ["outer",()=> "Đừng để kiếm khí tản mát! Linh thạch mua kiếm phù hôm nay đắt lắm!"],
    ["outer",()=> "Người phía trước cứ bay, chúng ta phía sau cứ cổ vũ. Phân công thật hoàn mỹ!"],
    ["outer",()=> "Ta vừa hô cố lên xong, người ấy đã vượt mất. Có cần hô nhanh hơn không?"],
    ["outer",()=> "Nếu thắng cuộc có thưởng, ta xin đăng ký làm người vỗ tay chuyên nghiệp!"],
    ["outer",()=> "Đường đua rộng thế mà vẫn tranh nhau từng tấc! Quả nhiên tiên duyên cũng phải cạnh tranh!"],
    ["outer",()=> "Kiếm thế mạnh mẽ! Chỉ mong lúc hạ cánh vẫn nhớ phanh ở đâu!"],
    ["outer",()=> "Một đường phá phong! Ta nghe tiếng gió thôi cũng biết người này không tầm thường!"],
    ["outer",()=> "Cơ hội đang đến! Đừng để đối thủ vượt qua dễ như lấy đồ trong túi trữ vật!"],
    ["servant",()=> "Đệ tử đã quét sạch quảng trường, xin chư vị đừng bay thấp làm bụi tiên bay lại!"],
    ["servant",()=> "Ta vừa đặt ấm trà xuống thì ba vị đã đổi thứ hạng. Trà này uống không kịp nữa rồi!"],
    ["servant",()=> "Nếu ai cần khăn lau kiếm, đệ tử có chuẩn bị! Nhưng xin đừng giảm tốc để nhận!"],
    ["servant",()=> "Đệ tử cổ vũ hết mình! Chỉ mong lát nữa không phải nhặt phi kiếm rơi!"],
    ["servant",()=> "Người bay nhanh quá, khay linh quả của ta còn chưa kịp đưa lên!"],
    ["servant",()=> "Ta xin ghi công: hôm nay không ai va vào chổi của đệ tử!"],
    ["servant",()=> "Đại hội thật náo nhiệt! Đệ tử nghe tiếng reo mà quên mất mình đang trực ban!"],
    ["servant",()=> "Nếu phi kiếm có chuông báo, chắc cả sân giờ vang như hội chợ tiên gia!"],
    ["servant",()=> "Đệ tử không biết phân biệt kiếm chiêu, nhưng biết ai sắp về đích rồi!"],
    ["servant",()=> "Xin chư vị bay cẩn thận! Sân vừa lau xong, trượt một cái là mất phong độ!"],
    ["master",()=> "Bổn tọa thấy rõ từng đường kiếm… chỉ là bảng thứ hạng đổi nhanh đến mức cần thêm một vị trưởng lão ghi chép!"],
    ["master",()=> "Các vị cứ toàn lực tranh phong. Nếu phi kiếm hỏng, tông môn sẽ xem xét… sau khi kiểm kê linh thạch!"],
    ["master",()=> "Người thắng không kiêu, người bại không nản. Riêng người làm rơi kiếm phải tự đi nhặt!"],
    ["master",()=> "Bổn tọa rất hài lòng với tinh thần đại hội. Đặc biệt là tinh thần không ai bỏ cuộc giữa đường!"],
    ["master",()=> "Một kiếm định phong vân! Nhưng nhớ giữ khoảng cách, bổn tọa không muốn mở thêm đại hội sửa sân!"],
    ["master",()=> "Tông môn trọng tài năng, cũng trọng an toàn. Bay nhanh nhưng chớ biến thành sao băng!"]
  ];

  // Tránh lặp câu theo từng vai: mỗi vai ghi nhớ 8 câu vừa phát.
  const recentLinesByRole=Object.create(null);
  function chooseDialogue(role,name,call){
    const pool=lines.filter(line=>line[0]===role);
    if(!pool.length)return null;
    const recent=recentLinesByRole[role]||(recentLinesByRole[role]=[]);
    const evaluated=pool.map(line=>({text:String(line[1](name,call)),line}));
    let candidates=evaluated.filter(item=>!recent.includes(item.text));
    if(!candidates.length){recent.length=0;candidates=evaluated;}
    const chosen=candidates[Math.floor(Math.random()*candidates.length)];
    recent.push(chosen.text);
    if(recent.length>8)recent.shift();
    return chosen.text;
  }

  function racersNow(){
    return typeof racers!=="undefined"&&Array.isArray(racers)?racers:[];
  }

  const speakerAnchors={
    // Hai vị trí hàng đầu dùng bong bóng nằm dưới điểm neo; đuôi hướng ngược lên
    // để chỉ đúng người đang thoại mà không phủ lên nhân vật thi đấu.
    master:{x:550,y:515,side:1,below:true},elder:{x:867,y:600,side:-1,below:true},disciple:{x:263,y:600,side:1,below:true},core:{x:550,y:765,side:-1},inner:{x:380,y:775,side:1},outer:{x:550,y:795,side:-1},servant:{x:550,y:845,side:1},
    racer:{x:550,y:720,side:1}
  };

  function isFinished(){return typeof finished!=="undefined"&&finished;}
  function positionBubble(item){
    if(!item.el.isConnected)return;
    const cr=canvas.getBoundingClientRect(),ar=arena.getBoundingClientRect();
    if(!cr.width||!cr.height||!ar.width||!ar.height)return;
    const anchor=speakerAnchors[item.type]||speakerAnchors.outer;
    const zoom=typeof gameZoom!=="undefined"?gameZoom:1;
    const panX=typeof gamePanX!=="undefined"?gamePanX:0;
    const panY=typeof gamePanY!=="undefined"?gamePanY:0;
    const sx=canvas.width*.5+panX+(anchor.x-canvas.width*.5)*zoom;
    const sy=canvas.height*.5+panY+(anchor.y-canvas.height*.5)*zoom;
    const px=cr.left-ar.left+sx/canvas.width*cr.width;
    const py=cr.top-ar.top+sy/canvas.height*cr.height;
    const width=item.el.offsetWidth||120,height=item.el.offsetHeight||34;
    const side=anchor.side||1,offset=Math.min(16,width*.09)*side;
    // Chọn vị trí trái/giữa/phải và thử cả hai hướng đuôi để luôn chỉ về người nói.
    // Các bong bóng đã được sắp theo thứ tự xuất hiện nên vị trí của chúng ổn định trong mỗi khung hình.
    const xSlots=[.16,.84,.34,.66,.50,.24,.76];
    const yLevels=[0,-1,1];
    const preferredX=px*.34+ar.width*.66;
    const others=bubbles.filter(other=>other!==item&&other.el.isConnected&&other.el.style.left&&other.el.style.top);
    let best=null;
    for(const below of [!!anchor.below,!anchor.below]){
      const baseY=below?py+8:py-10;
      for(const slot of xSlots){
        const center=preferredX*.38+(ar.width*slot)*.62+offset;
        const left=Math.max(width/2+5,Math.min(ar.width-width/2-5,center));
        for(const level of yLevels){
          const top=below
            ?Math.max(8,Math.min(ar.height-height-8,baseY+level*(height+7)))
            :Math.max(height+8,Math.min(ar.height-8,baseY+level*(height+7)));
          const visualTop=below?top+8:top-height;
          const rect={left:left-width/2,right:left+width/2,top:visualTop,bottom:visualTop+height};
          let overlap=0;
          for(const other of others){
            const ow=other.el.offsetWidth||120,oh=other.el.offsetHeight||34;
            const ol=parseFloat(other.el.style.left)||0,ot=parseFloat(other.el.style.top)||0;
            const obelow=other.el.classList.contains("is-below");
            const oy=obelow?ot+8:ot-oh;
            const ix=Math.max(0,Math.min(rect.right,ol+ow/2)-Math.max(rect.left,ol-ow/2));
            const iy=Math.max(0,Math.min(rect.bottom,oy+oh)-Math.max(rect.top,oy));
            overlap+=ix*iy;
          }
          const displacement=Math.abs(left-px)*.12+Math.abs(top-baseY)*.42+(below===!!anchor.below?0:18);
          const score=overlap*30+displacement;
          if(!best||score<best.score)best={score,left,top,below};
        }
      }
    }
    const left=best?best.left:Math.max(width/2+5,Math.min(ar.width-width/2-5,preferredX+offset));
    const bubbleY=best?best.top:Math.max(8,Math.min(ar.height-8,py));
    item.el.classList.toggle("is-below",best?best.below:!!anchor.below);
    item.el.style.left=left+"px";
    item.el.style.top=bubbleY+"px";
    item.el.style.setProperty("--speech-tail-x",Math.max(10,Math.min(width-10,px-left+width/2))+"px");
  }
  function followBubbles(){
    // Đặt bong bóng cũ trước, bong bóng mới tìm vị trí còn trống quanh chúng.
    bubbles.slice().sort((a,b)=>a.sequence-b.sequence).forEach(positionBubble);
    if(bubbles.length)frameRequest=requestAnimationFrame(followBubbles);
    else frameRequest=0;
  }

  function createBubble(message,type){
    const seq=++bubbleSequence;
    const el=document.createElement("div");
    el.className="tournament-speech-bubble speaker-"+type+" is-visible";
    el.setAttribute("role","status");
    el.setAttribute("aria-label",String(message));
    const text=document.createElement("strong");
    text.className="tournament-speech-message";
    text.textContent=String(message);
    el.appendChild(text);
    el.style.zIndex=String(1150+seq);
    arena.appendChild(el);
    const item={el,type,sequence:seq,timer:0};
    bubbles.push(item);
    positionBubble(item);
    if(!frameRequest)frameRequest=requestAnimationFrame(followBubbles);
    item.timer=window.setTimeout(()=>removeBubble(item),BUBBLE_LIFE);
  }
  function flushBubbleQueue(){
    if(stopped||isFinished()){bubbleQueue.length=0;return;}
    while(bubbles.length<MAX_BUBBLES&&bubbleQueue.length){
      const index=bubbleQueue.findIndex(entry=>!bubbles.some(item=>item.type===entry.type));
      if(index<0)return;
      const next=bubbleQueue.splice(index,1)[0];
      createBubble(next.message,next.type);
    }
  }
  function removeBubble(item){
    if(item.timer)clearTimeout(item.timer);
    item.el.remove();
    const i=bubbles.indexOf(item);
    if(i>=0)bubbles.splice(i,1);
    flushBubbleQueue();
  }
  function clearBubbles(){
    bubbleQueue.length=0;
    bubbles.slice().forEach(item=>{if(item.timer)clearTimeout(item.timer);item.el.remove();});
    bubbles.length=0;
    if(frameRequest){cancelAnimationFrame(frameRequest);frameRequest=0;}
  }
  function stopChatter(){stopped=true;if(chatterTimer){clearTimeout(chatterTimer);chatterTimer=0;}clearBubbles();}
  function showBubble(message,type){
    if(!message||stopped||isFinished())return;
    if(bubbles.length>=MAX_BUBBLES||bubbles.some(item=>item.type===type)){
      if(bubbleQueue.length<12)bubbleQueue.push({message:String(message),type});
      return;
    }
    createBubble(message,type);
  }

  function scheduleChatter(){
    if(chatterTimer)return;
    const speak=()=>{
      chatterTimer=0;
      if(stopped||isFinished())return;
      const active=typeof running!=="undefined"&&running&&typeof started!=="undefined"&&started&&!(typeof paused!=="undefined"&&paused);
      if(!active){chatterTimer=window.setTimeout(speak,350);return;}
      const list=racersNow();
      const leader=typeof leaderOf==="function"?leaderOf():null;
      const target=turn%4===0&&leader?leader:list.length?list[turn%list.length]:null;
      const name=target&&target.name?String(target.name).trim():"";
      const gender=inferGender(name);
      const call=addressedName(name,gender,true);
      // Luân phiên có trọng số để Trưởng lão và Chân truyền đệ tử thường xuyên tham gia bình luận.
      // Chưởng môn không nằm trong vòng cổ vũ tự phát; chỉ đáp lời khi có đối thoại sự kiện.
      const speakerCycle=["elder","disciple","core","inner","outer","servant","disciple","elder","inner","outer","core","servant"];
      const speaker=speakerCycle[turn%speakerCycle.length];
      // Chờ chỗ trống và không để cùng một vai có hai bong bóng cùng lúc.
      if(bubbles.length>=MAX_BUBBLES||bubbles.some(item=>item.type===speaker)){
        chatterTimer=window.setTimeout(speak,450);
        return;
      }
      const cycleIndex=turn++;
      const message=chooseDialogue(speaker,name,call);
      if(message)showBubble(message,speaker);
      if(!stopped&&!isFinished())chatterTimer=window.setTimeout(speak,900+Math.floor(Math.random()*400));
    };
    chatterTimer=window.setTimeout(speak,500);
  }

  function handleEvent(){
    if(!eventNode||stopped||isFinished())return;
    const value=eventNode.textContent.trim();
    if(!value||value===lastEvent)return;
    lastEvent=value;
    if(value.includes("ĐẠI HỘI BẮT ĐẦU")){
      showBubble("Đại hội Ngự Kiếm chính thức khai cuộc! Chư vị chuẩn bị thưởng thức!","elder");
      scheduleChatter();
    }else if(value.startsWith("HẠNG 1 · ĐANG DẪN ĐẦU:")){
      const name=value.slice("HẠNG 1 · ĐANG DẪN ĐẦU:".length).trim();
      const gender=inferGender(name),call=addressedName(name,gender,true),midCall=addressedName(name,gender,false);
      showBubble("Chưởng môn, "+call+" vừa vượt lên rồi! Kiếm thế thật khá!","elder");
      window.setTimeout(()=>{if(!isFinished()&&!stopped)showBubble("Ta thấy rồi. "+midCall+" giữ thân pháp rất vững, không hề rối loạn.","master");},850);
    }else if(value.includes("PHOTO FINISH")){
      showBubble("Chỉ chênh lệch trong gang tấc! Quả là một trận tranh phong kịch liệt!","elder");
    }
  }

  startButton.addEventListener("click",scheduleChatter);
  if(eventNode)new MutationObserver(handleEvent).observe(eventNode,{childList:true,characterData:true,subtree:true});
  if(statusNode)new MutationObserver(()=>{if(isFinished())stopChatter();else if(statusNode.textContent.includes("Đã triệu hồi"))stopped=false;else if(typeof running!=="undefined"&&running&&typeof started!=="undefined"&&started&&!(typeof paused!=="undefined"&&paused))scheduleChatter();}).observe(statusNode,{childList:true,characterData:true,subtree:true});

  const originalDraw=window.drawAnnouncement;
  if(typeof originalDraw==="function"){
    window.drawAnnouncement=function(...args){
      if(bubbles.some(item=>item.el.isConnected&&item.el.classList.contains("is-visible")))return;
      return originalDraw.apply(this,args);
    };
  }

  window.addEventListener("pagehide",stopChatter);
})();
