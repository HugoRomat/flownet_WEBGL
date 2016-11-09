var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var cola;
(function (cola) {
    var D3StyleLayoutAdaptor = (function (_super) {
        __extends(D3StyleLayoutAdaptor, _super);
        function D3StyleLayoutAdaptor() {
            _super.call(this);
            this.event = d3.dispatch(cola.EventType[cola.EventType.start], cola.EventType[cola.EventType.tick], cola.EventType[cola.EventType.end]);
            var d3layout = this;
            this.drag = function () {
                var drag = d3.behavior.drag()
                    .origin(function (d) { return d; })
                    .on("dragstart.d3adaptor", cola.Layout.dragStart)
                    .on("drag.d3adaptor", function (d) {
                    d.px = d3.event.x, d.py = d3.event.y;
                    d3layout.resume();
                })
                    .on("dragend.d3adaptor", cola.Layout.dragEnd);
                if (!arguments.length)
                    return drag;
                this
                    .call(drag);
            };
        }
        D3StyleLayoutAdaptor.prototype.trigger = function (e) {
            var d3event = { type: cola.EventType[e.type], alpha: e.alpha, stress: e.stress };
            this.event[d3event.type](d3event);
        };
        D3StyleLayoutAdaptor.prototype.kick = function () {
            var _this = this;
            d3.timer(function () { return _super.prototype.tick.call(_this); });
        };
        D3StyleLayoutAdaptor.prototype.on = function (eventType, listener) {
            if (typeof eventType === 'string') {
                this.event.on(eventType, listener);
            }
            else {
                this.event.on(cola.EventType[eventType], listener);
            }
            return this;
        };
        return D3StyleLayoutAdaptor;
    }(cola.Layout));
    cola.D3StyleLayoutAdaptor = D3StyleLayoutAdaptor;
    function d3adaptor() {
        return new D3StyleLayoutAdaptor();
    }
    cola.d3adaptor = d3adaptor;
})(cola || (cola = {}));
