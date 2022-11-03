$(function(){
    // 点击 “注册账号” 的链接
    $("#link_reg").on('click',function(){
        $(".login-box").hide()
        $(".reg-box").show()
    })
    // 点击 “登录账号” 的链接
    $("#link_login").on('click',function(){
        $('.reg-box').hide()
        $(".login-box").show()
    })

    // 从layui中获取form对象 【只要导入了layui.js文件即有了form对象】
    var form = layui.form
    // layui的内置方法：提示信息
    var layer = layui.layer

    // 通过form.verify()函数自定义校验规则
    form.verify({
        // 自定义了一个叫做 pwd 校验规则 [\S]：非空格
        pwd: [/^[\S]{6,12}$/,'密码必须6到12位,且不能出现空格'],
        // 检验两次密码是否一致的规则
        repwd:function(value){
            // 通过形参拿到的是确认密码框中的内容，还需要拿到密码框中的内容，然后进行一次是否相等的判断，如果判断失败则return一个错误的提示消息
            var pwd = $('.reg-box [name=password]').val()
            if(pwd !== value){
                return '两次密码不一致！'
            }
        }
    })

    // 监听注册表单的提交事件
    $("#form_reg").on('submit',function(e){
        // 1.阻止表单的默认提交行为
        e.preventDefault()
        // 2.发起Ajax的POST请求 
        // 【手动拼接数据】
        var data = {username:$("#form_reg [name=username]").val(),password:$("#form_reg [name=password]").val()}
        $.post('/api/reguser',data,function(res){
        if(res.status !== 0){
            // return console.log(res.message);
            return layer.msg(res.message)
        }
        // console.log('注册成功');
        layer.msg('注册成功，请登录')

        // 模拟人的点击行为（相当于点击了 登录账号 跳转到了登录的div）
        $("#link_login").click()


        })
    })

    // 监听登录表单的提交事件
    $("#form_login").submit(function(e){
        // 阻止默认提交行为
        e.preventDefault()

        $.ajax({
            url:'/api/login',
            method:'POST',
            // 快速获取表单中的数据
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('登录失败')
                }
                layer.msg('登录成功')
                console.log(res.token);
                // 将登录成功得到的token字符串保存到localStorage中
                localStorage.setItem('token',res.token)

                // 跳转到后台主页
                location.href = '/index.html'
            }
        })
    })
})