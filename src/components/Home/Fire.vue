<template>
  <canvas id="fire"></canvas>
</template>

<script setup>
class Fire {
  constructor() {
    this.canvas = document.getElementById("fire");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.height = window.innerHeight ;
    this.canvas.width = window.innerWidth;
    this.canvas.position = "fixed";
    // this.canvas.fillStyle="rgba(0,0,0,0)"
    this.aFires = [];
    this.aSpark = [];
    this.aSpark2 = [];

    this.mouse = {
      x: this.canvas.width * 0.5,
      y: this.canvas.height * 0.75  ,
    };

    this.init();
  }
  init() {
    this.canvas.addEventListener(
      "mousemove",
      this.updateMouse.bind(this),
      false
    );
  }
  run() {
    this.bRuning = !this.bRuning;

    if (this.bRuning) {
      this.update();
      this.draw();
      
    }
    requestAnimationFrame(this.run.bind(this));
  }
  start() {
    this.bRuning = true;
    this.run();
  }
  stop() {
    this.bRuning = false;
  }
  update() {
    this.aFires.push(new Flame(this.mouse));
    this.aSpark.push(new Spark(this.mouse));
    this.aSpark2.push(new Spark(this.mouse));

    for (let i = this.aFires.length - 1; i >= 0; i--) {
      if (this.aFires[i].alive) this.aFires[i].update();
      else this.aFires.splice(i, 1);
    }

    for (let i = this.aSpark.length - 1; i >= 0; i--) {
      if (this.aSpark[i].alive) this.aSpark[i].update();
      else this.aSpark.splice(i, 1);
    }

    for (let i = this.aSpark2.length - 1; i >= 0; i--) {
      if (this.aSpark2[i].alive) this.aSpark2[i].update();
      else this.aSpark2.splice(i, 1);
    }
  }
  draw() {
    // this.ctx.globalCompositeOperation = "source-over";
    this.ctx.fillStyle = "rgb(11, 28, 36)";
    this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    this.grd = this.ctx.createRadialGradient(
      this.mouse.x,
      this.mouse.y - 120,
      160,
      this.mouse.x,
      this.mouse.y - 60,
      0
    );
    this.grd.addColorStop(0, "rgba( 55, 55, 75, 0 )");
    this.grd.addColorStop(1, "rgba( 30, 10, 2, 0 )");
    // this.ctx.beginPath();
    // this.ctx.arc(this.mouse.x, this.mouse.y - 100, 200, 0, 2 * Math.PI);
    // this.ctx.fillStyle = this.grd;
    // this.ctx.fill();

    // this.ctx.font = "15em Amatic SC";
    // this.ctx.textAlign = "center";
    // this.ctx.strokeStyle = "rgb(50, 20, 100)";
    // // this.ctx.fillStyle="rgb(120, 10, 0)";
    // this.ctx.lineWidth = 2;
    // this.ctx.color="white"
    // this.ctx.strokeText(
    //   "长三角",
    //   this.canvas.width / 2,
    //   this.canvas.height * 0.72
    // );
    // this.ctx.fillText(
    //   "长三角",
    //   this.canvas.width / 2,
    //   this.canvas.height * 0.72
    // );

    // this.ctx.globalCompositeOperation = "overlay"; //or lighter or soft-light

    for (let i = this.aFires.length - 1; i >= 0; i--) {
      this.aFires[i].draw(this.ctx);
    }

    // this.ctx.globalCompositeOperation = "soft-light"; //"soft-light";//"color-dodge";

    for (let i = this.aSpark.length - 1; i >= 0; i--) {
      if (i % 2 === 0) this.aSpark[i].draw(this.ctx);
    }

    // this.ctx.globalCompositeOperation = "color-dodge"; //"soft-light";//"color-dodge";

    for (let i = this.aSpark2.length - 1; i >= 0; i--) {
      this.aSpark2[i].draw(this.ctx);
    }
  }
  updateMouse(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY  ;

    //this.aFires.push( new Flame( this.mouse ) );
  }
}

