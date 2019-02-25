/*ajax({
    
});*/

sign.onclick = function () {
    mask.style.display = 'block';
    loginNode.style.display = 'block';
};
login.onclick = function () {
    mask.style.display = 'block';
    loginNode.style.display = 'block';
};
cls_login.onclick = function () {
    mask.style.display = 'none';
    loginNode.style.display = 'none';
};

sg.onclick = function () {
    if (user.value === '' || pass.value === ''){
        alert('不能为空');
        return
    }
    ajax({
        'url': 'http://localhost:2933',
        'type': 'get',
        'data': {
            user: user.value,
            pass: pass.value
        },
        'success': function (data) {
            alert(data);
        }
    })
};
lg.onclick = function () {
    if (user.value === '' || pass.value === ''){
        alert('不能为空');
        return
    }
    ajax({
        'url': 'http://localhost:2934',
        'type': 'get',
        'data': {
            user: user.value,
            pass: pass.value
        },
        'success': function (data) {
            alert(data);
            if (data == '登录成功'){
                mask.style.display = loginNode.style.display = sign.style.display = login.style.display = 'none';
                sPan.innerHTML = user.value;
                sPan.style.display = edit.style.display = 'inline-block';
            }
            if (data === '管理员登录成功'){
                mask.style.dispaly = loginNode.style.display = sign.style.display = login.style.display = 'none';
                sPan.innerHTML = '尊敬的管理员' + user.value;
                sPan.style.display = edit.style.display = check.style.display = 'inline-block';
            }
        }
    })
};



edit.onclick = function () {
    mask.style.display = 'block';
    editNode.style.display = 'block';
};
cls_edit.onclick = function () {
    mask.style.display = 'none';
    editNode.style.display = 'none';
};
submit.onclick = function () {
    mask.style.display = 'none';
    editNode.style.display = 'none';
    ajax({
        'url': 'http://localhost:2935',
        'type': 'get',
        'data': {
            editTitle: edit_title.value,
            editContent: edit_content.value
        },
        'success': function (data) {
            alert(data);
        }
    })
};

document.onclick = function (e) {
    var ev = e || event;
    var iTarget = ev.srcElement || ev.target;
    
    if (iTarget.className === 'title'){
        ajax({
            'url': 'http://localhost:2937',
            'type': 'get',
            'data': {
                title: iTarget.innerHTML
            },
            'success': function (data) {
                news.innerHTML = data;
                newsNode.style.display = 'block';
            }
        })
    }
};

cls_news.onclick = function () {
    newsNode.style.display = 'none';
};

