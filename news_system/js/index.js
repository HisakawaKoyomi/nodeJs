ajax({
    'url': 'http://localhost:2936',
    'type': 'get',
    'success': function (data) {
        var arrData = eval('('+data+')');
        window.allArr = [];
        var miniArr = [];

        for (var i = 0;i < arrData.length;i++){
            miniArr.push(arrData[i]);
                if ((i + 1) % 5 === 0){
                    allArr.push(miniArr);
                    miniArr = [];
                }else if (i === arrData.length - 1){
                    allArr.push(miniArr);
                }
        }

        for (var i = 0;i < allArr.length;i++){
            var oli = document.createElement('li');
            if (i === 0){
                oli.className = 'current';
            }
            oli.innerHTML = '<a href="javascript:;" class="changePage">' + (Number(i) + 1) + '</a>';
            pager.appendChild(oli);
        }



        for (var i = 0;i < allArr[0].length;i++){
            var uli = document.createElement('li');
            uli.innerHTML = '<a href="javascript:;" id="title" class="title">' + allArr[0][i] + '</a>';
            allTitle.appendChild(uli);
        }
    }
});

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
            user.value = '';
            pass.value = '';
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
            if (data === '登录成功'){
                mask.style.display = loginNode.style.display = sign.style.display = login.style.display = 'none';
                sPan.innerHTML = user.value;
                sPan.style.display = edit.style.display = cls_header.style.display = 'inline-block';
            }
            if (data === '管理员登录成功'){
                mask.style.display = loginNode.style.display = sign.style.display = login.style.display = 'none';
                sPan.innerHTML = '尊敬的管理员 ' + user.value;
                sPan.style.display = edit.style.display = check.style.display = cls_header.style.display = 'inline-block';
            }
            user.value = '';
            pass.value = '';
        }
    })
};

cls_header.onclick = function () {
    alert('您已退出账号');
    sPan.style.display = edit.style.display = cls_header.style.display = check.style.display = 'none';
    sign.style.display = login.style.display = 'inline-block';
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
            ajax({
                'url': 'http://localhost:2936',
                'type': 'get',
                'success': function (data) {
                    var arrData = eval('('+data+')');
                    window.allArr = [];
                    var miniArr = [];

                    for (var i = 0;i < arrData.length;i++){
                        miniArr.push(arrData[i]);
                        if ((i + 1) % 5 === 0){
                            allArr.push(miniArr);
                            miniArr = [];
                        }else if (i === arrData.length - 1){
                            allArr.push(miniArr);
                        }
                    }

                    pager.innerHTML = '';
                    allTitle.innerHTML = '';

                    for (var i = 0;i < allArr.length;i++){
                        var oli = document.createElement('li');
                        oli.innerHTML = '<a href="javascript:;" class="changePage">' + (Number(i) + 1) + '</a>';
                        pager.appendChild(oli);
                    }

                    for (var i = 0;i < allArr[0].length;i++){
                        var uli = document.createElement('li');
                        uli.innerHTML = '<a href="javascript:;" id="title" class="title">' + allArr[0][i] + '</a>';
                        allTitle.appendChild(uli);
                    }
                }
            });
        }
    })
};

check.onclick = function () {
    mask.style.display = 'block';
    userList.style.display = 'block';
    ajax({
        'url': 'http://localhost:8881',
        'type': 'get',
        'success': function (data) {
            var arr = eval('('+ data +')');
            for (var i = 0;i < arr.length;i++){
                var li = document.createElement('li');
                li.innerHTML = '<span>'+ arr[i] +'</span><a href="javascript:;" class="deleteUser">删除</a>';
                list.appendChild(li);
            }

        }
    })
};
cls_list.onclick = function () {
    mask.style.display = 'none';
    userList.style.display = 'none';
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

    if (iTarget.className === 'changePage'){
        allTitle.innerHTML = '';
        for (var i = 0;i < allArr[iTarget.innerHTML - 1].length;i++){
            var uli = document.createElement('li');
            uli.innerHTML = '<a href="javascript:;" id="title" class="title">' + allArr[iTarget.innerHTML - 1][i] + '</a>';
            allTitle.appendChild(uli);
        }

        var olis = document.getElementsByClassName('changePage');
        for (var i = 0;i < olis.length;i++){
            olis[i].parentNode.className = '';
        }
        olis[iTarget.innerHTML - 1].parentNode.className = 'current';
    }

    if (iTarget.className === 'deleteUser'){
        ajax({
            'url': 'http://localhost:9992',
            'type': 'get',
            'data': {
                name: iTarget.parentNode.children[0].innerHTML
            },
            'success': function (data) {
                alert(data);
                iTarget.parentNode.remove();
            }
        })
    }
};

cls_news.onclick = function () {
    newsNode.style.display = 'none';
};


