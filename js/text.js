var words = [
    "anh đã từng nghĩ chắc mình sẽ cô đơn đến hết cuộc đời này 🤔",
    "cho đến khi anh găp được em 🧸",
    "em đã chỉ cho anh biết thế nào là yêu thương 😊",
    "giúp anh biết lắng nghe, quan tâm, trân trọng mọi thứ hơn 🎁",
    "dù có nhiều khi anh vô tâm, mệt mỏi em vẫn luôn ở bên anh 👫",
    "đó là một động lực rất lớn cho anh đứng dậy và bước tiếp 💪",
    "anh cảm thấy mình rất may mắn và hạnh phúc 👩‍❤️‍💋‍👨🍀",
    "cám ơn cuộc sống đã mang em đến bên anh 🙆‍♀️",
    "luôn bên anh và ...",
    "làm vợ anh nhé 💍 !!!",
    "...",
    "Em ở đâu đừng trốn nữa 😭😭😭",
  ],
  part,
  i = 0,
  offset = 0,
  len = words.length,
  forwards = true,
  skip_count = 0,
  skip_delay = 15,
  speed = 80,
  isShowSaleOff = false;
function playAudio() {
  soundEffect.play();
}

const wordflick = function () {
  window.removeEventListener("click", wordflick, false);
  soundEffect.play();
  setInterval(function () {
    // chữ chạy tiến
    if (forwards) {
      if (offset >= words[i].length) {
        ++skip_count;
        if (skip_count == skip_delay) {
          forwards = false;
          skip_count = 0;
        }
      }
    } else {
      if (offset == 0) {
        forwards = true;
        i++;
        offset = 0;
        // chạy lại từ đầu nếu đến cuối array word
        if (i >= len) {
          // hiển thị sale off text and move down layout-3 một lần duy nhất
          if (!isShowSaleOff) {
            isShowSaleOff = true;
            document.getElementById("sale-off").style.display = "block";
            document.getElementsByClassName("layout-3")[0].style.bottom = "20%";
          }
          // chạy lại từ đầu
          i = 0;
        }
      }
    }
    part = words[i].substr(0, offset);
    // chữ chạy ngược
    if (skip_count == 0) {
      if (forwards) {
        offset++;
      } else {
        offset = 0;
        // offset--;
      }
    }

    document.getElementById("word").innerHTML = part;
  }, speed);
};

const soundEffect = new Audio("assets/musics/Falling You.mp3");

window.addEventListener("click", wordflick);
