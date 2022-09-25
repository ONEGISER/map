import {
    defined,
    Event,
    Color,
    Material,
    Property,
    createPropertyDescriptor,
} from "cesium";
const EarthPolylineTrailLink = "EarthPolylineTrailLink"
const _Property: any = Property
const _Material: any = Material
export interface EarthPolylineTrailLinkMaterialPropertyOption {
    color?: Color
    duration?: number
    image?: string
    repeat?: EarthRepeat
}

export interface EarthRepeat {
    x: number
    y: number
  }

export class EarthPolylineTrailLinkMaterialProperty {
    _color: any
    _definitionChanged: any
    _colorSubscription: any
    duration: number
    _time: number
    type?: string
    color?: Color
    repeat?: EarthRepeat
    image?: string
    get isConstant() {
        return false
    }
    get definitionChanged() {
        return this._definitionChanged;
    }
    constructor(options: EarthPolylineTrailLinkMaterialPropertyOption) {
        if (!defined(options)) {
            options = {};
        }
        const { color, duration, image, repeat } = options;
        this._definitionChanged = new Event();
        this._color = undefined;
        this._colorSubscription = undefined;
        this.duration = duration ? duration : 0;
        this._time = new Date().getTime();
        this.type = EarthPolylineTrailLink;
        this.color = color;
        this.repeat = repeat || { x: 1, y: 1 };
        this.image = image
        this.init();
    }
    init() {
        const m = _Material._materialCache.getMaterial(EarthPolylineTrailLink)
        if (!m) {
            _Material._materialCache.addMaterial(EarthPolylineTrailLink, {
                fabric: {
                    type: EarthPolylineTrailLink,
                    uniforms: {
                        color: new Color(0.0, 0.0, 0.0, 0.001),
                        image: this.image,
                        time: 0,
                        repeat: { x: 1, y: 1 },
                    },
                    source: "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
                                                  {\n\
                                                       czm_material material = czm_getDefaultMaterial(materialInput);\n\
                                                       vec2 st = materialInput.st*repeat;\n\
                                                       vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));\n\
                                                       material.alpha = colorImage.a * color.a;\n\
                                                       //material.diffuse = (colorImage.rgb+color.rgb)/2.0;\n\
                                                       material.diffuse = color.rgb;\n\
                                                       return material;\n\
                                                   }",
                },
                translucent: function (material: any) {
                    return true;
                },
            });
        }
    }
    getType(time: any) {
        return this.type;
    }
    getValue(time: any, result: any) {
        if (!defined(result)) {
            result = {};
        }
        result.color = _Property.getValueOrClonedDefault(
            this._color,
            time,
            Color.WHITE,
            result.color
        );
        result.image = this.image
        result.repeat = this.repeat
        result.time = ((new Date().getTime() - this._time) % this.duration) / this.duration;
        return result;
    }
    equals(other: any) {
        return (
            this === other ||
            (other instanceof EarthPolylineTrailLinkMaterialProperty &&
                _Property.equals(this._color, other._color))
        );
    }
}

Object.defineProperties(EarthPolylineTrailLinkMaterialProperty.prototype, {
    color: createPropertyDescriptor("color")
});