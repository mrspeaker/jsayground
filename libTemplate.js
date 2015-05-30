module.exports = `
<div id="board"></div>

<script>

function main () {

  var w = 640;
  var h = 300;
  var renderer = new CanvasRenderer(w, h);
  document.querySelector('#board').appendChild(renderer.view);

  var scene = new Container();

  var txt = new Text('hey!', {font:'30pt helvetica', fill:'red'});
  txt.pos = {x: 20, y: 50};
  scene.add(txt);

  // Main loop
  var dt, last, t;

  function loopy (t) {
    requestAnimationFrame(loopy);

    if (!last) last = t;
    dt = t - last;
    last = t;

    txt.pos.y += Math.sin(t / 1000) * 0.9;

    // Update & render everything
    scene.update(dt, t);
    renderer.render(scene);

  }
  requestAnimationFrame(loopy);

}

window.addEventListener('load', function () {
  main();
}, false);

function Container () {
  this.pos = {x: 0, y: 0};
  this.children = [];
}

Container.prototype = {

  add: function (child) {
    this.children.push(child);
  },

  remove: function (child) {
    this.children = this.children.filter(function (c) {
      return c !== child;
    });
  },

  update: function (dt, t) {
    this.children.forEach(function (child) {
      if (child.update) {
        child.update(dt, t);
      }
    });
  }

};

function Text (text, style) {
  this.text = text;
  this.style = style;
}

function Texture (url) {
  this.img = new Image();
  this.img.src = url;
}

function Sprite (texture) {
  this.texture = texture;
  this.pos = { x: 0, y: 0 };
  this.scale = { x: 1, y: 1 };
  this.pivot = { x: 0, y: 0 };
}

function TileSprite (texture, w, h) {
  Sprite.call(this, texture);
  this.tileW = w;
  this.tileH = h;
  this.frame = { x: 0, y: 0 };
}
TileSprite.prototype = Object.create(Sprite.prototype);


function CanvasRenderer (w, h) {
  var canvas = document.createElement('canvas');
  this.w = canvas.width = w;
  this.h = canvas.height = h;
  this.view = canvas;
  this.ctx = canvas.getContext('2d');
}
CanvasRenderer.prototype = {
  render: function (container) {
    // Render the container
    var ctx = this.ctx;

    function render (container) {
      // Render the container children
      var pos = container.pos;

      container.children.forEach(function (child) {
        ctx.save();
        if (child.pos) ctx.translate(child.pos.x, child.pos.y);
        if (child.scale) ctx.scale(child.scale.x, child.scale.y);
        if (child.rotation) ctx.rotate(child.rotation);

        var pivotX = child.pivot && child.pivot.x || 0;
        var pivotY = child.pivot && child.pivot.y || 0;

        // Handle the child types
        if (child.children) {
          render(child);
        }
        else if (child.text) {
          ctx.font = child.style.font;
          ctx.fillStyle = child.style.fill;
          ctx.fillText(child.text, -pivotX, -pivotY);
        }
        else if (child.texture) {
          ctx.drawImage(child.texture.img, -pivotX, -pivotY);
        }

        ctx.restore();
      });
    }

    ctx.clearRect(0, 0, this.w, this.h);
    render(container);
  }
};

</script>
`;
