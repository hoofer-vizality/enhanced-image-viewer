import { React, getModule, getModuleByDisplayName, contextMenu } from "@vizality/webpack"
import { Modal, Icon, ShinyButton, Button, SearchBar, Anchor, Divider, Text, Avatar } from "@vizality/components"
import { TextInput, SwitchItem, ButtonItem, Category, SliderInput } from '@vizality/components/settings';


module.exports = class EnhancedImage extends React.PureComponent {
    constructor(props){
        super(props)
    }


    render() {
        return <>
            <div style={{transform:"scale(1)"}}> 
                <div style={{width:this.props.width,height:this.props.height}} className="en-img-wrapper imageWrapper-2p5ogY image-1tIMwV">
                    <div 
                    ref={(e)=>{
                        if (!e)
                            return;

                        const width = this.props.width;
                        const height = this.props.height;
                        const settings = this.props.settings;
                        function move(data){
                            data = data || window.event;
                            var x = data.pageX - e.parentElement.getBoundingClientRect().left - window.pageXOffset;
                            var y = data.pageY - e.parentElement.getBoundingClientRect().top - window.pageYOffset;
                            x = Math.min(Math.max(x,0),width);
                            y = Math.min(Math.max(y,0),height);
                            e.style.left = `${x-100}px`;
                            e.style.top = `${y-100}px`;
                            e.style.backgroundPosition = `${-x*3+100}px ${-y*3+100}px`;
                            // some checks to see if settings have changed
                            if (settings.get("circleLens", true)){
                                e.classList.add("en-img-magnifier-round");
                                e.classList.remove("en-img-magnifier-square");
                            } else {
                                e.classList.remove("en-img-magnifier-round");
                                e.classList.add("en-img-magnifier-square");
                            }
                            if (settings.get("smoothLens", true)){
                                e.classList.add("en-img-magnifier-smooth");
                            } else {
                                e.classList.remove("en-img-magnifier-smooth");
                            }
                            if (settings.get("antiAliasLens", false)){
                                e.classList.remove("en-img-magnifier-pixel");
                            } else {
                                e.classList.add("en-img-magnifier-pixel");
                            }
                            if (settings.get("borderLens", true)){
                                e.classList.add("en-img-magnifier-border");
                            } else {
                                e.classList.remove("en-img-magnifier-border");
                            }
                            // not inside of image
                            if (y <= 0 || data.pageY > e.parentElement.getBoundingClientRect().top+height || x <= 0 || data.pageX > e.parentElement.getBoundingClientRect().left+width){ 
                                if (settings.get("hideLens", true)){
                                    e.classList.add("en-img-magnifier-hide")
                                }
                            } else {
                                e.classList.remove("en-img-magnifier-hide")
                            }
                        }
                        e.addEventListener("mousemove", move);
                        e.parentElement.addEventListener("mousemove", move);
                        e.style.backgroundImage = `url(${this.props.src})`
                        e.style.backgroundSize  = `${this.props.width * 3}px ${this.props.height * 3}px`
                    }} className="en-img-magnifier-round en-img-magnifier-hide" style={{backgroundRepeat:"no-repeat",position:"fixed",width:"200px",height:"200px",zIndex:"999"}}/>
                    <img className="en-img-view" src={this.props.src} style={{width:this.props.width,height:this.props.height}}/>
                </div>
            </div>
        </>
    }
}