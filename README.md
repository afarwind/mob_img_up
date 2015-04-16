# mob_img_up
移动端图片上传demo

可能出现的问题：
1.对于长图，现有的压缩算法有问题，会把图片压的看不清。
2.对于利用canvas绘制图片的时候在IOS8版本以下可能会把图片自适应横向拉伸。
3.jpg格的图片都带有EXIF参数控制图片转向，经过压缩之后会丢失。
4.HTML file input 在 android webview (android 4.4, kitkat)下无法提交图片是个bug
