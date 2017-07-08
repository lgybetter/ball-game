import '../style/main.css'

class Ball {
  constructor(x, y, dx, dy, radius) {
    this.x = x // x坐标
    this.y = y // y坐标
    this.dx = dx // x速度
    this.dy = dy // y速度
    this.radius = radius
    this.strokeColor = "black"
    this.fillColor = "red"
  }
}

class Pane {
  constructor(x, y, width, height) {
    this.x = x
    this.y = y
    this.height = height
    this.width = width
    this.strokeColor = "black"
    this.fillColor = "red"
  }
}

let balls = []
let canvas
let context
let ballA, ballB, ballC, ballD, ballE, ballF, ballG, ballH, ballI, ballJ;
let paneA, paneB, paneC
let fixedBalls = []
let fixedPanes = []

function addBall() {
  // 小球半径
  let radius = 20;
  // 创建新的ball对象
  let ball = new Ball(350, 100, 0.1, 0.5, radius);
  // 将其保存在balls数组中
  balls.push(ball);
}


function clearBalls() {
  // 删除所有球对象
  balls = [];
}

function drawFrame() {
  // 清除画布
  context.clearRect(0, 0, canvas.width, canvas.height);
  initBall()
  // 循环所有的球
  for (let i = 0; i < balls.length; i++) {
    // 把每个球移动到新的位置
    let ball = balls[i];
    ball.x += ball.dx;
    ball.y += ball.dy;

    // 添加重力作用的效果，让球加速下落
    if ((ball.y) < canvas.height) ball.dy += 0.22;
    // 添加摩擦力作用的效果，减慢左右移动速度
    ball.dx = ball.dx * 0.998;
    // 如果球碰到某一边，就反弹回来
    if ((ball.x + ball.radius > canvas.width) || (ball.x - ball.radius < 0)) {
      ball.dx = -ball.dx;
    }
    // 如果球碰到底部，判断是否落在板子上，是的话就成功，否则失败
    let flag = false
    if ((ball.y + ball.radius > canvas.height) || (ball.y - ball.radius < 10)) {
      for(let i in fixedPanes) {
        if(ball.x > fixedPanes[i].x && ball.x < fixedPanes[i].x + fixedPanes[i].width) {
          flag = true
          break
        }
      }
      if (flag) {
        window.alert('成功')
      } else {
        window.alert('失败')
      }
      clearBalls()
    }
    for(let i in fixedBalls) {
      let _ball = fixedBalls[i]
      if(getCirleLength(ball, _ball) <= parseFloat((ball.radius + _ball.radius).toFixed(2))) {
        let speed = getSpeed(ball, _ball)
        let pos = getPos(ball, _ball)
        ball.dx = pos.x * speed.dx * 0.8
        ball.dy = pos.y * speed.dy * 0.8
        break
      }
    }
    drawCir(ball)
  }

  // 20毫秒后绘制下一帧
  setTimeout(drawFrame, 20);
}

function drawCir(ball) {
  context.beginPath();
  context.fillStyle = ball.fillColor;
  // 绘制球
  context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  context.lineWidth = 1;
  context.fill();
  context.stroke();
}

function drawRec(rec) {
  context.beginPath()
  context.fillStyle = rec.fillColor;
  context.rect(rec.x, rec.y, rec.width, rec.height);
  context.lineWidth = 1;
  context.fill();
  context.stroke();
}

function initBall () {
  let left = 150
  let top = 160
  fixedBalls = []
  fixedPanes = []
  ballB = new Ball(left + 200, top + 150, 1, 1, 20)
  ballC = new Ball(left + 300, top + 150, 1, 1, 20)
  ballD = new Ball(left + 150, top + 250, 1, 1, 20)
  ballE = new Ball(left + 250, top + 250, 1, 1, 20)
  ballF = new Ball(left + 350, top + 250, 1, 1, 20)  
  ballG = new Ball(left + 100, top + 350, 1, 1, 20)  
  ballH = new Ball(left + 200, top + 350, 1, 1, 20)  
  ballI = new Ball(left + 300, top + 350, 1, 1, 20)  
  ballJ = new Ball(left + 400, top + 350, 1, 1, 20)
  paneA = new Pane(270, 590, 60, 10)
  paneB = new Pane(370, 590, 40, 10)  
  paneC = new Pane(470, 590, 70, 10)
  fixedBalls.push(ballB)
  fixedBalls.push(ballC)
  fixedBalls.push(ballD)
  fixedBalls.push(ballE)
  fixedBalls.push(ballF)
  fixedBalls.push(ballG)
  fixedBalls.push(ballH)
  fixedBalls.push(ballI)
  fixedBalls.push(ballJ)
  fixedPanes.push(paneA)
  fixedPanes.push(paneB)
  fixedPanes.push(paneC)  
  for(let i in fixedBalls) {
    drawCir(fixedBalls[i])
  }
  for(let i in fixedPanes) {
    drawRec(fixedPanes[i])
  }
  
}

(function () {
  let addBtn = document.getElementById('addBall')
  let clearBtn = document.getElementById('clearBalls')
  // 监听点击事件添加小球
  addBtn.addEventListener('click', addBall)
  // 监听点击事件清除所有小球
  clearBtn.addEventListener('click', clearBalls)
  canvas = document.getElementById("canvas")
  context = canvas.getContext("2d")
  // 每0.02秒绘制一次画布
  setTimeout(drawFrame, 20)
})()

// 获取碰撞后分解的速度
function getSpeed(ball1, ball2) {
  let a = parseFloat(Math.abs(ball1.x - ball2.x))
  let b = parseFloat(Math.abs(ball1.y - ball2.y))
  let sinx = parseFloat((a / Math.sqrt(a * a + b * b)).toFixed(2))
  let cosx = parseFloat((b / Math.sqrt(a * a + b * b)).toFixed(2))
  let preSpeed = parseFloat((Math.sqrt(ball1.dx * ball1.dx + ball1.dy * ball1.dy)).toFixed(2))
  return {
    dx: parseFloat((preSpeed * sinx).toFixed(2)),
    dy: parseFloat((preSpeed * cosx).toFixed(2))
  }
}

// 求圆心之间的距离
function getCirleLength(ball1, ball2) {
  let x = ball1.x - ball2.x
  let y = ball1.y - ball2.y
  return parseFloat(Math.sqrt(x * x + y * y).toFixed(2))
}

function getPos(ball1, ball2) {
  let x = ball1.x - ball2.x < 0 ? -1 : 1
  let y = ball1.y - ball2.y < 0 ? -1 : 1
  return {
    x,
    y
  }
}