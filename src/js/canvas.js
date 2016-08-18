export default class Canvas {
    static instance = null;

    constructor(opts) {
        if (Canvas.instance) return Canvas.instance;
        if (!(this instanceof Canvas)) return new Canvas(opts);


        opts = {
            canvasElementOrId: null,
            width: window.innerWidth,
            height: window.innerHeight,
            parent: document.getElementsByTagName('body')[0],
            renderers: [],
            ...opts
        };

        if (opts.canvasElementOrId) {
           this.cvs = opts.canvaselementOrId instanceof Element ? opts.canvasElementOrId : document.createElement('canvas');
        }
        if (!this.cvs) {
            this.cvs = document.createElement('canvas');
        }

        this.cvs.width = opts.width;
        this.cvs.height = opts.height;
        this.cvs.style.width = '100%';
        this.cvs.style.height = '100%';
        this.ctx = this.cvs.getContext('2d');
        this.renderers = [...opts.renderers];

        this.render();
        opts.parent.appendChild(this.cvs);

        Canvas.instance = this;
    }

    addRenderer(renderer){
        if (typeof renderer === 'function') this.renderers.push(renderer);
    }

    render(renderers) {
        this.ctx.fillStyle = 'rgba(0,0,0,0)';
        this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
        this.ctx.imageSmoothingEnabled = false;
        
        this.renderers.forEach( func => func(this.ctx) );
        Array.isArray(renderers) && renderers.forEach( func => func(this.ctx) );
    }
}