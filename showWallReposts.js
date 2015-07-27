var bgFlag = 0;
var groupId = 0;
var counter = 0;
var posts = [];
try {
    groupId = document.getElementById("page_wall_header").href.split("wall")[1].split("?")[0];
} catch (e) {
    console.error(e);
}
var addPosts = function () {
    if (--counter !== 0) return;
    posts.sort(function (a, b) {
        return b[0] - a[0];
    });
    for (var x in posts) {
        var node = posts[x][1];
        node.style.borderBottom = "2px dashed #DAE1E8";
        node.style.borderLeft = "3px solid " + (bgFlag ? "rgb(247, 247, 255)" : "rgb(217, 224, 231)");
        node.style.borderRight = node.style.borderLeft;
        bgFlag = !bgFlag;
        document.getElementById("wrap1").appendChild(node);
    }
    posts = [];
}
var foundRepost = function (url) {
    ajax.post('wkview.php', { act: 'show', w: url }, {
    onDone: function(title, html, options, script) {
        var tmp = document.createElement("div");
        tmp.innerHTML = html;
        var node = tmp.children[0].children[2].children[0];
        var num = url.split("_");
        posts.push([+num[num.length - 1], node]);
        addPosts();
    },
    onFail: function(text) { console.error(text); }});
};
var loader = function (offset) {
    if (offset > 101) return;
    ajax.post('al_wall.php', {act: 'get_wall', owner_id: groupId, offset: offset, type: "own", fixed: ''}, {
        onDone: function (rows, names) {
            var tmp = document.createElement("div");
            tmp.innerHTML = rows;
            var step = tmp.children.length;
            for (var x = 0; x < step; x++)
            try {
                if (+tmp.children[x].children[0].children[1].children[2].children[0].children[1].children[2].innerHTML > 0) {
                    var page = tmp.children[x].id.replace(/post/, "shares/wall");
                    counter++;
                    foundRepost(page);
                }
            } catch (e) {
                console.error(e);
            }
            loader(offset + step);
        }
    });
}

if (!groupId) {
    alert("Скрипт: уважаемый Пользователь! Перейдите на персональную страницу или страницу группы, не вижу стену с сообщениями.")
} else {
    document.getElementById("wrap1").innerHTML = "";
    loader(0);
}
