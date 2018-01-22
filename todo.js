var http = require('http');
var url = require('url');
var items = []; //用一个常规的JavaScript数组存放数据

var server = http.createServer(function(req, res){
    switch (req.method) {  //req.method是请求所用的HTTP方法
        case 'POST':
            var item = '';  //为进来的事项设置字符串缓存
            req.setEncoding('utf8');  //将进来的data事件编码为UTF-8字符串
            req.on('data', function(chunk){
                item += chunk;  //将数据块拼接到缓存上
            });
            req.on('end', function(){
                items.push(item);  //将完整的新事项压入事项数组中
                res.end('OK\n');
            });
            break;
        case 'GET':
            var body = items.map(function(item, i){
                return i + ') ' + item;
            }).join('\n');
            body = body + '\n';
            res.setHeader('Content-Length', Buffer.byteLength(body));
            res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
            res.end(body);
            break;
        case 'DELETE':  //在switch语句中添加DELETE case
            var path = url.parse(req.url).pathname;
            var i = parseInt(path.slice(1), 10);

            if (isNaN(i)) {  //检查数字是否有效
                res.statusCode = 400;
                res.end('Invalid item id');
            } else if (!items[i]) {  //确保请求的索引存在
                res.statusCode = 404;
                res.end('Item not found');
            } else {
                items.splice(i, 1);  //删除请求的事项
                res.end('OK\n');
            }
            break;
    }
});
server.listen(3000);