class Flame {
  constructor(mouse) {
    this.cx = mouse.x;
    this.cy = mouse.y;
    this.x = rand(this.cx - 6, this.cx + 6);
    this.y = rand(this.cy - 5, this.cy );
    this.vy = rand(1, 2);//往Y轴移动速度
    this.vx = rand(-1, 1);
    this.r = rand(5, 7);
    this.life = rand(1, 2);
    this.alive = true;
    this.c = {
      h: Math.floor(rand(2, 40)),
      s: rand(60,80),
      l: rand(40, 60),
      a: 0,
      ta: rand(0.6, 0.8),
    };
  }
  update() {
    this.y -= this.vy;
    this.vy += 0.03;

    this.x += this.vx;
    // this.vx -= 0.02*this.vx;
    if (this.x < this.cx) this.vx += 0.1;//中心靠拢
    else this.vx -= 0.1;

    if (this.r > 0) this.r -= 0.1;

    if (this.r <= 0) this.r = 0;

    this.life -= 0.15;

    if (this.life <= 0) {
      this.c.a -= 0.05;//逐渐消失

		if( this.c.a <= 0 )
			this.alive = false;
    } 
    else if (this.life > 0 && this.c.a < this.c.ta) {
      this.c.a += 0.05;
    }
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r * 3, 0, 2 * Math.PI);
    ctx.fillStyle =
      "hsla( " +
      this.c.h +
      ", " +
      this.c.s +
      "%, " +
      this.c.l +
      "%, " +
      this.c.a / 20 +
      ")";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fillStyle =
      "hsla( " +
      this.c.h +
      ", " +
      this.c.s +
      "%, " +
      this.c.l +
      "%, " +
      this.c.a +
      ")";
    ctx.fill();
  }
}

class Spark {
  constructor(mouse) {
    this.cx = mouse.x;
    this.cy = mouse.y;
    this.x = rand(this.cx - 15, this.cx + 15);
    this.y = rand(this.cy, this.cy + 3);
    this.lx = this.x;
    this.ly = this.y;
    this.vy = rand(1, 2);
    this.vx = rand(-2, 2);
    this.r = rand(0, 1)/2;
    this.life = rand(1, 3);
    this.alive = true;
    this.c = {
      h: Math.floor(rand(2, 40)),
      s: rand(80,100),
      l: rand(40, 90),
      a: rand(0.8, 0.9),
    };
  }
  update() {
    this.lx = this.x;
    this.ly = this.y;

    this.y -= this.vy;
    this.x += this.vx;

    if (this.x < this.cx) this.vx += 0.2;//中心聚拢
    else this.vx -= 0.2;
    // this.vx+=0.02*this.vx
    this.vy += 0.02;
    this.life -= 0.1;

    if (this.life <= 0) {
        this.c.a -= 0.05;

		if( this.c.a <= 0 )
			this.alive = false;
    }
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.lx, this.ly);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle =
      "hsla( " +
      this.c.h +
      ", " +
      this.c.s +
      "%, " +
      this.c.l +
      "%, " +
      this.c.a / 2 +
      ")";
    ctx.lineWidth = this.r * 2;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(this.lx, this.ly);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle =
      "hsla( " +
      this.c.h +
      ", " +
      this.c.s +
      "%, " +
      this.c.l +
      "%, " +
      this.c.a +
      ")";
    ctx.lineWidth = this.r;
    ctx.stroke();
    ctx.closePath();
  }
}

let rand = function (min, max) {
  return Math.random() * (max - min) + min;
};
onresize = function () {
  oCanvas.canvas.width = window.innerWidth;
  oCanvas.canvas.height = window.innerHeight;
};

let oCanvas;
const init = function () {
  oCanvas = new Fire();
  oCanvas.start();
};

setTimeout(init,300) 
</script>

<style lang="less" scoped>
canvas {
    // position: absolute;
    // top:0;
  background: rgba(112, 112, 112,0) !important;
  // pointer-events: none;
}
</style>