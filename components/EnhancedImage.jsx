import { React, getModule, getModuleByDisplayName, contextMenu } from "@vizality/webpack"
import { Modal, Icon, ShinyButton, Button, SearchBar, Anchor, Divider, Text, Avatar } from "@vizality/components"
import { TextInput, SwitchItem, ButtonItem, Category, SliderInput } from '@vizality/components/settings';


module.exports = class EnhancedImage extends React.PureComponent {
    constructor(props){
        super(props)
        this.hooked = false;
        this.magnifierSize = 150;
        this.magnifierZoom = 3;
        this.magnifier;

    }

    settingsCheck(){
        if (this.props.settings.get("circleLens", true)){
            this.magnifier.classList.add("en-img-magnifier-round");
            this.magnifier.classList.remove("en-img-magnifier-square");
        } else {
            this.magnifier.classList.remove("en-img-magnifier-round");
            this.magnifier.classList.add("en-img-magnifier-square");
        }
        if (this.props.settings.get("smoothLens", true)){
            this.magnifier.classList.add("en-img-magnifier-smooth");
        } else {
            this.magnifier.classList.remove("en-img-magnifier-smooth");
        }
        if (this.props.settings.get("antiAliasLens", false)){
            this.magnifier.classList.remove("en-img-magnifier-pixel");
        } else {
            this.magnifier.classList.add("en-img-magnifier-pixel");
        }
        if (this.props.settings.get("borderLens", true)){
            this.magnifier.classList.add("en-img-magnifier-border");
            this.magnifier.style.border = `${this.props.settings.get("lensOutlineWidth", 1)}px ${this.props.settings.get("lensOutlineStyle", "solid")} #${this.props.settings.get("lensOutlineColor", "E91E63")}`
        } else {
            this.magnifier.classList.remove("en-img-magnifier-border");
            this.magnifier.style.border = ``;
        }
    }

    moveEvent(data){
        data = data || window.event;
        var x = data.pageX - this.magnifier.parentElement.getBoundingClientRect().left - window.pageXOffset;
        var y = data.pageY - this.magnifier.parentElement.getBoundingClientRect().top - window.pageYOffset;
        x = Math.min(Math.max(x,0),this.props.width);
        y = Math.min(Math.max(y,0),this.props.height);
        this.magnifier.style.left = `${(x-this.magnifierSize/2)-3}px`;
        this.magnifier.style.top = `${(y-this.magnifierSize/2)-3}px`;
        this.magnifier.style.backgroundPosition = `${-x*this.magnifierZoom+(this.magnifierSize/2)}px ${-y*this.magnifierZoom+(this.magnifierSize/2)}px`;
        // some checks to see if settings have changed
        this.settingsCheck();
        // not inside of image
        if (y <= 0 || data.pageY > this.magnifier.parentElement.getBoundingClientRect().top+this.props.height || x <= 0 || data.pageX > this.magnifier.parentElement.getBoundingClientRect().left+this.props.width){ 
            if (this.props.settings.get("hideLens", true)){
                this.magnifier.classList.add("en-img-magnifier-hide")
                this.magnifier.parentElement.getElementsByClassName("en-img-view")[0].style.filter = ""
                
            }
        } else {
            this.magnifier.classList.remove("en-img-magnifier-hide")
            if (this.props.settings.get("darkenImage", true)){
                this.magnifier.parentElement.getElementsByClassName("en-img-view")[0].style.filter = "brightness(50%)"
            }
        }
       
        this.magnifier.style.backgroundSize  = `${this.props.width * this.magnifierZoom}px ${this.props.height * this.magnifierZoom}px`
    }

    scrollEvent(data){
        data.preventDefault();
        this.magnifierSize += 50 * Math.sign(data.deltaY) * -1;
        this.magnifierSize = Math.min(Math.max(this.magnifierSize, 50),500);
        this.magnifierZoom = 500 / this.magnifierSize;
        this.magnifier.style.width = `${this.magnifierSize}px`
        this.magnifier.style.height = `${this.magnifierSize}px`
        this.moveEvent(data);
    }

    render() {
        return <>
            <div style={{transform:"scale(1)"}}> 
                <div style={{width:this.props.width,height:this.props.height}} className="en-img-wrapper imageWrapper-2p5ogY image-1tIMwV">
                    <div 
                    ref={(e)=>{
                        if (!e || this.hooked)
                            return;

                        this.hooked = true;
                        this.magnifier = e;

                        e.addEventListener("wheel", event => this.scrollEvent(event));
                        e.parentElement.addEventListener("wheel", event => this.scrollEvent(event));
                        e.addEventListener("mousemove", event => this.moveEvent(event));
                        e.parentElement.addEventListener("mousemove", event => this.moveEvent(event));

                        e.style.backgroundImage = `url(${this.props.src})`;
                    }} className="en-img-magnifier-round en-img-magnifier-hide" style={{backgroundRepeat:"no-repeat",position:"fixed",width:`150px`,height:`150px`,zIndex:"999"}}/>
                    <img className="en-img-view" src={this.props.src} style={{width:this.props.width,height:this.props.height}}/>
                </div>
            </div>
        </>
    }
}