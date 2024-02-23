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
  speed = 80;

var wordflick = function () {
  setInterval(function () {
    // chữ chạy tiến
    if (forwards) {
      console.log("🔥 - forwards:", forwards);
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
        if (i >= len) {
          i = 0;
        }
      }
    }
    part = words[i].substr(0, offset);
    // chữ chạy ngược
    if (skip_count == 0) {
      console.log("🔥 - skip_count:", skip_count);
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

window.addEventListener("click", wordflick);
