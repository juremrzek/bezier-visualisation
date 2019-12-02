class PointDiv {
    constructor(pointDiv, parentElement){
        this.pointDiv = pointDiv;
        this.parentElement = parentElement;
    }
    delete(){
        this.parentElement.removeChild(this.pointDiv);
    }
    append(element){
        this.appendChild(element);
    }
    getElement(){
        return this.pointDiv;
    }
}