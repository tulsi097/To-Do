let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let dark = localStorage.getItem("theme") === "dark";

if(dark) $("body").addClass("dark");

const priorityOrder = { High: 1, Medium: 2, Low: 3 };

function save(){
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function render(){
  $("#taskList").empty();

  tasks.sort((a,b)=> priorityOrder[a.priority] - priorityOrder[b.priority]);

  tasks.forEach((t,i)=>{
    $("#taskList").append(`
      <li data-i="${i}" class="${t.priority.toLowerCase()}">
        <div class="task-left">
          <span class="text ${t.completed?'completed':''}">
            ${t.emoji} <b>${t.title}</b>
          </span>
          <small>${t.desc}</small>
          <small>${t.time}</small>
        </div>

        <div class="task-right">
          <span class="priority">${t.priority}</span>
          <button class="done">✔</button>
          <button class="del">❌</button>
        </div>
      </li>
    `);
  });

  updateStats();
}

function updateStats(){
  let total = tasks.length;
  let done = tasks.filter(t=>t.completed).length;

  $("#stats").html(`
    Total: ${total} | Done: ${done} | Left: ${total-done}
  `);
}

$("#addBtn").click(()=>{
  let title = $("#titleInput").val();
  let desc = $("#descInput").val();
  let priority = $("#priority").val();
  let emoji = $("#emojiInput").val() || "📌";

  if(title){
    tasks.push({
      title,
      desc,
      priority,
      emoji,
      completed:false,
      time:new Date().toLocaleTimeString()
    });

    save();
    render();

    $("#titleInput,#descInput,#emojiInput").val("");
  }
});

$("#taskInput").keypress(function(e){
  if(e.which === 13) $("#addBtn").click();
});

$("#taskList").on("click",".done",function(){
  let i=$(this).closest("li").data("i");
  tasks[i].completed=!tasks[i].completed;
  save(); render();
});

$("#taskList").on("click",".del",function(){
  let i=$(this).closest("li").data("i");
  tasks.splice(i,1);
  save(); render();
});

$("#clearAll").click(()=>{
  if(confirm("Delete all tasks?")){
    tasks=[]; save(); render();
  }
});

$("#clearCompleted").click(()=>{
  tasks = tasks.filter(t=>!t.completed);
  save(); render();
});

$("#search").on("keyup",function(){
  let val=$(this).val().toLowerCase();
  $("#taskList li").filter(function(){
    $(this).toggle($(this).text().toLowerCase().includes(val));
  });
});

$(".emoji").click(function(){
  $("#emojiInput").val($(this).text());
});

$("#themeToggle").click(function(){
  $("body").toggleClass("dark");
  localStorage.setItem("theme", $("body").hasClass("dark")?"dark":"light");
});

// AJAX
$("#loadQuote").click(function(){

  $("#quote").text("Loading...");

  $.ajax({
    url: "https://api.quotable.io/random",
    method: "GET",
    timeout: 3000,

    success: function(data){
      $("#quote").text("💬 " + data.content + " — " + data.author);
    },

    error: function(){

      // FALLBACK QUOTES (VERY IMPORTANT)
      let quotes = [
        "Stay consistent, success will follow.",
        "Small steps daily lead to big results.",
        "Discipline beats motivation.",
        "Focus on progress, not perfection.",
        "Your future is built today."
      ];

      let random = quotes[Math.floor(Math.random() * quotes.length)];

      $("#quote").text("💬 " + random );
    }
  });

});

$("#startBtn").click(()=>{
  $("#home").fadeOut(300, function(){
    $("#home").removeClass("active");
    $("#app").addClass("active").hide().fadeIn(300);
  });
});

$(".tab").click(function(){
  $(".tab").removeClass("active");
  $(this).addClass("active");

  $(".tab-content").removeClass("active");
  $("#" + $(this).data("tab")).addClass("active");
});

render();