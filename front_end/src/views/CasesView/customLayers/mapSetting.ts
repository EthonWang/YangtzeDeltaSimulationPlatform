import mapboxgl, { Map, MapboxOptions } from 'mapbox-gl';

function changeRenderingContext(): void {
    // @ts-ignore
    if (mapboxgl.Map.prototype._setupPainter.toString().indexOf("webgl2") == -1) {
        // @ts-ignore
        const _setupPainter_old = mapboxgl.Map.prototype._setupPainter;
        // @ts-ignore
        mapboxgl.Map.prototype._setupPainter = function () {
            const getContext_old = this._canvas.getContext;
            this._canvas.getContext = function(name: any, options: any): any {  
                return getContext_old.apply(this, ["webgl2", options]) ||
                    getContext_old.apply(this, ['webgl', options]) ||
                    getContext_old.apply(this, ['experimental-webgl', options]);
            }
            _setupPainter_old.apply(this);
            this._canvas.getContext = getContext_old;
        };
    }
}

function getMap(accessToken: string, mapOption: MapboxOptions, needChangeContext = true): Map {

    if (needChangeContext) {
        changeRenderingContext();
    }

    mapboxgl.accessToken = accessToken;

    return new mapboxgl.Map(mapOption);
}

export {
    getMap,
};

