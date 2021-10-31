import { Cartesian2, SceneTransforms, Viewer,Cartesian3 } from "cesium"

export class Popup {
    private viewer?: Viewer
    private cartesian3?: Cartesian3
    constructor(viewer: Viewer) {
        this.viewer = viewer
        this.init(viewer)
    }
    init(viewer: Viewer) {
        this.addDom(viewer)
        this.addCloseListen()
        this.addMapListen()
    }

    addMapListen() {
        this.viewer?.scene.postRender.addEventListener(() => {
            if (this.cartesian3 && this.viewer) {
                const position = SceneTransforms.wgs84ToWindowCoordinates(this.viewer.scene, this.cartesian3);
                this.calculatePosition(position)
            }
        });
    }


    showInfo(position: Cartesian2, html: string) {
        if (this.viewer) {
            const ray = this.viewer.camera.getPickRay(position);
            this.cartesian3 = this.viewer.scene.globe.pick(ray, this.viewer.scene);
            this.calculatePosition(position)
            this.info(html)
        }
    }

    info = (html: string) => {
        const element: any = this.getPopupContentElement()
        element.innerHTML = ''
        if (element) {
            const popupContentContainer = document.createElement("div")
            popupContentContainer.innerHTML = html
            element.appendChild(popupContentContainer)
        }
    }

    addDom(viewer: Viewer) {
        const container = viewer.container
        const popupContainer = document.createElement("div")
        const html = '<div class="self-define-popup">' +
            '<div class="self-define-popup-close-button">×</div>' +
            '<div class="self-define-popup-content"></div>' +
            '</div>'
        popupContainer.innerHTML = html
        container.appendChild(popupContainer)
    }

    getPopupElement() {
        const elements = document.getElementsByClassName("self-define-popup")
        if (elements && elements[0]) {
            return elements[0]
        }
        return undefined
    }

    getPopupContentElement() {
        const elements = document.getElementsByClassName("self-define-popup-content")
        if (elements && elements[0]) {
            return elements[0]
        }
        return undefined
    }

    getPopupCloseElement() {
        const elements = document.getElementsByClassName("self-define-popup-close-button")
        if (elements && elements[0]) {
            return elements[0]
        }
        return undefined
    }


    addCloseListen() {
        const closeElement: any = this.getPopupCloseElement()
        if (closeElement) {
            closeElement.onclick = () => {
                const element: any = this.getPopupElement()
                this.hide(element)
                this.cartesian3 = undefined
            }
        }
    }

    calculatePosition(position: Cartesian2) {
        const element: any = this.getPopupElement()
        if (element) {
            this.show(element)
            const x = position.x - element.clientWidth / 2
            const y = position.y - element.clientHeight
            element.style.left = `${x}px`
            element.style.top = `${y}px`
        }
    }

    show(element: HTMLDivElement) {
        if (element) {
            element.style.display = "block"
        }
    }

    hide(element: HTMLDivElement) {
        if (element) {
            element.style.display = "none"
        }
    }
}