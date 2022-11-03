$(function(){

    // 调用getUserInfo()函数获取用户基本信息
    getUserInfo()

    var layer = layui.layer

    $("#btnLogout").on('click',function(){
        // console.log("ok");
        // 提示用户是否确认退出
        layer.confirm('确定退出登录？', {icon: 3, title:'提示'}, function(index){

            // 用户点击确定
            // console.log("ok");

            // 1.清空本地存储中的token
            localStorage.removeItem('token')
            // 2.重新跳转到登录页面
            location.href = '/login.html'
            
            // 使用的是layui的话就必须用这句，用于关闭对应的弹出层(confirm询问框)
            layer.close(index);
          });
    })
})

// 获取用户的基本信息
function getUserInfo(){
    $.ajax({
        method:'GET',
        url: '/my/userinfo',
        // headers就是请求头配置对象
        /* headers:{
            Authorization:localStorage.getItem('token') || ''
        }, */
        success:function(res){
            // console.log(res);
            if(res.status !== 0){
                return layui.layer.msg('获取用户信息失败！')
            }
            // 调用renderAvatar()渲染用户的头像
            renderAvatar(res.data)
        },

        // 用户没登录的状态下，不允许跳转后需要身份认证的页面【验证该次的身份认证是成功了还是失败了】
        // 因为jquery的ajax中不论成功还是失败，执行完成功或失败的函数后，最终都会调用complete回调函数
        /* complete:function(res){
            // console.log("执行了complete回调")
            // console.log(res);
            // 在complete回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据
            if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
                // 1.强制清空token
                localStorage.removeItem('token')
                // 2.强制跳转到登录页面
                location.href = '/login.html'
            }
        } */
    })
}


// 渲染用户的头像的函数
function renderAvatar(user){
    // 1.获取用户的名称 【因为有昵称和用户名，如果有昵称就用昵称，没有昵称才用用户名】
    var name = user.nickname || user.username
    // 2.设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 3.按需渲染用户头像 【如有图片头像就以图片头像为准，没有图片头像再去渲染文本头像】
    if(user.user_pic !== null){
        // 3.1 渲染图片头像
        $(".layui-nav-img").attr('src',user.user_pic).show()
        $(".text-avatar").hide()
    }else{
        // 3.2 渲染文本头像
        $(".layui-nav-img").hide()
        // 用户名的name[0]第一个字符 toUpperCase()转为大写字母
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}