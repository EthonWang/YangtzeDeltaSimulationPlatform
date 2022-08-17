import mapboxgl from 'mapbox-gl';

/**
 * Abstract Class for mapboxgl custom layer
 */
class CustomLayer implements mapboxgl.CustomLayerInterface{
    type: "custom";

    /**
     * Create new Mapboxgl custom layer
     * @param id layer id
     * @param renderingMode '2d' or '3d'
     */
    constructor(public id: string, public renderingMode: "2d" | "3d" | undefined) {
        this.type = "custom";
    }
    
    /**
     * Triggered when this custom layer is called to be added to map
     * @param map current mapbox map
     * @param gl mapbox rendering context
     */
    onAdd(map: mapboxgl.Map, gl: WebGL2RenderingContext): void {
        // console.log("custom layer on add...");
        // console.log('current map', map);
        // console.log('current context', gl);
    }

    /**
     * Render to a frame instead of screen
     * @param gl mapbox render context
     * @param u_matrix mapbox camera view projection matrix
     */
    prerender?(gl: WebGL2RenderingContext, u_matrix: Array<number>): void {
        // console.log("custom layer prerender");
        // console.log('current context', gl);
        // console.log('current matrix', u_matrix);
    }

    /**
     * Triggered when every frame being rendered
     * @param gl mapbox render context
     * @param u_matrix mapbox camera view projection matrix
     */
    render(gl: WebGL2RenderingContext, u_matrix: Array<number>): void {
        // console.log("custom layer on render");
        // console.log('current context', gl);
        // console.log('current matrix', u_matrix);
    }
}

export {
    CustomLayer
}