require('babel-polyfill');
import $ from 'jquery';
require("./index.css");
// 页面加载商品
$(
    $.get('./static/data.json', function (data) {
        $(data).each(function () {
            $('#nav').append("<ul class='food'><li><img src=" + this.img + "></li><li><span class='name'>" + this.name + "</span> <span class='pice'>" + this.pice + "</span><span>元/每份</span></li><li><span>" + this.number + "</span></li><li> <span>起送￥" + this.starPice + "</span> <span >免配送费 </span> <span >" + this.time + "分钟 </span></li ><li><input type='button' value='加入购物车' class='cart'></li>")
        })
        // 加入购物车事件
        $('#nav').on('click', 'input', function () {
            let index = $('.cart').index($(this))
            data[index].count++;
            localStorage.setItem('merch', JSON.stringify(data))
            let shop = JSON.parse(localStorage.getItem('merch'))
            if (shop[index].count == 1) {
                $('#tab').append("<tr><td><input type='checkbox'></td><td class='shop_name'>" + shop[index].name + "</td><td>" + shop[index].pice + "</td><td>" + shop[index].count + "</td><td><input type='button' value='删除' class='del'></td></tr>")
            } else if (shop[index].count > 1) {
                $('.shop_name').each(function () {
                    if ($(this).html() == shop[index].name) {
                        $(this).next().next().html(shop[index].count)
                    }
                })
            }
            shopNumber()
        })
        // 删除行
        $('#tab').on('click', '.del', function () {
            for (let item of data) {
                if (item.name == $(this).parent().prev().prev().prev().html()) {
                    item.count = 0
                }
            }
            localStorage.setItem('merch', JSON.stringify(data))
            $(this).parent().parent().remove()
            shopNumber()
            if ($(':checkbox:gt(0):checked').length == $(':checkbox:gt(0)').length) {
                $(':checkbox').eq(0).prop('checked', true)
            } else {
                $(':checkbox').eq(0).prop('checked', false)
            }
        })
        // 全部删除
        $('#alldel').click(function () {
            for (let item of data) {
                item.count = 0
            }
            localStorage.setItem('merch', JSON.stringify(data))
            $('tr:gt(0)').remove()
            shopNumber()
            $(':checkbox').eq(0).prop('checked', false)
        })
        // 全选
        $(':checkbox').eq(0).click(function () {
            $(':checkbox').each(function () {
                $(this).prop('checked', $(':checkbox').eq(0).prop('checked'))
            })
        })

        // 反选
        $('#tab').on('click', ':checkbox:gt(0)', function () {
            if ($(':checkbox:gt(0):checked').length == $(':checkbox:gt(0)').length) {
                $(':checkbox').eq(0).prop('checked', true)
            } else {
                $(':checkbox').eq(0).prop('checked', false)
            }
        })
        // 结算
        $('#monk').click(function () {
            var monkey = 0
            $(':checkbox:gt(0):checked').each(function () {
                let pice = $(this).parent().next().next().html()
                let count = $(this).parent().next().next().next().html()
                monkey = monkey + pice * count
            })
            $('#monkey').html(parseFloat(monkey))
            alert('确认结算吗？')
            $(':checkbox:gt(0):checked').each(function () {
                for (let item of data) {
                    if (item.name == $(this).parent().next().html()) {
                        item.count = 0
                    }
                }
            })
            localStorage.setItem('merch', JSON.stringify(data))
            $(':checkbox:gt(0):checked').parent().parent().remove()
            $('#monkey').html(0)
            shopNumber()
            $(':checkbox').eq(0).prop('checked', false)
        })
        // 购物车数量
        function shopNumber() {
            let obj = JSON.parse(localStorage.getItem('merch'))
            let sum = 0
            for (let item of obj) {
                sum = sum + item.count
            }
            $('#sum').html(sum)
        }
        // 网页隐藏
        $('.shop_cart').css('display', 'none')
        // 显示购物车
        $('#skip').click(function () {
            $('#nav').css('display', 'none')
            $('.shop_cart').css('display', 'block')
        })
        // 继续购物
        $('#order').click(function () {
            $('.shop_cart').css('display', 'none')
            $('#nav').css('display', 'flex')
        })
    }))