


$.fn.LocalResizeIMG = function(obj) {
    var defaults = {
        max_size : 600,
        min_size : 80,
        quality : 0.8
    };
    var options = $.extend(defaults, obj);


    this.on('change', function() {

        var file = this.files[0];
        var URL = URL || webkitURL;
        var blob = URL.createObjectURL(file);

        // 执行前函数
        if($.isFunction(obj.before)) { obj.before(this, blob, file) }

        //this.value = '';   // 清空临时数据
        load_image(file);
    });

    function is_android() {
        var ua = navigator.userAgent.toLowerCase();
        is_android_browser = ua.indexOf("android") > -1;
        return is_android_browser;
    }

    function is_ios() {
        var ua = navigator.userAgent.toLowerCase();
        is_android_browser = ua.indexOf("iphone") > -1;
        return is_android_browser;
    }

    function load_image(file) {
        if (! file.type.match(/image.*/)) {
            if (window.console) {
                console.log("只能选图片");
            }else {
                window.confirm("只能选图片");
            }
            return ;
        }

        var reader = new FileReader() ;
        reader.onloadend = function(e) {
            render(e.target.result);
        };

        reader.readAsDataURL(file);
    }


    //渲染
    function render(ImgData) {
        var img = new Image() ;
        img.src = ImgData;

        img.onload = function () {
            var this_img = this;

            var w = this_img.width, lit_w, lit_h,
                h = this_img.height,
                scale = w/h;


            if (Math.min(w,h) > options.max_size) {
                if (w > h) {
                    h=options.max_size; w=h*scale;
                    lit_h = options.min_size; lit_w = lit_h * scale;
                }
                else {
                    w=options.max_size; h = w/scale;
                    lit_w = options.min_size ; lit_h = w/scale;
                }
            }

            EXIF.getData(this);
            var orientation = EXIF.getTag(this, "Orientation") || 1;

            var rotate_degree = 0;
            switch(orientation) {
                case 1:
                    rotate_degree = 0; break;
                case 8:
                    rotate_degree = -90;
                    break;
                case 3:
                    rotate_degree = 180;
                    break;
                case 6:
                    rotate_degree = 90;
                    break;
            }

            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');

            if (rotate_degree == 90 || rotate_degree == -90) {
                $(canvas).attr({width: h, height: w});

            }else {
                $(canvas).attr({width: w, height: h});
            }


            var canvas_width = $(canvas).attr("width");
            var canvas_height = $(canvas).attr("height");

            if (is_ios()) {
                var mp_img = new MegaPixImage(img);
                mp_img.render(canvas, {maxWidth:w, maxHeight:h, orientation:orientation});
            }else {
                ctx.translate(canvas_width/2, canvas_height/2);
                ctx.rotate(rotate_degree * Math.PI/180);
                ctx.drawImage(this_img, -w/2,-h/2, w,h);
            }




            var base64 = canvas.toDataURL("image/jpeg", options.quality || 0.8);



            if (base64.indexOf("image/jpeg") > 0) {
            } else {
                var encoder = new JPEGEncoder((options.quality*100) || 80);
                var ImgData = ctx.getImageData(0,0,canvas_width,canvas_height);
                base64 = encoder.encode(ImgData);
            }

            var result = {
                base64: base64,
                clearBase64: base64.substr( base64.indexOf(',') + 1 )
            };

            obj.success(result);

        };
    }
};
