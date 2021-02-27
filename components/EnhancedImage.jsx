import { React, getModule, getModuleByDisplayName, contextMenu } from "@vizality/webpack"
import { Modal, Icon, ShinyButton, Button, SearchBar, Anchor, Divider, Text, Avatar, KeyboardShortcut } from "@vizality/components"
import { TextInput, SwitchItem, ButtonItem, Category, SliderInput } from '@vizality/components/settings';


module.exports = class EnhancedImage extends React.PureComponent {
    constructor(props){
        super(props)
        this.hooked = false;
        this.forceLensHidden = true;
        this.magnifierSize = this.props.settings.get("lensInitialSize",150);
        this.magnifierZoom = 3;
        this.magnifierScale = this.magnifierSize + 50;
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
        // initial stuffs
        data = data || window.event;
        var x = data.pageX - this.magnifier.parentElement.getBoundingClientRect().left - window.pageXOffset;
        var y = data.pageY - this.magnifier.parentElement.getBoundingClientRect().top - window.pageYOffset;
        x = Math.min(Math.max(x,0),this.props.width);
        y = Math.min(Math.max(y,0),this.props.height);
        // some checks to see if settings have changed
        this.settingsCheck();
        // not inside of image
        if (this.forceLensHidden || y <= 0 || data.pageY > this.magnifier.parentElement.getBoundingClientRect().top+this.props.height || x <= 0 || data.pageX > this.magnifier.parentElement.getBoundingClientRect().left+this.props.width){ 
            if (this.props.settings.get("hideLens", true) || this.forceLensHidden){
                this.magnifier.classList.add("en-img-magnifier-hide");
                this.magnifier.parentElement.getElementsByClassName("en-img-view")[0].style.filter = "";
                this.forceLensHidden = true;
            }
        } else {
            this.magnifier.classList.remove("en-img-magnifier-hide");
            if (this.props.settings.get("darkenImage", true)){
                this.magnifier.parentElement.getElementsByClassName("en-img-view")[0].style.filter = "brightness(50%)";
            }

        }
        // more positioning & sizing
        this.magnifierZoom = this.magnifierScale / this.magnifierSize;
        this.magnifier.style.width = `${this.magnifierSize}px`
        this.magnifier.style.height = `${this.magnifierSize}px`
        this.magnifier.style.left = `${(x-this.magnifierSize/2)}px`;
        this.magnifier.style.top = `${(y-this.magnifierSize/2)}px`;
        this.magnifier.style.backgroundPosition = `${Math.round(-x*this.magnifierZoom+(this.magnifierSize/2)-(this.props.settings.get("borderLens", true) && this.props.settings.get("lensOutlineWidth", 1) || 0))}px ${Math.round(-y*this.magnifierZoom+(this.magnifierSize/2)-(this.props.settings.get("borderLens", true) && this.props.settings.get("lensOutlineWidth", 1) || 0))}px`;
        this.magnifier.style.backgroundSize  = `${this.props.width * this.magnifierZoom}px ${this.props.height * this.magnifierZoom}px`;
    }

    scrollEvent(data){
        data.preventDefault();
        if (data.ctrlKey == !this.props.settings.get("invertLensControls", false)){
            this.magnifierScale += 50 * Math.sign(data.deltaY) * -1;
           
        } else {
            this.magnifierSize += 50 * Math.sign(data.deltaY) * -1;
        }

        this.magnifierSize = Math.min(Math.max(this.magnifierSize, 50),500);
        this.magnifierScale = Math.min(Math.max(this.magnifierScale, this.magnifierSize),10000);
        this.moveEvent(data);
    }

    mouseDownEvent(data){
        data.preventDefault();
        this.forceLensHidden = !this.forceLensHidden;
        this.moveEvent(data);
    }

    mouseUpEvent(data){
        data.preventDefault();
        //this.forceLensHidden = true;
        this.moveEvent(data);
    }

    render() {
        return <>
            <div style={{transform:"scale(1)"}}> 
                <div style={{width:this.props.width,height:this.props.height}} className={`en-img-wrapper ${getModule("imageWrapper").imageWrapper} ${getModule(h=>h.modal && h.image && !h.content && !h.information).image}`}>
                    <div 
                        ref={(e)=>{
                            if (!e || this.hooked)
                                return;

                            this.hooked = true;
                            this.magnifier = e;

                            e.addEventListener("mousemove", event => this.moveEvent(event));
                            e.parentElement.addEventListener("wheel", event => this.scrollEvent(event));
                            e.parentElement.addEventListener("mousemove", event => this.moveEvent(event));
                            e.parentElement.addEventListener("mousedown", event => this.mouseDownEvent(event));
                            e.parentElement.addEventListener("mouseup", event => this.mouseUpEvent(event));
                            e.style.backgroundImage = `url(${this.props.src})`;
                        }}
                        className="en-img-magnifier-round en-img-magnifier-hide"
                        style={{backgroundRepeat:"no-repeat",position:"fixed",width:`150px`,height:`150px`,zIndex:"1"}}
                    />
                    <img
                        className="en-img-view"
                        draggable={false}
                        src={this.props.src}
                        style={{width:this.props.width,height:this.props.height}}
                    />
                </div>

                <a
                className={getModule("downloadLink").downloadLink}
                onClick={(e)=>{
                    e.preventDefault();
                    getModule('openModal').useModalsStore.setState(() => ({ default: [] }));
                    require('electron').shell.openExternal(this.props.src);
                }}
                ><svg aria-hidden="true" style={{marginRight:"3px"}} width="10px" height="10px" class="svg-inline--fa fa-link fa-w-16 fa-9x" data-icon="link" data-prefix="fas" viewBox="0 0 512 512"><path fill="currentColor" d="M326.612 185.391c59.747 59.809 58.927 155.698.36 214.59-.11.12-.24.25-.36.37l-67.2 67.2c-59.27 59.27-155.699 59.262-214.96 0-59.27-59.26-59.27-155.7 0-214.96l37.106-37.106c9.84-9.84 26.786-3.3 27.294 10.606.648 17.722 3.826 35.527 9.69 52.721 1.986 5.822.567 12.262-3.783 16.612l-13.087 13.087c-28.026 28.026-28.905 73.66-1.155 101.96 28.024 28.579 74.086 28.749 102.325.51l67.2-67.19c28.191-28.191 28.073-73.757 0-101.83-3.701-3.694-7.429-6.564-10.341-8.569a16.037 16.037 0 0 1-6.947-12.606c-.396-10.567 3.348-21.456 11.698-29.806l21.054-21.055c5.521-5.521 14.182-6.199 20.584-1.731a152.482 152.482 0 0 1 20.522 17.197zM467.547 44.449c-59.261-59.262-155.69-59.27-214.96 0l-67.2 67.2c-.12.12-.25.25-.36.37-58.566 58.892-59.387 154.781.36 214.59a152.454 152.454 0 0 0 20.521 17.196c6.402 4.468 15.064 3.789 20.584-1.731l21.054-21.055c8.35-8.35 12.094-19.239 11.698-29.806a16.037 16.037 0 0 0-6.947-12.606c-2.912-2.005-6.64-4.875-10.341-8.569-28.073-28.073-28.191-73.639 0-101.83l67.2-67.19c28.239-28.239 74.3-28.069 102.325.51 27.75 28.3 26.872 73.934-1.155 101.96l-13.087 13.087c-4.35 4.35-5.769 10.79-3.783 16.612 5.864 17.194 9.042 34.999 9.69 52.721.509 13.906 17.454 20.446 27.294 10.606l37.106-37.106c59.271-59.259 59.271-155.699.001-214.959z"/></svg>Open Original</a>
                
                <a
                className={getModule("downloadLink").downloadLink}
                onClick={(e)=>{
                    e.preventDefault();
                    getModule('openModal').useModalsStore.setState(() => ({ default: [] }));
                    getModule(["transitionTo"], false).transitionTo("/vizality/plugins/enhanced-image-viewer");
                }}
                ><svg aria-hidden="true" style={{marginRight:"3px"}} width="10px" height="10px" class="svg-inline--fa fa-cog fa-w-16 fa-7x" data-icon="cog" data-prefix="fas" viewBox="0 0 512 512"><path fill="currentColor" d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"/></svg>Plugin Settings</a>
            
            </div>
        </>
    }
}