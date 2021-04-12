// Add code here
const fs = require('fs');
class GenericElement {
    constructor (name){
        this.name=name;
        this.children=[];
    }
    addAttrs(obj){ 
        Object.assign(this, obj);
    }
    addAttr (name, value ){
        const newatt = {};
        newatt[name]=value;
        Object.assign(this, newatt);
    }
    addChild(child) {
        this.children.push(child);
    }

    toString() {
        let content_inside = false;
        let res = '';
        const arrOfprop = Object.entries(this);
        arrOfprop.map((prop)=>{ 
            if(prop[0]==="name"){
                res+= '<'+prop[1];
            } else if(prop[0]==="children"){
                //pass
            } else if(prop[0]==="fontSize"){
                res+='font-size ='+'"'+ prop[1]+'"';
            } else if(prop[0]==="content"){
                res+='>'+prop[1];
                content_inside=true;
            } else{
                res+=' '+ prop[0]+'='+'"'+prop[1]+'"';} 
        }); 
        if(!content_inside){res+='>';}
        if(this.children.length!==0){
            this.children.map((prop)=>{
                const childrens =Object.entries(prop);
                content_inside=false;
                childrens.map((children_prop)=>{content_inside=false;
                    if(children_prop[0]==="name"){
                        res+= '\n<'+children_prop[1];
                    }
                    else if(children_prop[0]==="children"){
                        //do nothing
                    }
                    else if(children_prop[0]==="fontSize"){
                        res+=' '+'font-size ='+'"'+ children_prop[1]+'"';
                    }
                    else if(children_prop[0]==="content"){
                        content_inside=true;
                        res+='>'+children_prop[1];
                    }
                    else{
                        res+=' '+ children_prop[0]+'='+'"'+children_prop[1]+'"';
                    }
                });
                if(!content_inside){res+='>';}res+= '\n</'+prop.name+'>';
            });
        }
        res+='\n'
        res+='</'+this.name+'>';
        return res;
    }
    // toGetStartTag(){
    //     let res ='<';
    //     if (this.name==='svg'){//meaning root
    //         for(const prop in this){
    //             if (prop==='children'){
    //                 //do nothing
    //             }
    //             else{
    //                 res+= (' '+prop.toString()+'='+this[prop].toString());
    //             }
    //         }
    //     }
    //     res+='>'
    //     return res; 
    // }

    write(fileName, cb){
        
        const svgcontent = this.toString();
        fs.writeFile(fileName, svgcontent, 'utf8' ,function(err){
            if(err){
                return console.log(error);
            } 
            cb();
            
        });
    }
    
}

class RootElement extends GenericElement{
    constructor () {
        super('svg');
        this.xmlns='http://www.w3.org/2000/svg';      
    }
    addChild(child) {
        super.addChild(child);
    }
    toString(){
        super.toString();
        return super.toString();
    }
    addAttrs(obj){ 
       super.addAttrs(obj);
    }
    addAttr (name, value ){
        super.addAttr(name,value);
    }
    write(fileName, cb){
        super.write(fileName,cb);
    }
}

class RectangleElement extends GenericElement{
    constructor(x, y, width, height, fill){
        super('rect');
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.fill=fill;
    } 
    addAttr(name,value){
        super.addAttr(name,value);
    }
    addAttrs(obj){ 
        super.addAttrs(obj);
    }

}
class TextElement extends GenericElement {
    constructor (x,y,fontSize, fill,content){
        super('text');
        this.x=x;
        this.y=y;
        this.fontSize=fontSize;
        this.fill=fill;
        this.content=content;
    }
}


module.exports ={
    GenericElement: GenericElement,
    RootElement: RootElement,
    RectangleElement: RectangleElement,
    TextElement:TextElement
};
